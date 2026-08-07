const assert = require('assert');
const {
    pairKey,
    computeOverlap,
    viewForGuest,
    validateLabel,
} = require('../src/services/crossingLogic');

/**
 * Crossing rules (DOS-505/506). Run: node test/crossing-logic.test.js
 *
 * The privacy assertions here are the contract, not implementation detail:
 * if one of these fails, do not "fix the test".
 */

const A = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const B = 'bbbbbbbbbbbbbbbbbbbbbbbb';
const H = 'cccccccccccccccccccccccc';

const stay = (customer, checkIn, checkOut, roomType = 'Dorm', hostel = H) => ({
    customer, hostel, roomType,
    checkInDate: new Date(checkIn), checkOutDate: new Date(checkOut),
});

const run = () => {
    // ── pairKey ────────────────────────────────────────────────
    assert.strictEqual(pairKey(A, B), pairKey(B, A), 'pair key must be order-independent');

    // ── overlap tiers ──────────────────────────────────────────
    // Same room, one shared night -> room crossing.
    let o = computeOverlap(stay(A, '2026-08-01', '2026-08-03'), stay(B, '2026-08-02', '2026-08-05'));
    assert.ok(o && o.tier === 'room' && o.nights === 1, `room tier at 1 night, got ${JSON.stringify(o)}`);

    // Different rooms, one shared night -> below the hostel threshold.
    o = computeOverlap(stay(A, '2026-08-01', '2026-08-03', 'Dorm'), stay(B, '2026-08-02', '2026-08-05', 'Suite'));
    assert.strictEqual(o, null, 'hostel tier requires >= 2 nights');

    // Different rooms, two shared nights -> hostel crossing.
    o = computeOverlap(stay(A, '2026-08-01', '2026-08-04', 'Dorm'), stay(B, '2026-08-02', '2026-08-06', 'Suite'));
    assert.ok(o && o.tier === 'hostel' && o.nights === 2, `hostel tier at 2 nights, got ${JSON.stringify(o)}`);

    // Checkout day is not a night: B arrives the day A leaves.
    o = computeOverlap(stay(A, '2026-08-01', '2026-08-03'), stay(B, '2026-08-03', '2026-08-05'));
    assert.strictEqual(o, null, 'back-to-back stays never cross');

    // Same guest / different hostel: never.
    assert.strictEqual(computeOverlap(stay(A, '2026-08-01', '2026-08-05'), stay(A, '2026-08-02', '2026-08-04')), null);
    assert.strictEqual(
        computeOverlap(stay(A, '2026-08-01', '2026-08-05'), stay(B, '2026-08-02', '2026-08-04', 'Dorm', 'dddddddddddddddddddddddd')),
        null,
    );

    // ── privacy shaping ────────────────────────────────────────
    const base = {
        _id: 'x1', guestA: A, guestB: B, tier: 'room', nights: 2,
        overlapStart: new Date('2026-08-02'), overlapEnd: new Date('2026-08-04'),
        hostel: H,
        consentA: { status: 'pending' }, consentB: { status: 'pending' },
        labels: [{ author: A, text: 'Guitar Guy' }, { author: B, text: 'Chai Didi' }],
    };

    // Labels are author-only, both directions.
    assert.strictEqual(viewForGuest(base, A).myLabel, 'Guitar Guy');
    assert.strictEqual(viewForGuest(base, B).myLabel, 'Chai Didi');

    // A DECLINE IS SILENT: B declined, A must see exactly what A would see
    // if B had done nothing at all.
    const declined = { ...base, consentA: { status: 'revealed' }, consentB: { status: 'declined' } };
    const untouched = { ...base, consentA: { status: 'revealed' }, consentB: { status: 'pending' } };
    const viewDeclined = viewForGuest(declined, A);
    const viewUntouched = viewForGuest(untouched, A);
    assert.deepStrictEqual(viewDeclined, viewUntouched, 'decline must be indistinguishable from silence');
    assert.strictEqual(viewDeclined.mutual, false);
    assert.strictEqual(viewDeclined.counterpartId, null, 'no identity without double opt-in');
    assert.ok(!('theirStatus' in viewDeclined), 'other side status must not exist in the view');

    // Identity releases only on double opt-in.
    const mutual = { ...base, consentA: { status: 'revealed' }, consentB: { status: 'revealed' } };
    assert.strictEqual(viewForGuest(mutual, A).counterpartId, B);
    assert.strictEqual(viewForGuest(mutual, B).counterpartId, A);

    // Severed edges vanish for both sides; third parties see nothing ever.
    const severed = { ...mutual, severedAt: new Date() };
    assert.strictEqual(viewForGuest(severed, A), null);
    assert.strictEqual(viewForGuest(severed, B), null);
    assert.strictEqual(viewForGuest(mutual, 'eeeeeeeeeeeeeeeeeeeeeeee'), null, 'strangers see nothing');

    // ── labels ─────────────────────────────────────────────────
    assert.strictEqual(validateLabel('Guitar Guy').ok, true);
    assert.strictEqual(validateLabel('').ok, false);
    assert.strictEqual(validateLabel('x'.repeat(61)).ok, false);
    assert.strictEqual(validateLabel('some slur bhosdi here').ok, false);

    console.log('crossing-logic: all assertions passed');
};

run();
