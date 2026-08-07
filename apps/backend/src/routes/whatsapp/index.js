const express = require('express');
const crypto = require('crypto');
const Booking = require('../../models/booking');
const Customer = require('../../models/customer');
const guestMemory = require('../../services/guestMemoryService');
const transcription = require('../../services/transcriptionService');
const { normalizePhone } = require('../../services/portalService');
const logger = require('../../config/logger');

const router = express.Router();

/**
 * Staff guest-memory capture over WhatsApp (DOS-502).
 *
 * A staff member sends a note — "Priya doesn't eat dairy" — and it becomes a
 * structured fact on that guest's record. This is the first WhatsApp surface in
 * the codebase; DOS-291's opt-in flow should extend it rather than add a second.
 */

// The raw body is needed to verify Meta's signature, so this route must not sit
// behind a JSON parser. Parsing happens after the signature checks out.
router.use(express.raw({ type: '*/*', limit: '1mb' }));

const LOOKAHEAD_DAYS = parseInt(process.env.GUEST_MEMORY_LOOKAHEAD_DAYS || '3', 10);

/**
 * Staff numbers permitted to write guest facts. Anyone else is ignored — a guest
 * who finds this number must not be able to write notes about other guests.
 */
function staffDirectory() {
    const raw = process.env.WHATSAPP_STAFF_NUMBERS || '';
    const directory = new Map();

    raw.split(',').forEach(entry => {
        const [phone, ...nameParts] = entry.split(':');
        const normalized = normalizePhone((phone || '').trim());
        if (!normalized) return;
        directory.set(normalized, nameParts.join(':').trim() || normalized);
    });

    return directory;
}

/**
 * Verify Meta's X-Hub-Signature-256 over the raw request body.
 *
 * Without this the endpoint is a public write to guest records — anyone who
 * learns the URL could post notes about guests.
 */
