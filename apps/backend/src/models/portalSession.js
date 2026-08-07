const mongoose = require('mongoose');

/**
 * A captive-portal visit (DOS-501).
 *
 * The router redirects an unauthenticated client here, we identify or create the
 * guest, and then hand the router a signed grant. One document per portal visit,
 * so we can measure capture rate and debug a guest who says "the wifi didn't work".
 */
const portalSessionSchema = new mongoose.Schema({
    // Stable per-device identifier we derive ourselves (see portalService).
    fingerprint: {
        type: String,
        required: true,
        index: true
    },
    macAddress: { type: String, trim: true },
    apMacAddress: { type: String, trim: true },
    ssid: { type: String, trim: true },
    userAgent: String,
    ipAddress: String,

    // Null until the guest completes the form. A session that stays null is a
    // guest who connected and bounced — that gap is the capture-rate metric.
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },

    status: {
        type: String,
        enum: ['pending', 'authorized', 'failed', 'expired'],
        default: 'pending',
        index: true
    },

    // 'new' the first time we see a device, 'returning' when we matched an
    // existing customer and skipped the form.
    captureType: {
        type: String,
        enum: ['new', 'returning', 'none'],
        default: 'none'
    },

    // null is an explicit enum member: a guest who skips the question is
    // "not stated", which Mongoose 5 would otherwise reject as an invalid enum.
    stayPurpose: {
        type: String,
        enum: ['backpacker', 'remote_worker', 'group', 'other', null],
        default: null
    },
    referralCode: { type: String, trim: true, default: null },

    authorizedAt: Date,
    grantMinutes: { type: Number, default: 1440 },
    expiresAt: Date,

    // Deduplicates retried submissions from the offline queue: the portal page
    // generates this once per form fill and replays it verbatim on reconnect.
    submissionKey: {
        type: String,
        default: null
    },

    failureReason: String
}, {
    timestamps: true
});

// The offline queue can replay a submission many times; the unique index makes
// the replay a no-op instead of a duplicate signup. Sparse so the many sessions
// that never submit (submissionKey: null) don't collide with each other.
portalSessionSchema.index({ submissionKey: 1 }, { unique: true, sparse: true });
portalSessionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PortalSession', portalSessionSchema);
