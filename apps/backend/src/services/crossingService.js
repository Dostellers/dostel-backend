const Booking = require('../models/booking');
const Customer = require('../models/customer');
const Crossing = require('../models/crossing');
const { pairKey, computeOverlap } = require('./crossingLogic');

/**
 * Crossing computation (DOS-505).
 *
 * Consent gate is at COMPUTATION, not display: a guest who has not granted
 * `guest_graph_crossings` is excluded from the query entirely — "off means no
 * computation, not just no notification" (spec). Both sides must hold the
 * consent before an edge exists at all.
 */

const COUNTABLE_STATUSES = ['Confirmed', 'CheckedIn', 'CheckedOut', 'Completed'];
const CONSENT_PURPOSE = 'guest_graph_crossings';

/**
 * Compute and upsert crossings for one booking. Returns how many edges were
 * created or refreshed. Idempotent: recomputing an unchanged overlap updates
 * the same edge (unique pairKey+hostel+overlapStart) and never resets consent.
 */
async function upsertCrossingsForBooking(bookingId) {
    const booking = await Booking.findById(bookingId).populate('customer');
    if (!booking || !booking.customer) return 0;
    if (!COUNTABLE_STATUSES.includes(booking.sequenceStatus)) return 0;
    if (!booking.customer.hasConsent(CONSENT_PURPOSE)) return 0;

    // Interval overlap: [checkIn, checkOut) intersects when each starts
    // before the other ends. Same-hostel only — see ADR-001.
    const candidates = await Booking.find({
        _id: { $ne: booking._id },
        hostel: booking.hostel,
        customer: { $ne: booking.customer._id },
        sequenceStatus: { $in: COUNTABLE_STATUSES },
        checkInDate: { $lt: booking.checkOutDate },
        checkOutDate: { $gt: booking.checkInDate },
    }).populate('customer');

    let touched = 0;
    for (const other of candidates) {
        if (!other.customer || !other.customer.hasConsent(CONSENT_PURPOSE)) continue;

        const overlap = computeOverlap(
            {
                customer: booking.customer._id, hostel: booking.hostel,
                roomType: booking.roomType,
                checkInDate: booking.checkInDate, checkOutDate: booking.checkOutDate,
            },
            {
                customer: other.customer._id, hostel: other.hostel,
                roomType: other.roomType,
                checkInDate: other.checkInDate, checkOutDate: other.checkOutDate,
            },
        );
        if (!overlap) continue;

        const [loId] = [String(booking.customer._id), String(other.customer._id)].sort();
        const aIsBooking = loId === String(booking.customer._id);
        const guestA = aIsBooking ? booking.customer._id : other.customer._id;
        const guestB = aIsBooking ? other.customer._id : booking.customer._id;

        await Crossing.updateOne(
            {
                pairKey: pairKey(guestA, guestB),
                hostel: booking.hostel,
                overlapStart: overlap.overlapStart,
            },
            {
                $set: {
                    tier: overlap.tier,
                    nights: overlap.nights,
                    overlapEnd: overlap.overlapEnd,
                    roomType: overlap.tier === 'room' ? booking.roomType : null,
                    bookingA: aIsBooking ? booking._id : other._id,
                    bookingB: aIsBooking ? other._id : booking._id,
                    computedAt: new Date(),
                },
                $setOnInsert: {
                    guestA,
                    guestB,
                    consentA: { status: 'pending' },
                    consentB: { status: 'pending' },
                },
            },
            { upsert: true },
        );
        touched += 1;
    }
    return touched;
}

/** All crossings a guest may see, newest overlap first (severed excluded). */
async function crossingsForGuest(customerId) {
    return Crossing.find({
        $or: [{ guestA: customerId }, { guestB: customerId }],
        severedAt: null,
    })
        .sort({ overlapStart: -1 })
        .populate('hostel', 'name city')
        .populate('guestA', 'firstName')
        .populate('guestB', 'firstName');
}

module.exports = { upsertCrossingsForBooking, crossingsForGuest, CONSENT_PURPOSE };
