const mongoose = require('mongoose');

/**
 * A crossing (DOS-505): two guests whose stays overlapped.
 *
 * This is an edge in the guest graph, stored as a document (see ADR-001 —
 * MongoDB, deliberately not a graph database: the deepest query is one hop).
 *
 * Consent is denormalised onto the edge so a guest's list renders from one
 * read. The other side's consent state must never leave the API: resolvers go
 * through `viewForGuest` (services/crossingLogic), which exposes only
 * `mutual`. Identity is released exclusively on double opt-in; a decline is
 * silent and permanent-until-changed; severance hides the edge from both
 * sides and purges labels.
 */
const consentSub = {
    status: {
        type: String,
        enum: ['pending', 'revealed', 'declined'],
        default: 'pending',
    },
    at: Date,
};

const crossingSchema = new mongoose.Schema(
    {
        // Canonical order (sorted ids) so (A,B) and (B,A) are one edge.
        guestA: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
        guestB: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
        pairKey: { type: String, required: true },

        hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
        bookingA: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        bookingB: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },

        tier: { type: String, enum: ['room', 'hostel'], required: true },
        roomType: String,
        overlapStart: { type: Date, required: true },
        overlapEnd: { type: Date, required: true },
        nights: { type: Number, required: true, min: 1 },

        consentA: consentSub,
        consentB: consentSub,

        severedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        severedAt: Date,

        // Private nicknames (DOS-506). Author-only visibility is enforced in
        // crossingLogic.viewForGuest, not in the UI. One label per author.
        labels: [
            {
                author: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
                text: { type: String, required: true, maxlength: 60 },
                createdAt: { type: Date, default: Date.now },
            },
        ],

        computedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

// One edge per pair per hostel per overlap window; fast per-guest listing.
crossingSchema.index({ pairKey: 1, hostel: 1, overlapStart: 1 }, { unique: true });
crossingSchema.index({ guestA: 1 });
crossingSchema.index({ guestB: 1 });

module.exports = mongoose.model('Crossing', crossingSchema);
