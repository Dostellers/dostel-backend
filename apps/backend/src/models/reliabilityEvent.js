const mongoose = require('mongoose');

/**
 * Raw reliability telemetry (DOS-503).
 *
 * Append-only and deliberately separate from the aggregates published on the
 * hostel page, so any number a guest sees can be recomputed from source. If the
 * published record is ever disputed, this collection is the answer.
 *
 * Nothing in here is ever edited or deleted in normal operation. Suppressing a
 * bad month defeats the entire mechanism — a reliability claim is only worth
 * anything because it could have embarrassed us.
 */
const reliabilityEventSchema = new mongoose.Schema({
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true,
        index: true
    },

    // Which on-property device reported this. Lets a faulty sensor be isolated
    // without discarding everything else.
    deviceId: { type: String, required: true, trim: true },

    metric: {
        type: String,
        enum: ['power', 'hot_water', 'wifi', 'heartbeat'],
        required: true
    },

    // For power and hot_water: is the thing working right now.
    status: {
        type: String,
        enum: ['up', 'down', 'degraded', null],
        default: null
    },

    // For wifi: measured throughput and loss. Null on other metrics.
    downloadMbps: { type: Number, default: null },
    uploadMbps: { type: Number, default: null },
    packetLossPct: { type: Number, default: null },
    latencyMs: { type: Number, default: null },

    // For hot_water: measured outlet temperature, so the claim is a reading
    // rather than an inferred schedule.
    temperatureC: { type: Number, default: null },

    // When the device observed it, versus when we received it. These diverge by
    // hours when the property is offline and the device is buffering, and the
    // published numbers must use observedAt.
    observedAt: { type: Date, required: true, index: true },
    receivedAt: { type: Date, required: true, default: Date.now },

    // Per-device monotonic counter. Lets a gap in the sequence distinguish
    // "device was off" from "device was on and reported nothing".
    sequence: { type: Number, default: null }
}, {
    timestamps: false
});

// The aggregation query: one hostel, one metric, over a time window.
reliabilityEventSchema.index({ hostel: 1, metric: 1, observedAt: -1 });

// Replayed batches from the offline buffer must not double-count.
reliabilityEventSchema.index(
    { deviceId: 1, metric: 1, observedAt: 1 },
    { unique: true }
);

module.exports = mongoose.model('ReliabilityEvent', reliabilityEventSchema);
