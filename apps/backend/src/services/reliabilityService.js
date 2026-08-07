const ReliabilityEvent = require('../models/reliabilityEvent');

/**
 * Reliability aggregation (DOS-503).
 *
 * Turns raw telemetry into the numbers published on the hostel page.
 *
 * The central problem: when the property loses power, the device reporting on
 * the power often loses power too. Absence of data is therefore ambiguous — it
 * could mean an outage, or a flat battery, or the uplink being down. A naive
 * implementation treats gaps as uptime and reports a beautiful number that is
 * simply the sensor's own silence.
 *
 * So gaps are counted as `unknown`, never as `up`, and coverage is published
 * alongside uptime. 100% uptime at 40% coverage is not a claim worth making, and
 * the panel is expected to say so rather than show the 100%.
 */

// How long a single observation is taken to speak for. Beyond this the interval
// is unknown rather than a continuation of the last known state.
const DEFAULT_MAX_GAP_MINUTES = parseInt(process.env.RELIABILITY_MAX_GAP_MINUTES || '20', 10);

// Below this, a window's uptime figure is not fit to publish.
const MIN_PUBLISHABLE_COVERAGE_PCT = parseFloat(process.env.RELIABILITY_MIN_COVERAGE_PCT || '80');

const WINDOWS = [
    { key: '7d', days: 7 },
    { key: '30d', days: 30 },
    { key: '90d', days: 90 }
];

const MINUTE = 60 * 1000;

function round(value, places = 1) {
    const factor = Math.pow(10, places);
    return Math.round(value * factor) / factor;
}

/**
 * Attribute every minute of a window to up, down, degraded or unknown.
 *
 * Each observation speaks for the time until the next one, capped at
 * `maxGapMinutes`. Anything beyond that cap — and any stretch with no
 * observations at all — is unknown.
 *
 * @param {Array<{status: string, observedAt: Date}>} events
 */
function summariseUptime(events, { windowStart, windowEnd, maxGapMinutes = DEFAULT_MAX_GAP_MINUTES } = {}) {
    const totalMinutes = (windowEnd - windowStart) / MINUTE;
    const buckets = { up: 0, down: 0, degraded: 0 };

    const inWindow = events
        .filter(e => e.observedAt >= windowStart && e.observedAt <= windowEnd)
        .sort((a, b) => a.observedAt - b.observedAt);

    let accounted = 0;

    inWindow.forEach((event, i) => {
        const next = inWindow[i + 1];
        const until = next ? next.observedAt : windowEnd;
        const spanMinutes = Math.min((until - event.observedAt) / MINUTE, maxGapMinutes);

        if (spanMinutes <= 0) return;
        if (buckets[event.status] === undefined) return;

        buckets[event.status] += spanMinutes;
        accounted += spanMinutes;
    });

    const unknownMinutes = Math.max(0, totalMinutes - accounted);
    const observedMinutes = buckets.up + buckets.down + buckets.degraded;

    return {
        upMinutes: round(buckets.up),
        downMinutes: round(buckets.down),
        degradedMinutes: round(buckets.degraded),
        unknownMinutes: round(unknownMinutes),
        // Uptime is a share of *observed* time, not of the window. Reporting it
        // against the window would silently credit gaps as uptime.
        uptimePct: observedMinutes > 0 ? round((buckets.up / observedMinutes) * 100) : null,
        coveragePct: totalMinutes > 0 ? round((observedMinutes / totalMinutes) * 100) : 0,
        publishable: totalMinutes > 0 && (observedMinutes / totalMinutes) * 100 >= MIN_PUBLISHABLE_COVERAGE_PCT
    };
}

function percentile(sortedValues, p) {
    if (!sortedValues.length) return null;
    const index = Math.min(sortedValues.length - 1, Math.max(0, Math.ceil((p / 100) * sortedValues.length) - 1));
    return sortedValues[index];
}

