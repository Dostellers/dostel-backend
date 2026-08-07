const Booking = require('../models/booking');
const Crossing = require('../models/crossing');
const { viewForGuest, validateLabel } = require('../services/crossingLogic');
const { upsertCrossingsForBooking, crossingsForGuest } = require('../services/crossingService');

/**
 * Crossings API (DOS-505/506).
 *
 * Every guest-facing read goes through viewForGuest — the pure function that
 * enforces the privacy contract (severance hides, decline stays silent,
 * identity only on double opt-in, labels author-only). Resolvers never shape
 * crossing data by hand; if a field isn't in the view, it doesn't exist.
 */

function requireCustomer(context) {
    const user = context && context.user;
    if (!user || user.__type !== 'Customer') {
        throw new Error('You must be signed in as a guest to do that.');
    }
    return user;
}

function requireStaff(context) {
    const user = context && context.user;
    if (!user || user.__type === 'Customer') {
        throw new Error('Staff sign-in required.');
    }
    return user;
}

/** Shape a crossing doc for GraphQL through the privacy view. */
function toGql(crossing, viewerId) {
    const view = viewForGuest(crossing, viewerId);
    if (!view) return null;

    const isA = String(crossing.guestA?._id || crossing.guestA) === String(viewerId);
    const counterpartDoc = isA ? crossing.guestB : crossing.guestA;
    const counterpartName =
        view.mutual && counterpartDoc && counterpartDoc.firstName
            ? counterpartDoc.firstName
            : null;

    return {
        id: view.id,
        tier: view.tier.toUpperCase(),
        nights: view.nights,
        overlapStart: view.overlapStart.toISOString(),
        overlapEnd: view.overlapEnd.toISOString(),
        hostelName: (crossing.hostel && crossing.hostel.name) || 'Dostel',
        hostelCity: (crossing.hostel && crossing.hostel.city) || null,
        myStatus: view.myStatus.toUpperCase(),
        mutual: view.mutual,
        counterpartName,
        myLabel: view.myLabel,
    };
}

async function loadOwnCrossing(crossingId, viewerId) {
    const crossing = await Crossing.findById(crossingId)
        .populate('hostel', 'name city')
        .populate('guestA', 'firstName')
        .populate('guestB', 'firstName');
    if (!crossing || crossing.severedAt) throw new Error('Crossing not found.');
    const isA = String(crossing.guestA._id) === String(viewerId);
    const isB = String(crossing.guestB._id) === String(viewerId);
    if (!isA && !isB) throw new Error('Crossing not found.'); // never confirm existence
    return { crossing, side: isA ? 'A' : 'B' };
}

const crossingResolver = {
    Query: {
        myCrossings: async (_, __, context) => {
            const me = requireCustomer(context);
            const list = await crossingsForGuest(me._id);
            return list.map((c) => toGql(c, me._id)).filter(Boolean);
        },
    },

    Mutation: {
        respondToCrossing: async (_, { crossingId, accept }, context) => {
            const me = requireCustomer(context);
            const { crossing, side } = await loadOwnCrossing(crossingId, me._id);
            const field = side === 'A' ? 'consentA' : 'consentB';
            // A decline can be reversed by the decliner (spec: permanent
            // UNTIL changed) — but never resets the other side.
            crossing[field] = { status: accept ? 'revealed' : 'declined', at: new Date() };
            await crossing.save();
            return toGql(crossing, me._id);
        },

        severCrossing: async (_, { crossingId }, context) => {
            const me = requireCustomer(context);
            const { crossing } = await loadOwnCrossing(crossingId, me._id);
            crossing.severedBy = me._id;
            crossing.severedAt = new Date();
            crossing.labels = []; // purge both sides' labels, per DOS-506
            await crossing.save();
            return true;
        },

        setCrossingLabel: async (_, { crossingId, label }, context) => {
            const me = requireCustomer(context);
            const check = validateLabel(label);
            if (!check.ok) throw new Error(check.reason);
            const { crossing } = await loadOwnCrossing(crossingId, me._id);
            crossing.labels = (crossing.labels || []).filter(
                (l) => String(l.author) !== String(me._id),
            );
            crossing.labels.push({ author: me._id, text: check.value, createdAt: new Date() });
            await crossing.save();
            return toGql(crossing, me._id);
        },

        removeCrossingLabel: async (_, { crossingId }, context) => {
            const me = requireCustomer(context);
            const { crossing } = await loadOwnCrossing(crossingId, me._id);
            crossing.labels = (crossing.labels || []).filter(
                (l) => String(l.author) !== String(me._id),
            );
            await crossing.save();
            return toGql(crossing, me._id);
        },

        computeCrossingsForBooking: async (_, { reference }, context) => {
            requireStaff(context);
            const booking = await Booking.findOne({ reference });
            if (!booking) throw new Error(`No booking with reference ${reference}.`);
            return upsertCrossingsForBooking(booking._id);
        },
    },
};

module.exports = crossingResolver;