function verifySignature(req) {
    const secret = process.env.WHATSAPP_APP_SECRET;
    if (!secret) {
        logger.error('whatsapp: WHATSAPP_APP_SECRET is not configured; rejecting webhook');
        return false;
    }

    const header = req.get('x-hub-signature-256');
    if (!header || !header.startsWith('sha256=')) return false;

    const expected = 'sha256=' + crypto
        .createHmac('sha256', secret)
        .update(req.body)
        .digest('hex');

    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(header, 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

/**
 * GET /api/whatsapp/staff — Meta's subscription handshake.
 */
router.get('/staff', (req, res) => {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && verifyToken && token === verifyToken) {
        return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
});

/**
 * POST /api/whatsapp/staff — inbound staff messages.
 *
 * Acknowledges immediately and processes afterwards: Meta retries on a slow or
 * failed response, and a retry would re-extract the same note into duplicate
 * facts. Processing errors are logged, not surfaced as a non-2xx.
 */
router.post('/staff', async (req, res) => {
    if (!verifySignature(req)) {
        logger.warn('whatsapp: rejected a webhook with an invalid signature');
        return res.sendStatus(403);
    }

    let payload;
    try {
        payload = JSON.parse(req.body.toString('utf8'));
    } catch (err) {
        logger.warn('whatsapp: rejected a webhook with an unparseable body');
        return res.sendStatus(400);
    }

    res.sendStatus(200);

    try {
        await handlePayload(payload);
    } catch (err) {
        logger.error(`whatsapp: processing failed: ${err.message}`);
    }
});

function extractMessages(payload) {
    const messages = [];
    (payload.entry || []).forEach(entry => {
        (entry.changes || []).forEach(change => {
            (change.value?.messages || []).forEach(message => messages.push(message));
        });
    });
    return messages;
}

async function handlePayload(payload) {
    const directory = staffDirectory();
    const messages = extractMessages(payload);

    for (const message of messages) {
        const from = normalizePhone(message.from);
        const staffName = from ? directory.get(from) : null;

        if (!staffName) {
            // Not staff. Silently ignored — this endpoint only accepts notes from
            // the house team.
            logger.info('whatsapp: ignored a message from a non-staff number');
            continue;
        }

        await handleStaffMessage(message, staffName);
    }
}

async function handleStaffMessage(message, staffName) {
    let note;
    let source;

    if (message.type === 'text') {
        note = message.text?.body || '';
        source = 'whatsapp_text';
    } else if (message.type === 'audio') {
        if (!transcription.isConfigured()) {
            // Honest failure: tell the staff member rather than dropping the note.
            await replyToStaff(message.from, "I can't handle voice notes yet — could you type that one out?");
            logger.info('whatsapp: received a voice note but no transcription provider is configured');
            return;
        }
        const audio = await downloadMedia(message.audio.id);
        const result = await transcription.transcribe(audio);
        note = result.text;
        source = 'whatsapp_voice';
    } else {
        logger.info(`whatsapp: ignored an unsupported message type "${message.type}"`);
        return;
    }

    if (!note.trim()) return;

    const candidates = await currentGuestRoster();
    const extraction = await guestMemory.extractGuestFacts(note, candidates);

    if (extraction.needsClarification && !extraction.facts.length) {
        await replyToStaff(message.from, extraction.clarificationQuestion || 'Which guest was that about?');
        return;
    }

    const { saved, unresolved } = await applyFacts(extraction.facts, candidates, {
        capturedBy: staffName,
        source,
        sourceExcerpt: note
    });

    await replyToStaff(message.from, summarise(saved, unresolved));
}

/**
 * Guests on property now or arriving shortly — the set a staff note could
 * plausibly be about.
 */
async function currentGuestRoster(now = new Date()) {
    const horizon = new Date(now.getTime() + LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000);

    const bookings = await Booking.find({
        sequenceStatus: { $in: ['Confirmed', 'CheckedIn'] },
        checkOutDate: { $gte: now },
        checkInDate: { $lte: horizon }
    }).populate('customer', 'fullName address').lean();

    const roster = new Map();
    bookings.forEach(booking => {
        const customer = booking.customer;
        if (!customer) return;
        roster.set(String(customer._id), {
            id: String(customer._id),
            fullName: customer.fullName,
            country: customer.address?.country || null,
            roomLabel: booking.roomType || null
        });
    });

    return [...roster.values()];
}

/**
 * Write resolved facts. Anything whose subject is ambiguous is returned rather
 * than guessed at — attaching a fact to the wrong guest is the failure this
 * whole feature has to avoid.
 */
async function applyFacts(facts, candidates, { capturedBy, source, sourceExcerpt }) {
    const byCustomer = new Map();
    const unresolved = [];

    facts.forEach(fact => {
        const subject = guestMemory.resolveSubject(fact.subjectName, candidates);
        if (!subject) {
            unresolved.push(fact);
            return;
        }
        if (!byCustomer.has(subject.id)) byCustomer.set(subject.id, []);
        byCustomer.get(subject.id).push(fact);
    });

    let saved = 0;
    for (const [customerId, customerFacts] of byCustomer) {
        const customer = await Customer.findById(customerId);
        if (!customer) continue;
        customerFacts.forEach(fact => {
            guestMemory.attachFact(customer, fact, { capturedBy, source, sourceExcerpt });
            saved += 1;
        });
        await customer.save();
    }

    return { saved, unresolved };
}

function summarise(saved, unresolved) {
    if (!saved && !unresolved.length) return 'Nothing to note from that one.';

    const parts = [];
    if (saved) parts.push(`Noted ${saved} thing${saved === 1 ? '' : 's'}.`);
    if (unresolved.length) {
        const names = unresolved.map(f => f.subjectName).filter(Boolean);
        parts.push(
            names.length
                ? `Couldn't place ${names.join(', ')} — who did you mean?`
                : "Couldn't tell who that was about — which guest?"
        );
    }
    return parts.join(' ');
}

async function downloadMedia(mediaId) {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    if (!token) throw new Error('WHATSAPP_ACCESS_TOKEN is not configured');

    const metaRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!metaRes.ok) throw new Error(`media lookup failed (${metaRes.status})`);
    const meta = await metaRes.json();

    const fileRes = await fetch(meta.url, { headers: { Authorization: `Bearer ${token}` } });
    if (!fileRes.ok) throw new Error(`media download failed (${fileRes.status})`);

    return {
        buffer: Buffer.from(await fileRes.arrayBuffer()),
        mimeType: meta.mime_type || 'audio/ogg'
    };
}

async function replyToStaff(to, text) {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
        logger.warn(`whatsapp: cannot reply (not configured). Would have sent: ${text}`);
        return;
    }

    try {
        const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text } })
        });
        if (!res.ok) logger.warn(`whatsapp: reply failed (${res.status})`);
    } catch (err) {
        // A failed reply must not lose the facts we already wrote.
        logger.warn(`whatsapp: reply failed: ${err.message}`);
    }
}

module.exports = router;
module.exports.staffDirectory = staffDirectory;
module.exports.verifySignature = verifySignature;
module.exports.extractMessages = extractMessages;
module.exports.currentGuestRoster = currentGuestRoster;
module.exports.applyFacts = applyFacts;
module.exports.summarise = summarise;
