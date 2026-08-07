const express = require('express');
const crypto = require('crypto');
const ReliabilityEvent = require('../../models/reliabilityEvent');
const reliability = require('../../services/reliabilityService');
const logger = require('../../config/logger');

const router = express.Router();

/**
 * Reliability telemetry ingest (DOS-503).
 *
 * An on-property device posts batches of observations. It must be able to buffer
 * locally and replay hours later, because losing connectivity is routine here —
 * and because the outage itself is the data point we most need not to lose.
 */

// Raw body for signature verification, as with the WhatsApp webhook.
router.use(express.raw({ type: '*/*', limit: '2mb' }));

const MAX_BATCH = parseInt(process.env.TELEMETRY_MAX_BATCH || '5000', 10);

// A replayed batch may be hours old; anything older than this is rejected as a
// clock problem rather than silently distorting a published window.
const MAX_BACKFILL_DAYS = parseInt(process.env.TELEMETRY_MAX_BACKFILL_DAYS || '14', 10);

function deviceKeys() {
    // deviceId:secret pairs. Each device gets its own key so one can be rotated
    // without re-keying the property.
    const raw = process.env.TELEMETRY_DEVICE_KEYS || '';
    const keys = new Map();
    raw.split(',').forEach(entry => {
        const [deviceId, secret] = entry.split(':');
        if (deviceId && secret) keys.set(deviceId.trim(), secret.trim());
    });
    return keys;
}

function verifyDevice(req) {
    const deviceId = req.get('x-device-id');
    if (!deviceId) return null;

    const secret = deviceKeys().get(deviceId);
    if (!secret) return null;

    const header = req.get('x-device-signature');
    if (!header) return null;

    const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(header, 'utf8');
    if (a.length !== b.length) return null;

    return crypto.timingSafeEqual(a, b) ? deviceId : null;
}

/**
 * Reject observations we cannot honestly place in time.
 *
 * A device with a wrong clock is worse than a device that is silent: silence
 * shows up as a coverage gap, but a bad timestamp quietly corrupts a published
 * number.
 */
function validateObservation(raw, { now, deviceId }) {
    const observedAt = new Date(raw.observedAt);
    if (Number.isNaN(observedAt.getTime())) return { error: 'observedAt is not a valid date' };

    if (observedAt > new Date(now.getTime() + 5 * 60 * 1000)) {
        return { error: 'observedAt is in the future' };
    }
    if (observedAt < new Date(now.getTime() - MAX_BACKFILL_DAYS * 24 * 60 * 60 * 1000)) {
        return { error: `observedAt is more than ${MAX_BACKFILL_DAYS} days old` };
    }

    if (!['power', 'hot_water', 'wifi', 'heartbeat'].includes(raw.metric)) {
        return { error: `unknown metric "${raw.metric}"` };
    }
    if (raw.status && !['up', 'down', 'degraded'].includes(raw.status)) {
        return { error: `unknown status "${raw.status}"` };
    }

    return {
        value: {
            deviceId,
            metric: raw.metric,
            status: raw.status || null,
            downloadMbps: numberOrNull(raw.downloadMbps),
            uploadMbps: numberOrNull(raw.uploadMbps),
            packetLossPct: numberOrNull(raw.packetLossPct),
            latencyMs: numberOrNull(raw.latencyMs),
            temperatureC: numberOrNull(raw.temperatureC),
            observedAt,
            receivedAt: now,
            sequence: numberOrNull(raw.sequence)
        }
    };
}

function numberOrNull(value) {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * POST /api/telemetry/reliability — a batch of observations.
 *
 * Idempotent on (deviceId, metric, observedAt): a device that replays its buffer
 * after a reconnect, or retries a batch it never saw acknowledged, does not
 * double-count.
 */
router.post('/reliability', async (req, res) => {
    const deviceId = verifyDevice(req);
    if (!deviceId) {
        logger.warn('telemetry: rejected a batch with an invalid device signature');
        return res.sendStatus(403);
    }

    let payload;
    try {
        payload = JSON.parse(req.body.toString('utf8'));
    } catch (err) {
        return res.status(400).json({ error: 'body is not valid JSON' });
    }

    const { hostelId, observations } = payload || {};
    if (!hostelId || !Array.isArray(observations)) {
        return res.status(400).json({ error: 'hostelId and observations[] are required' });
    }
    if (observations.length > MAX_BATCH) {
        return res.status(413).json({ error: `batch exceeds ${MAX_BATCH} observations` });
    }

    const now = new Date();
    const accepted = [];
    const rejected = [];

    observations.forEach((raw, index) => {
        const result = validateObservation(raw, { now, deviceId });
        if (result.error) {
            rejected.push({ index, error: result.error });
        } else {
            accepted.push({ ...result.value, hostel: hostelId });
        }
    });

    let inserted = 0;
    let duplicates = 0;

    if (accepted.length) {
        try {
            // ordered: false so one duplicate does not abandon the rest of the
            // batch — a replayed buffer is mostly duplicates by design.
            const result = await ReliabilityEvent.insertMany(accepted, { ordered: false });
            inserted = result.length;
        } catch (err) {
            inserted = err.insertedDocs ? err.insertedDocs.length : 0;
            const writeErrors = err.writeErrors || [];
            duplicates = writeErrors.filter(e => e.code === 11000).length;

            const other = writeErrors.filter(e => e.code !== 11000);
            if (other.length) {
                logger.error(`telemetry: ${other.length} write errors on ingest`);
            }
        }
    }

    // A partially-rejected batch is still a 200: the device should advance its
    // buffer rather than retry observations that will never be accepted.
    res.json({
        received: observations.length,
        inserted,
        duplicates,
        rejected: rejected.length,
        rejectedDetail: rejected.slice(0, 20)
    });
});

/**
 * GET /api/telemetry/reliability/:hostelId — the published record.
 *
 * Public and unauthenticated on purpose. A reliability claim a guest cannot
 * check independently is just marketing copy again.
 */
router.get('/reliability/:hostelId', async (req, res) => {
    try {
        const record = await reliability.buildReliability(req.params.hostelId);
        res.json(record);
    } catch (error) {
        logger.error(`telemetry: failed to build reliability record: ${error.message}`);
        res.status(500).json({ error: 'Could not build the reliability record.' });
    }
});

module.exports = router;
module.exports.verifyDevice = verifyDevice;
module.exports.validateObservation = validateObservation;
module.exports.deviceKeys = deviceKeys;
