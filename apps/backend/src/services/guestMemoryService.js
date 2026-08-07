const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../config/logger');

/**
 * Guest memory extraction (DOS-502).
 *
 * Turns a staff note — "Priya doesn't eat dairy", "Marco's the one who fixed the
 * guitar" — into structured facts on the customer record, so what the house knows
 * about a returning guest survives a shift change.
 */

// Bumped whenever the prompt or schema changes, and stamped on every fact, so an
// extraction can be traced back to the version that produced it.
const EXTRACTOR_VERSION = '2026-08-07.1';

const MODEL = process.env.GUEST_MEMORY_MODEL || 'claude-opus-5';

// Mechanical extraction over a couple of sentences. Low effort handles it well on
// this model; raise via env if subject disambiguation turns out to need more.
const EFFORT = process.env.GUEST_MEMORY_EFFORT || 'low';

// Thinking is on by default on Claude Opus 5 and `max_tokens` caps thinking plus
// response together, so this needs headroom well beyond the small JSON payload.
const MAX_TOKENS = 8192;

const CATEGORIES = ['dietary', 'accessibility', 'interest', 'relationship', 'logistics', 'caution'];

/**
 * How long a fact stays fresh, by how durable the model judged it to be.
 * A dietary requirement outlives a stay; "waiting on a parcel" does not.
 */
const TTL_DAYS = {
    stay: 30,
    season: 180,
    lasting: 1095
};

const EXTRACTION_SCHEMA = {
    type: 'object',
    properties: {
        facts: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    subjectName: {
                        type: 'string',
                        description: 'The guest this fact is about, exactly as the staff member named them. Empty string if no name was given.'
                    },
                    category: {
                        type: 'string',
                        enum: CATEGORIES,
                        description: 'dietary: food needs. accessibility: mobility, sensory, medical access needs. interest: what they enjoy or are good at. relationship: how they connect to other people at the house. logistics: practical details about their stay. caution: safety or conduct concerns staff should know.'
                    },
                    text: {
                        type: 'string',
                        description: 'The fact itself, in one short sentence, written so it reads well to a staff member at check-in months later.'
                    },
                    // An enum rather than a 0-1 score: structured outputs do not
                    // support numeric range constraints, and three buckets are
                    // what the review queue actually branches on.
                    confidence: {
                        type: 'string',
                        enum: ['high', 'medium', 'low'],
                        description: 'high: stated plainly and unambiguously. medium: clearly implied. low: inferred, or the subject is uncertain.'
                    },
                    durability: {
                        type: 'string',
                        enum: ['stay', 'season', 'lasting'],
                        description: 'stay: only true for this visit. season: likely true for months. lasting: a standing fact about the person.'
                    }
                },
                required: ['subjectName', 'category', 'text', 'confidence', 'durability'],
                additionalProperties: false
            }
        },
        needsClarification: {
            type: 'boolean',
            description: 'True when you cannot tell which guest a fact is about, or the note is too ambiguous to record.'
        },
        clarificationQuestion: {
            type: 'string',
            description: 'If needsClarification is true, the one question to ask the staff member. Empty string otherwise.'
        }
    },
    required: ['facts', 'needsClarification', 'clarificationQuestion'],
    additionalProperties: false
};

const SYSTEM_PROMPT = `You extract guest facts from notes written by hostel staff at Dostel Vattakanal, a small hostel in the Tamil Nadu hills.

Staff send these notes in passing, often as voice messages between other tasks. They are informal, sometimes mid-thought, and may mix languages. A note may contain several facts, one fact, or none.

Record what would genuinely help a colleague host this person well on a future stay — a dietary need, an interest worth connecting them over, how they know another guest. Leave out anything that is only true of this moment ("she's in the kitchen right now"), and anything the booking system already holds (arrival dates, room numbers, payment).

Guess the subject only when the note makes it clear. When a note says "she" or "the guy in room 4" and you cannot tell who that is from the guests listed, set needsClarification and ask — a fact attached to the wrong guest is worse than no fact.

Use the caution category only for genuine safety or conduct concerns. It is not for staff finding someone difficult or annoying. These notes are visible to the guest on request, and a person is entitled to see what has been written about them.`;

let cachedClient = null;

function getClient() {
    if (cachedClient) return cachedClient;
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    const Ctor = Anthropic.default || Anthropic;
    cachedClient = new Ctor();
    return cachedClient;
}

/**
 * Build the user turn: the note plus who was on property, so the model can
 * resolve "Priya" or "the girl from Bangalore" to an actual guest.
 *
 * @param {string} note
 * @param {Array<{id: string, fullName: string, country?: string, roomLabel?: string}>} candidates
 */
function buildUserContent(note, candidates = []) {
    const roster = candidates.length
        ? candidates
            .map(c => `- ${c.fullName}${c.country ? ` (${c.country})` : ''}${c.roomLabel ? `, ${c.roomLabel}` : ''}`)
            .join('\n')
        : '(no guests currently on property)';

    return `Guests staying now or arriving in the next few days:\n${roster}\n\nStaff note:\n"""\n${note}\n"""`;
}

