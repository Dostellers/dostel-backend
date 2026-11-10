const assert = require('assert');
const {
    REQUIRED_CONSENTS,
    evaluateMembershipEligibility,
    nightsBetween
} = require('../src/services/membershipEligibilityService');

const paidBooking = (nights, overrides = {}) => ({
    checkInDate: new Date('2026-08-01T00:00:00.000Z'),
    checkOutDate: new Date(Date.UTC(2026, 7, 1 + nights)),
    payment: {
        status: 'Confirmed',
        transactionId: `pay_${nights}`,
        ...overrides
    }
});

assert.strictEqual(nightsBetween('2026-08-01', '2026-08-08'), 7);
assert.strictEqual(nightsBetween('invalid', '2026-08-08'), 0);

const eligible = evaluateMembershipEligibility({
    bookings: [paidBooking(7), paidBooking(3)],
    consents: REQUIRED_CONSENTS
});
assert.strictEqual(eligible.eligible, true);
assert.strictEqual(eligible.isDostellerEligible, true);
assert.strictEqual(eligible.dostellerEligibilityReason, 'ELIGIBLE');
assert.strictEqual(eligible.stayDuration, 7);
assert.strictEqual(eligible.totalNightsStayed, 10);
assert.strictEqual(eligible.currentStreakNights, 7);
assert.strictEqual(eligible.paymentTransactionId, 'pay_7');

const missingConsents = evaluateMembershipEligibility({
    bookings: [paidBooking(8)],
    consents: ['code_of_conduct']
});
assert.strictEqual(missingConsents.isDostellerEligible, false);
assert.strictEqual(missingConsents.dostellerEligibilityReason, 'MISSING_CONSENTS');

const shortStay = evaluateMembershipEligibility({
    bookings: [paidBooking(6)],
    consents: REQUIRED_CONSENTS
});
assert.strictEqual(shortStay.isDostellerEligible, false);
assert.strictEqual(shortStay.dostellerEligibilityReason, 'STAY_DURATION_BELOW_7');
assert.strictEqual(shortStay.totalNightsStayed, 6);

const unverified = evaluateMembershipEligibility({
    bookings: [paidBooking(9, { status: 'Pending', transactionId: undefined })],
    consents: REQUIRED_CONSENTS
});
assert.strictEqual(unverified.isDostellerEligible, false);
assert.strictEqual(unverified.dostellerEligibilityReason, 'PAYMENT_NOT_VERIFIED');
assert.strictEqual(unverified.totalNightsStayed, 0);