/**
 * Summarise WiFi samples.
 *
 * Reports the median and the 10th percentile rather than a mean. A remote worker
 * choosing where to spend a month cares about the bad evening, not the average
 * one, and a mean politely hides exactly that.
 */
function summariseWifi(events, { windowStart, windowEnd } = {}) {
    const samples = events.filter(e =>
        e.downloadMbps !== null &&
        e.downloadMbps !== undefined &&
        (!windowStart || e.observedAt >= windowStart) &&
        (!windowEnd || e.observedAt <= windowEnd)
    );

    if (!samples.length) {
        return { samples: 0, medianDownloadMbps: null, worstDecileDownloadMbps: null, avgPacketLossPct: null };
    }

    const downloads = samples.map(s => s.downloadMbps).sort((a, b) => a - b);
    const losses = samples.map(s => s.packetLossPct).filter(v => typeof v === 'number');

    return {
        samples: samples.length,
        medianDownloadMbps: round(percentile(downloads, 50)),
        worstDecileDownloadMbps: round(percentile(downloads, 10)),
        avgPacketLossPct: losses.length ? round(losses.reduce((a, b) => a + b, 0) / losses.length, 2) : null
    };
}

/**
 * Hours of the day at which hot water was actually measured hot, as a share of
 * observations for that hour. A guest wants to know whether 6am works, not an
 * all-day average that a hot afternoon can carry.
 */
function summariseHotWaterByHour(events, { windowStart, windowEnd } = {}) {
    const hours = Array.from({ length: 24 }, () => ({ up: 0, total: 0 }));

    events
        .filter(e =>
            (!windowStart || e.observedAt >= windowStart) &&
            (!windowEnd || e.observedAt <= windowEnd)
        )
        .forEach(event => {
            const hour = event.observedAt.getUTCHours();
            hours[hour].total += 1;
            if (event.status === 'up') hours[hour].up += 1;
        });

    return hours.map((bucket, hour) => ({
        hour,
        observations: bucket.total,
        availabilityPct: bucket.total ? round((bucket.up / bucket.total) * 100) : null
    }));
}

/**
 * Build the full published record for a hostel.
 */
async function buildReliability(hostelId, now = new Date()) {
    const longest = WINDOWS[WINDOWS.length - 1];
    const earliest = new Date(now.getTime() - longest.days * 24 * 60 * MINUTE);

    const events = await ReliabilityEvent.find({
        hostel: hostelId,
        observedAt: { $gte: earliest, $lte: now }
    }).sort({ observedAt: 1 }).lean();

    const byMetric = metric => events.filter(e => e.metric === metric);

    const windows = {};
    WINDOWS.forEach(({ key, days }) => {
        const windowStart = new Date(now.getTime() - days * 24 * 60 * MINUTE);
        const bounds = { windowStart, windowEnd: now };

        windows[key] = {
            power: summariseUptime(byMetric('power'), bounds),
            hotWater: summariseUptime(byMetric('hot_water'), bounds),
            wifi: summariseWifi(byMetric('wifi'), bounds)
        };
    });

    return {
        // The panel shows this so a guest knows how fresh the record is; a
        // number with no timestamp is not verifiable.
        computedAt: now,
        measurementWindows: WINDOWS.map(w => w.key),
        minPublishableCoveragePct: MIN_PUBLISHABLE_COVERAGE_PCT,
        maxGapMinutes: DEFAULT_MAX_GAP_MINUTES,
        windows,
        hotWaterByHour: summariseHotWaterByHour(byMetric('hot_water'), {
            windowStart: new Date(now.getTime() - 30 * 24 * 60 * MINUTE),
            windowEnd: now
        }),
        totalObservations: events.length
    };
}

module.exports = {
    summariseUptime,
    summariseWifi,
    summariseHotWaterByHour,
    buildReliability,
    percentile,
    WINDOWS,
    DEFAULT_MAX_GAP_MINUTES,
    MIN_PUBLISHABLE_COVERAGE_PCT
};
