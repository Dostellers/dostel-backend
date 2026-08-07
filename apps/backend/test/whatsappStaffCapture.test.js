const assert = require('assert');
const crypto = require('crypto');

process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
process.env.WHATSAPP_STAFF_NUMBERS = '9876543210:Anand (reception), +919000000001:Meera (manager), 9111111111';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';

const whatsapp = require('../src/routes/whatsapp');
const transcription = require('../src/services/transcriptionService');

const sign = (body, secret = 'test-app-secret') =>
    'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');

const req = (body, header) => ({
    body: Buffer.from(body),
    get: name => (name.toLowerCase() === 'x-hub-signature-256' ? header : undefined)
});

const run = async () => {
    const { staffDirectory, verifySignature, extractMessages, applyFacts, summarise } = whatsapp;

    // --- signature verification --------------------------------------------
    // Without this the endpoint is an unauthenticated write to guest records.
    const body = JSON.stringify({ entry: [] });

    assert.strictEqual(verifySignature(req(body, sign(body))), true, 'a correctly signed body verifies');
    assert.strictEqual(verifySignature(req(body, sign(body, 'wrong-secret'))), false, 'a wrong secret is rejected');
    assert.strictEqual(verifySignature(req(body, undefined)), false, 'a missing signature is rejected');
    assert.strictEqual(verifySignature(req(body, 'garbage')), false, 'a malformed header is rejected');
    assert.strictEqual(verifySignature(req(body, 'sha256=abc')), false, 'a wrong-length digest is rejected without throwing');

    // The signature covers the body, so tampering must invalidate it.
    const tampered = JSON.stringify({ entry: [{ evil: true }] });
    assert.strictEqual(verifySignature(req(tampered, sign(body))), false, 'a modified body fails its original signature');

    // No secret configured must fail closed, not open.
    const savedSecret = process.env.WHATSAPP_APP_SECRET;
    delete process.env.WHATSAPP_APP_SECRET;
    assert.strictEqual(verifySignature(req(body, sign(body, savedSecret))), false, 'a missing app secret rejects everything');
    process.env.WHATSAPP_APP_SECRET = savedSecret;

    // --- staff allowlist ----------------------------------------------------
    const directory = staffDirectory();

    assert.strictEqual(directory.get('+919876543210'), 'Anand (reception)', 'a bare 10-digit number normalizes');
    assert.strictEqual(directory.get('+919000000001'), 'Meera (manager)', 'an E.164 number normalizes');
    assert.strictEqual(directory.get('+919111111111'), '+919111111111', 'an entry with no name falls back to the number');
    assert.strictEqual(directory.get('+919999999999'), undefined, 'a guest number is not in the directory');
    assert.strictEqual(directory.size, 3, 'only the configured numbers are present');

    // A note must always be attributable to a named person.
    directory.forEach(name => assert.ok(name && name.length, 'every directory entry yields a capturedBy name'));

    // --- payload parsing ----------------------------------------------------
    const payload = {
        entry: [{
            changes: [{
                value: {
                    messages: [
                        { from: '919876543210', type: 'text', text: { body: "Priya doesn't eat dairy" } },
                        { from: '919876543210', type: 'audio', audio: { id: 'media_1' } }
                    ]
                }
            }]
        }]
    };
    assert.strictEqual(extractMessages(payload).length, 2, 'messages are pulled out of the nested envelope');

    // Meta sends status-only callbacks with no messages at all.
    assert.deepStrictEqual(extractMessages({ entry: [{ changes: [{ value: { statuses: [] } }] }] }), [], 'a status callback yields no messages');
    assert.deepStrictEqual(extractMessages({}), [], 'an empty payload yields no messages');
    assert.deepStrictEqual(extractMessages({ entry: [{}] }), [], 'an entry with no changes yields no messages');

    // --- unresolved subjects are never guessed ------------------------------
    const candidates = [
        { id: 'a', fullName: 'Priya Raman' },
        { id: 'b', fullName: 'Priya Sharma' }
    ];

    const facts = [
        { subjectName: 'Priya', category: 'dietary', text: 'No dairy.', confidence: 'high', reviewStatus: 'approved', visibility: 'guest_visible', expiresAt: new Date() },
        { subjectName: 'Nobody Here', category: 'interest', text: 'Plays guitar.', confidence: 'high', reviewStatus: 'approved', visibility: 'guest_visible', expiresAt: new Date() }
    ];

    // Neither resolves, so nothing is written and no database call is needed.
    const result = await applyFacts(facts, candidates, { capturedBy: 'Anand', source: 'whatsapp_text', sourceExcerpt: 'x' });
    assert.strictEqual(result.saved, 0, 'ambiguous and unknown subjects write nothing');
    assert.strictEqual(result.unresolved.length, 2, 'both are returned for a follow-up question');

    // --- staff replies ------------------------------------------------------
    assert.strictEqual(summarise(0, []), 'Nothing to note from that one.');
    assert.strictEqual(summarise(1, []), 'Noted 1 thing.');
    assert.strictEqual(summarise(3, []), 'Noted 3 things.', 'plural agrees');

    const ambiguous = summarise(0, [{ subjectName: 'Priya' }]);
    assert.ok(ambiguous.includes('Priya'), 'the ambiguous name is quoted back');
    assert.ok(ambiguous.includes('who did you mean'), 'and the staff member is asked');

    const nameless = summarise(0, [{ subjectName: '' }]);
    assert.ok(nameless.includes('which guest'), 'a nameless subject still prompts a question');

    const mixed = summarise(2, [{ subjectName: 'Priya' }]);
    assert.ok(mixed.includes('Noted 2 things'), 'partial success is reported');
    assert.ok(mixed.includes('Priya'), 'alongside the unresolved part');

    // --- transcription gate -------------------------------------------------
    transcription._reset();
    delete process.env.TRANSCRIPTION_PROVIDER;
    assert.strictEqual(transcription.isConfigured(), false, 'no provider means not configured');

    await assert.rejects(
        () => transcription.transcribe({ buffer: Buffer.from(''), mimeType: 'audio/ogg' }),
        /No TRANSCRIPTION_PROVIDER/,
        'transcribing without a provider fails loudly'
    );

    // A provider named but not registered must not silently pass either.
    process.env.TRANSCRIPTION_PROVIDER = 'ghost';
    assert.strictEqual(transcription.isConfigured(), false, 'a named-but-unregistered provider is not configured');
    await assert.rejects(
        () => transcription.transcribe({ buffer: Buffer.from(''), mimeType: 'audio/ogg' }),
        /no such provider is registered/
    );

    // With one registered, the path works and language hints reach the provider.
    let seenHints = null;
    transcription.registerProvider('ghost', async ({ languageHints }) => {
        seenHints = languageHints;
        return { text: '  Priya avoids dairy  ', language: 'en' };
    });

    assert.strictEqual(transcription.isConfigured(), true);
    const transcribed = await transcription.transcribe({ buffer: Buffer.from(''), mimeType: 'audio/ogg' });
    assert.strictEqual(transcribed.text, 'Priya avoids dairy', 'the transcript is trimmed');
    assert.strictEqual(transcribed.provider, 'ghost', 'the provider is recorded');
    assert.deepStrictEqual(seenHints, ['ta', 'hi', 'en'], 'Tamil and Hindi are hinted by default, not just English');

    // A provider returning nothing usable is an error, not an empty note.
    transcription.registerProvider('broken', async () => ({}));
    process.env.TRANSCRIPTION_PROVIDER = 'broken';
    await assert.rejects(
        () => transcription.transcribe({ buffer: Buffer.from(''), mimeType: 'audio/ogg' }),
        /returned no text/
    );

    transcription._reset();
    delete process.env.TRANSCRIPTION_PROVIDER;

    console.log('whatsappStaffCapture: all assertions passed');
};

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
