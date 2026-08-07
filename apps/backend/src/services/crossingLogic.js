/**
 * Crossing logic (DOS-505/DOS-506) — pure functions, no I/O.
 *
 * Kept free of mongoose so the rules that decide whether two strangers get
 * connected — and what each side is allowed to see — can be tested directly.
 * The privacy rules here are load-bearing: a bug that leaks the other side's
 * "declined" is not a bug, it is a betrayal of the double-opt-in promise.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Canonical pair key so (A,B) and (B,A) are the same edge. */
function pairKey(idA, idB) {
    const [lo, hi] = [String(idA), String(idB)].sort();
    return `${lo}:${hi}`;
}

/**
 * Overlap between two stays, or null.
 *
 * Tiers (DOS-505): same room >= 1 shared night, same hostel >= 2 shared
 * nights. Checkout day is not a night — the interval is [checkIn, checkOut).
 * Same guest or different hostel is never a crossing.
 */
function computeOverlap(a, b) {
    if (String(a.customer) === String(b.customer)) return null;
    if (String(a.hostel) !== String(b.hostel)) return null;

    const start = Math.max(new Date(a.checkInDate).getTime(), new Date(b.checkInDate).getTime());
    const end = Math.min(new Date(a.checkOutDate).getTime(), new Date(b.checkOutDate).getTime());
    const nights = Math.floor((end - start) / MS_PER_DAY);
    if (nights < 1) return null;

    const sameRoom = Boolean(a.roomType) && a.roomType === b.roomType;
    if (sameRoom) {
        return { tier: 'room', nights, overlapStart: new Date(start), overlapEnd: new Date(end) };
    }
    if (nights >= 2) {
        return { tier: 'hostel', nights, overlapStart: new Date(start), overlapEnd: new Date(end) };
    }
    return null;
}

/**
 * What one guest is allowed to see of a crossing.
 *
 * Rules, in order of importance:
 * - severed -> invisible to both sides, permanently
 * - the other side's consent state is NEVER exposed; the viewer sees only
 *   `mutual`. A decline therefore reads as "not (yet) mutual" forever —
 *   indistinguishable from silence, which is the point.
 * - the counterpart's identity is released only when BOTH sides revealed.
 * - labels are author-only (DOS-506): the viewer gets their own, never the
 *   counterpart's.
 */
function viewForGuest(crossing, viewerId) {
    if (crossing.severedAt) return null;

    const viewer = String(viewerId);
    const isA = String(crossing.guestA) === viewer;
    const isB = String(crossing.guestB) === viewer;
    if (!isA && !isB) return null;

    const mine = isA ? crossing.consentA : crossing.consentB;
    const theirs = isA ? crossing.consentB : crossing.consentA;
    const mutual = mine.status === 'revealed' && theirs.status === 'revealed';

    const myLabel = (crossing.labels || []).find((l) => String(l.author) === viewer) || null;

    return {
        id: String(crossing._id || crossing.id || ''),
        tier: crossing.tier,
        nights: crossing.nights,
        overlapStart: crossing.overlapStart,
        overlapEnd: crossing.overlapEnd,
        hostel: crossing.hostel,
        myStatus: mine.status,
        mutual,
        counterpartId: mutual ? String(isA ? crossing.guestB : crossing.guestA) : null,
        myLabel: myLabel ? myLabel.text : null,
    };
}

/**
 * Label hygiene (DOS-506). Author-only display cannot hurt its subject
 * socially, but we still refuse to store what we would be ashamed of.
 * Deliberately blunt substring matching — false positives are acceptable
 * for a field whose only reader is its author.
 */
const BANNED_SUBSTRINGS = [
    'fuck', 'shit', 'bitch', 'cunt', 'slut', 'whore', 'rape',
    'chutiya', 'bhosdi', 'madarchod', 'behenchod', 'randi',
];

function validateLabel(text) {
    const trimmed = String(text || '').trim();
    if (!trimmed) return { ok: false, reason: 'Label is empty.' };
    if (trimmed.length > 60) return { ok: false, reason: 'Keep it under 60 characters.' };
    const lower = trimmed.toLowerCase();
    if (BANNED_SUBSTRINGS.some((w) => lower.includes(w))) {
        return { ok: false, reason: 'That label is not something we will store.' };
    }
    return { ok: true, value: trimmed };
}

module.exports = { pairKey, computeOverlap, viewForGuest, validateLabel, MS_PER_DAY };
