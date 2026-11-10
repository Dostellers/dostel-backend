const REQUIRED_CONSENTS = ['code_of_conduct', 'whatsapp_group', 'marketing_materials'];

const nightsBetween = (checkInDate, checkOutDate) => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0;
    return Math.ceil((end.getTime() - start.getTime()) / 86400000);
};

const evaluateMembershipEligibility = ({ bookings = [], consents = [] }) => {
    const paidBookings = bookings
        .map(booking => ({ booking, stayDuration: nightsBetween(booking.checkInDate, booking.checkOutDate) }))
        .filter(({ booking }) => {
            const payment = booking.payment || {};
            return Boolean(payment.transactionId) && ['Confirmed', 'Completed'].includes(payment.status);
        })
        .sort((left, right) => right.stayDuration - left.stayDuration);
    const grantedConsents = REQUIRED_CONSENTS.filter(consent => consents.includes(consent));
    const qualifyingBooking = paidBookings.find(({ stayDuration }) => stayDuration >= 7);
    const totalNightsStayed = paidBookings.reduce((total, { stayDuration }) => total + stayDuration, 0);
    const currentStreakNights = paidBookings[0] ? paidBookings[0].stayDuration : 0;
    const hasAllConsents = grantedConsents.length === REQUIRED_CONSENTS.length;
    const isDostellerEligible = Boolean(qualifyingBooking) && hasAllConsents;
    let dostellerEligibilityReason = 'ELIGIBLE';

    if (!paidBookings.length) dostellerEligibilityReason = 'PAYMENT_NOT_VERIFIED';
    else if (!qualifyingBooking) dostellerEligibilityReason = 'STAY_DURATION_BELOW_7';
    else if (!hasAllConsents) dostellerEligibilityReason = 'MISSING_CONSENTS';

    return {
        stayDuration: qualifyingBooking ? qualifyingBooking.stayDuration : currentStreakNights,
        consents: grantedConsents,
        paymentTransactionId: qualifyingBooking ? qualifyingBooking.booking.payment.transactionId : null,
        eligible: isDostellerEligible,
        isDostellerEligible,
        dostellerEligibilityReason,
        totalNightsStayed,
        currentStreakNights,
        evaluatedAt: new Date()
    };
};

module.exports = { REQUIRED_CONSENTS, evaluateMembershipEligibility, nightsBetween };