function parseResponse(message) {
    const textBlock = (message.content || []).find(block => block.type === 'text');
    if (!textBlock) {
        throw new Error('extraction returned no text block');
    }
    // Structured outputs constrain the shape, but a malformed payload must fail
    // loudly here rather than write junk onto a customer record.
    return JSON.parse(textBlock.text);
}

/**
 * Run one staff note through extraction.
 *
 * Returns `{ facts, needsClarification, clarificationQuestion, usage }`. Facts are
 * normalized but not yet attached to a customer — see attachFact.
 */
async function extractGuestFacts(note, candidates = []) {
    if (!note || !note.trim()) {
        return { facts: [], needsClarification: false, clarificationQuestion: '', usage: null };
    }

    const client = getClient();

    let message;
    try {
        message = await client.messages.create({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: SYSTEM_PROMPT,
            output_config: {
                effort: EFFORT,
                format: { type: 'json_schema', schema: EXTRACTION_SCHEMA }
            },
            messages: [{ role: 'user', content: buildUserContent(note, candidates) }]
        });
    } catch (err) {
        // Typed SDK errors, most specific first — a rate limit is worth retrying,
        // a bad request is not.
        const A = Anthropic.default || Anthropic;
        if (err instanceof A.RateLimitError) {
            logger.warn('guestMemory: rate limited by the Claude API');
        } else if (err instanceof A.APIConnectionError) {
            logger.warn(`guestMemory: could not reach the Claude API: ${err.message}`);
        } else if (err instanceof A.APIError) {
            logger.error(`guestMemory: Claude API error ${err.status}: ${err.message}`);
        } else {
            logger.error(`guestMemory: extraction failed: ${err.message}`);
        }
        throw err;
    }

    // A safety refusal comes back as a successful response, not an exception.
    if (message.stop_reason === 'refusal') {
        logger.warn(`guestMemory: extraction refused (${message.stop_details?.category || 'unspecified'})`);
        return { facts: [], needsClarification: true, clarificationQuestion: 'Could not process that note — please pass it to the manager.', usage: message.usage };
    }

    if (message.stop_reason === 'max_tokens') {
        throw new Error('extraction truncated at max_tokens');
    }

    const parsed = parseResponse(message);

    return {
        facts: (parsed.facts || []).map(normalizeFact),
        needsClarification: parsed.needsClarification === true,
        clarificationQuestion: parsed.clarificationQuestion || '',
        usage: message.usage
    };
}

/**
 * Apply the rules the model does not decide: expiry, staff-only visibility for
 * cautions, and whether a fact is written or queued for review.
 */
function normalizeFact(raw, now = new Date()) {
    const durability = TTL_DAYS[raw.durability] ? raw.durability : 'season';
    const confidence = ['high', 'medium', 'low'].includes(raw.confidence) ? raw.confidence : 'low';

    return {
        subjectName: (raw.subjectName || '').trim(),
        category: CATEGORIES.includes(raw.category) ? raw.category : 'logistics',
        text: (raw.text || '').trim(),
        confidence,
        durability,
        expiresAt: new Date(now.getTime() + TTL_DAYS[durability] * 24 * 60 * 60 * 1000),
        // Cautions are staff-only regardless of what the model says — this is a
        // policy decision, not a judgment call to delegate.
        visibility: raw.category === 'caution' ? 'staff_only' : 'guest_visible',
        // Anything the model was unsure about, and every caution, gets a human
        // look before it can surface.
        reviewStatus: (confidence === 'low' || raw.category === 'caution') ? 'pending' : 'approved',
        extractorVersion: EXTRACTOR_VERSION
    };
}

/**
 * Resolve the guest a fact is about.
 *
 * Exact match first, then unique case-insensitive prefix on any name part, so
 * "Priya" finds "Priya Raman". Returns null when the name is missing or matches
 * more than one guest — the caller asks rather than guessing.
 */
function resolveSubject(subjectName, candidates = []) {
    const name = (subjectName || '').trim().toLowerCase();
    if (!name) return null;

    const exact = candidates.filter(c => (c.fullName || '').trim().toLowerCase() === name);
    if (exact.length === 1) return exact[0];
    if (exact.length > 1) return null;

    const prefix = candidates.filter(c =>
        (c.fullName || '')
            .toLowerCase()
            .split(/\s+/)
            .some(part => part.startsWith(name))
    );
    return prefix.length === 1 ? prefix[0] : null;
}

/**
 * Push an extracted fact onto a customer document. Does not save — the caller
 * batches writes so one note produces one save.
 */
function attachFact(customer, fact, { capturedBy, source, sourceExcerpt }) {
    customer.guestFacts.push({
        text: fact.text,
        category: fact.category,
        capturedBy,
        capturedAt: new Date(),
        source,
        confidence: fact.confidence,
        reviewStatus: fact.reviewStatus,
        expiresAt: fact.expiresAt,
        visibility: fact.visibility,
        extractorVersion: fact.extractorVersion,
        sourceExcerpt
    });
    return customer;
}

module.exports = {
    extractGuestFacts,
    normalizeFact,
    resolveSubject,
    attachFact,
    buildUserContent,
    parseResponse,
    EXTRACTOR_VERSION,
    EXTRACTION_SCHEMA,
    SYSTEM_PROMPT,
    CATEGORIES,
    TTL_DAYS,
    MODEL,
    MAX_TOKENS
};
