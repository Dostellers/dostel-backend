const assert = require('assert');

process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key-not-used';

const guestMemory = require('../src/services/guestMemoryService');
const Customer = require('../src/models/customer');

const validate = document => new Promise(resolve => document.validate(error => resolve(error)));

const DAY = 24 * 60 * 60 * 1000;

const run = async () => {
    const {
        normalizeFact,
        resolveSubject,
        attachFact,
        buildUserContent,
        parseResponse,
        EXTRACTION_SCHEMA,
        CATEGORIES,
        MAX_TOKENS
    } = guestMemory;

    // --- policy rules that must not depend on the model ---------------------
    // These are the rules a wrong extraction could otherwise violate, so they
    // are enforced in code and asserted here rather than trusted to the prompt.

    const caution = normalizeFact({
        subjectName: 'Marco',
        category: 'caution',
        text: 'Was aggressive with another guest on the last stay.',
        confidence: 'high',
        durability: 'lasting'
    });
    assert.strictEqual(caution.visibility, 'staff_only', 'cautions are never guest-visible');
    assert.strictEqual(caution.reviewStatus, 'pending', 'cautions always get a human look first');

    // Even a confidently-extracted caution stays staff-only — the model does not
    // get to promote one to guest-visible.
    const confidentCaution = normalizeFact({
        subjectName: 'Marco',
        category: 'caution',
        text: 'x',
        confidence: 'high',
        durability: 'stay'
    });
    assert.strictEqual(confidentCaution.visibility, 'staff_only');

    const lowConfidence = normalizeFact({
        subjectName: 'Priya',
        category: 'interest',
        text: 'Might play guitar.',
        confidence: 'low',
        durability: 'season'
    });
    assert.strictEqual(lowConfidence.reviewStatus, 'pending', 'low confidence queues for review');

    const clear = normalizeFact({
        subjectName: 'Priya',
        category: 'dietary',
        text: 'Does not eat dairy.',
        confidence: 'high',
        durability: 'lasting'
    });
    assert.strictEqual(clear.reviewStatus, 'approved');
    assert.strictEqual(clear.visibility, 'guest_visible');

    // --- expiry -------------------------------------------------------------
    const now = new Date('2026-08-07T00:00:00Z');
    const stay = normalizeFact({ category: 'logistics', text: 'x', confidence: 'high', durability: 'stay' }, now);
    const lasting = normalizeFact({ category: 'dietary', text: 'x', confidence: 'high', durability: 'lasting' }, now);

    assert.strictEqual(stay.expiresAt.getTime(), now.getTime() + 30 * DAY, 'stay facts expire in 30 days');
    assert.strictEqual(lasting.expiresAt.getTime(), now.getTime() + 1095 * DAY, 'lasting facts expire in ~3 years');
    assert.ok(lasting.expiresAt > stay.expiresAt, 'a dietary need outlives a logistics note');

    // Every fact expires — there is no permanent record of a guest.
    ['stay', 'season', 'lasting'].forEach(durability => {
        const f = normalizeFact({ category: 'interest', text: 'x', confidence: 'high', durability }, now);
        assert.ok(f.expiresAt instanceof Date, `${durability} facts carry an expiry`);
    });

    // --- defensive normalization -------------------------------------------
    const garbage = normalizeFact({ category: 'not_a_category', text: '  spaced  ', confidence: 'weird', durability: 'forever' }, now);
    assert.strictEqual(garbage.category, 'logistics', 'unknown category falls back rather than throwing');
    assert.strictEqual(garbage.confidence, 'low', 'unknown confidence is treated as low');
    assert.strictEqual(garbage.reviewStatus, 'pending', 'and therefore queues for review');
    assert.strictEqual(garbage.text, 'spaced', 'text is trimmed');
    assert.strictEqual(garbage.expiresAt.getTime(), now.getTime() + 180 * DAY, 'unknown durability falls back to season');

    // --- subject resolution -------------------------------------------------
    const candidates = [
        { id: '1', fullName: 'Priya Raman', country: 'India' },
        { id: '2', fullName: 'Marco Rossi', country: 'Italy' },
        { id: '3', fullName: 'Priya Sharma', country: 'India' }
    ];

    assert.strictEqual(resolveSubject('Marco Rossi', candidates).id, '2', 'exact full name resolves');
    assert.strictEqual(resolveSubject('marco rossi', candidates).id, '2', 'match is case-insensitive');
    assert.strictEqual(resolveSubject('Marco', candidates).id, '2', 'unique first name resolves');
    assert.strictEqual(resolveSubject('Rossi', candidates).id, '2', 'unique surname resolves');

    // Two guests named Priya: refuse rather than pick one. Attaching a fact to
    // the wrong guest is the failure mode this whole feature must avoid.
    assert.strictEqual(resolveSubject('Priya', candidates), null, 'ambiguous first name refuses to guess');
    assert.strictEqual(resolveSubject('Priya Raman', candidates).id, '1', 'the full name disambiguates');

    assert.strictEqual(resolveSubject('', candidates), null, 'empty name resolves to nobody');
    assert.strictEqual(resolveSubject(null, candidates), null, 'null name resolves to nobody');
    assert.strictEqual(resolveSubject('Yuki', candidates), null, 'an unknown name resolves to nobody');
    assert.strictEqual(resolveSubject('Marco', []), null, 'nobody on property means no match');

    // --- attach + surface ---------------------------------------------------
    const customer = new Customer({ fullName: 'Priya Raman', phone: '9876543210' });

    attachFact(customer, clear, {
        capturedBy: 'Anand (reception)',
        source: 'whatsapp_voice',
        sourceExcerpt: "Priya doesn't eat dairy"
    });
    attachFact(customer, caution, { capturedBy: 'Anand (reception)', source: 'whatsapp_voice' });
    attachFact(customer, lowConfidence, { capturedBy: 'Anand (reception)', source: 'whatsapp_text' });

    assert.strictEqual(await validate(customer), null, 'a customer with guest facts is valid');
    assert.strictEqual(customer.guestFacts.length, 3);
    assert.strictEqual(customer.guestFacts[0].capturedBy, 'Anand (reception)', 'facts are attributed');
    assert.strictEqual(customer.guestFacts[0].sourceExcerpt, "Priya doesn't eat dairy", 'the original wording is kept');

    const staffView = customer.activeGuestFacts('staff');
    assert.strictEqual(staffView.length, 1, 'only approved facts surface, even to staff');
    assert.strictEqual(staffView[0].text, 'Does not eat dairy.');

    const guestView = customer.activeGuestFacts('guest');
    assert.strictEqual(guestView.length, 1);
    assert.ok(!guestView.some(f => f.category === 'caution'), 'a guest never sees a caution');

    // An approved caution is still staff-only — approval is not what gates it.
    const approvedCaution = new Customer({ fullName: 'Test', phone: '9876543210' });
    approvedCaution.guestFacts.push({
        text: 'Staff-only note.',
        category: 'caution',
        capturedBy: 'Manager',
        source: 'admin',
        confidence: 'high',
        reviewStatus: 'approved',
        visibility: 'staff_only'
    });
    assert.strictEqual(approvedCaution.activeGuestFacts('staff').length, 1);
    assert.strictEqual(approvedCaution.activeGuestFacts('guest').length, 0, 'visibility gates independently of review');

    // --- expiry gating ------------------------------------------------------
    const expired = new Customer({ fullName: 'Test', phone: '9876543210' });
    expired.guestFacts.push({
        text: 'Waiting on a parcel.',
        category: 'logistics',
        capturedBy: 'Anand',
        source: 'whatsapp_text',
        confidence: 'high',
        reviewStatus: 'approved',
        expiresAt: new Date(Date.now() - DAY)
    });
    assert.strictEqual(expired.activeGuestFacts('staff').length, 0, 'expired facts stop surfacing');

    const noExpiry = new Customer({ fullName: 'Test', phone: '9876543210' });
    noExpiry.guestFacts.push({
        text: 'Manually added, no expiry.',
        category: 'interest',
        capturedBy: 'Manager',
        source: 'admin',
        confidence: 'high',
        reviewStatus: 'approved'
    });
    assert.strictEqual(noExpiry.activeGuestFacts('staff').length, 1, 'a fact without an expiry still surfaces');

    // --- model validation ---------------------------------------------------
    const anonymous = new Customer({ fullName: 'Test', phone: '9876543210' });
    anonymous.guestFacts.push({ text: 'x', category: 'caution', source: 'admin', confidence: 'high' });
    const anonError = await validate(anonymous);
    assert.ok(anonError && anonError.errors, 'a fact with no capturedBy is rejected — no anonymous notes about guests');

    const badCategory = new Customer({ fullName: 'Test', phone: '9876543210' });
    badCategory.guestFacts.push({ text: 'x', category: 'gossip', capturedBy: 'A', source: 'admin', confidence: 'high' });
    assert.ok(await validate(badCategory), 'an unknown category is rejected at the model');

    // --- prompt construction ------------------------------------------------
    const content = buildUserContent('Priya avoids dairy', candidates);
    assert.ok(content.includes('Priya Raman (India)'), 'the roster is included so the model can resolve names');
    assert.ok(content.includes('Priya avoids dairy'), 'the note is included');

    const empty = buildUserContent('a note', []);
    assert.ok(empty.includes('no guests currently on property'), 'an empty roster is stated, not omitted');

    // --- response parsing ---------------------------------------------------
    const parsed = parseResponse({
        content: [{ type: 'text', text: '{"facts":[],"needsClarification":false,"clarificationQuestion":""}' }]
    });
    assert.deepStrictEqual(parsed.facts, []);

    assert.throws(
        () => parseResponse({ content: [{ type: 'thinking', thinking: '' }] }),
        /no text block/,
        'a response with no text block fails loudly rather than writing nothing silently'
    );
    assert.throws(
        () => parseResponse({ content: [{ type: 'text', text: 'not json' }] }),
        'malformed JSON fails rather than writing junk to a customer'
    );

    // --- request shape ------------------------------------------------------
    // Structured-output schema constraints the API enforces.
    assert.strictEqual(EXTRACTION_SCHEMA.additionalProperties, false);
    const factSchema = EXTRACTION_SCHEMA.properties.facts.items;
    assert.strictEqual(factSchema.additionalProperties, false);
    assert.deepStrictEqual(
        factSchema.required.slice().sort(),
        Object.keys(factSchema.properties).sort(),
        'every fact property is required — structured outputs need the full set'
    );
    assert.deepStrictEqual(factSchema.properties.category.enum, CATEGORIES, 'schema and model enums agree');

    // Thinking is on by default on Claude Opus 5 and shares max_tokens with the
    // response, so a budget sized only for the JSON would truncate.
    assert.ok(MAX_TOKENS >= 4096, 'max_tokens leaves headroom for thinking');

    console.log('guestMemory: all assertions passed');
};

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
