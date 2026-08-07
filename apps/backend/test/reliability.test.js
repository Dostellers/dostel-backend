const assert = require('assert');
const crypto = require('crypto');

process.env.TELEMETRY_DEVICE_KEYS = 'pi-vattakanal-01:device-secret-1,pi-vattakanal-02:device-secret-2';

const reliability = require('../src/services/reliabilityService');
const telemetry = require('../src/routes/telemetry');

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const at = (base, minutes) => new Date(base.getTime() + minutes * MINUTE);

const run = async () => {
    const { summariseUptime, summariseWifi, summariseHotWaterByHour, percentile } = reliability;

    const windowEnd = new Date('2026-08-07T12:00:00Z');
    const windowStart = new Date(windowEnd.getTime() - 6 * HOUR);

    // --- gaps are unknown, never uptime ------------------------------------
    // The whole feature turns on this. When the property loses power the device
    // reporting on the power often dies too, so silence is ambiguous — counting
    // it as "up" would produce a beautiful number that is just the sensor's own
    // absence.

    // Two observations 6 hours apart. Only maxGapMinutes of that is attributable.
    const sparse = summariseUptime(
        [
            { status: 'up', observedAt: windowStart },
            { status: 'up', observedAt: windowEnd }
        ],
        { windowStart, windowEnd, maxGapMinutes: 20 }
    );
    assert.strictEqual(sparse.upMinutes, 20, 'an observation speaks for at most maxGapMinutes');
    assert.strictEqual(sparse.unknownMinutes, 340, 'the rest of the window is unknown, not up');
    assert.strictEqual(sparse.uptimePct, 100, 'uptime is a share of observed time');
    assert.ok(sparse.coveragePct < 10, 'and coverage exposes how little was observed');
    assert.strictEqual(sparse.publishable, false, 'so the figure is not fit to publish');

    // No observations at all must not read as perfect.
    const silent = summariseUptime([], { windowStart, windowEnd });
    assert.strictEqual(silent.uptimePct, null, 'no data yields no uptime figure, not 100%');
    assert.strictEqual(silent.coveragePct, 0);
    assert.strictEqual(silent.publishable, false);
    assert.strictEqual(silent.unknownMinutes, 360, 'the whole window is unknown');

    // --- a well-covered window ---------------------------------------------
    // Report every 10 minutes for 6 hours; the last hour is an outage.
    const dense = [];
    for (let m = 0; m < 360; m += 10) {
        dense.push({ status: m >= 300 ? 'down' : 'up', observedAt: at(windowStart, m) });
    }

    const covered = summariseUptime(dense, { windowStart, windowEnd, maxGapMinutes: 20 });
    assert.strictEqual(covered.coveragePct, 100, 'dense reporting covers the window');
    assert.strictEqual(covered.publishable, true);
    assert.strictEqual(covered.upMinutes, 300);
    assert.strictEqual(covered.downMinutes, 60);
    assert.strictEqual(covered.uptimePct, 83.3, 'a real outage shows up in the published number');

    // The bad month is the point — an outage must not be roundable to 100%.
    assert.ok(covered.uptimePct < 100, 'downtime is never hidden');

    // --- degraded is tracked separately ------------------------------------
    const mixed = summariseUptime(
        [
            { status: 'up', observedAt: at(windowStart, 0) },
            { status: 'degraded', observedAt: at(windowStart, 10) },
            { status: 'up', observedAt: at(windowStart, 20) },
            { status: 'up', observedAt: at(windowStart, 30) }
        ],
        { windowStart, windowEnd, maxGapMinutes: 20 }
    );
    assert.strictEqual(mixed.degradedMinutes, 10, 'degraded time is its own bucket');
    assert.ok(mixed.uptimePct < 100, 'and does not count as up');

    // Events outside the window are excluded.
    const outside = summariseUptime(
        [
            { status: 'down', observedAt: new Date(windowStart.getTime() - HOUR) },
            { status: 'up', observedAt: at(windowStart, 0) },
            { status: 'down', observedAt: new Date(windowEnd.getTime() + HOUR) }
        ],
        { windowStart, windowEnd, maxGapMinutes: 20 }
    );
    assert.strictEqual(outside.downMinutes, 0, 'events outside the window do not leak in');

    // --- wifi: the floor, not the average ----------------------------------
    // A month of fast afternoons and unusable evenings must not average into
    // "fine" — a remote worker is choosing on the bad evening.
    const wifiSamples = [
        ...Array.from({ length: 18 }, (_, i) => ({ downloadMbps: 40, packetLossPct: 0, observedAt: at(windowStart, i) })),
        ...Array.from({ length: 2 }, (_, i) => ({ downloadMbps: 1, packetLossPct: 20, observedAt: at(windowStart, 18 + i) }))
    ];

    const wifi = summariseWifi(wifiSamples, { windowStart, windowEnd });
    assert.strictEqual(wifi.samples, 20);
    assert.strictEqual(wifi.medianDownloadMbps, 40, 'the median reflects the typical case');
    assert.strictEqual(wifi.worstDecileDownloadMbps, 1, 'and the worst decile exposes the bad evenings');
    assert.strictEqual(wifi.avgPacketLossPct, 2);

    // A mean would have read ~36 Mbps here and buried the problem.
    const mean = wifiSamples.reduce((a, s) => a + s.downloadMbps, 0) / wifiSamples.length;
    assert.ok(mean > 30 && wifi.worstDecileDownloadMbps === 1, 'the mean would have hidden what the p10 shows');

    const noWifi = summariseWifi([], { windowStart, windowEnd });
    assert.strictEqual(noWifi.samples, 0);
    assert.strictEqual(noWifi.medianDownloadMbps, null, 'no samples yields null, not zero');

    // --- percentiles --------------------------------------------------------
    assert.strictEqual(percentile([1, 2, 3, 4, 5], 50), 3);
    assert.strictEqual(percentile([1, 2, 3, 4, 5], 10), 1);
    assert.strictEqual(percentile([1, 2, 3, 4, 5], 100), 5);
    assert.strictEqual(percentile([], 50), null);
    assert.strictEqual(percentile([7], 50), 7);

    // --- hot water by hour --------------------------------------------------
    // "Is there hot water at 6am" is the actual question. An all-day average
    // that a hot afternoon carries does not answer it.
    const hotWater = [];
    [5, 6, 7].forEach(hour => {
        for (let i = 0; i < 10; i++) {
            hotWater.push({
                status: hour === 6 ? 'down' : 'up',
                observedAt: new Date(Date.UTC(2026, 7, 1, hour, i * 5))
            });
        }
    });

    const byHour = summariseHotWaterByHour(hotWater);
    assert.strictEqual(byHour.length, 24, 'every hour is represented');
    assert.strictEqual(byHour[5].availabilityPct, 100);
    assert.strictEqual(byHour[6].availabilityPct, 0, 'the 6am failure is visible at 6am');
    assert.strictEqual(byHour[7].availabilityPct, 100);
    assert.strictEqual(byHour[12].availabilityPct, null, 'an unobserved hour is null, not zero');
    assert.strictEqual(byHour[12].observations, 0);

    // --- device authentication ---------------------------------------------
    const body = JSON.stringify({ hostelId: 'h1', observations: [] });
    const sign = (b, secret) => crypto.createHmac('sha256', secret).update(b).digest('hex');
    const req = (b, deviceId, signature) => ({
        body: Buffer.from(b),
        get: name => ({
            'x-device-id': deviceId,
            'x-device-signature': signature
        })[name.toLowerCase()]
    });

    assert.strictEqual(
        telemetry.verifyDevice(req(body, 'pi-vattakanal-01', sign(body, 'device-secret-1'))),
        'pi-vattakanal-01',
        'a correctly signed batch identifies its device'
    );

    // Each device has its own key, so one cannot sign as another.
    assert.strictEqual(
        telemetry.verifyDevice(req(body, 'pi-vattakanal-01', sign(body, 'device-secret-2'))),
        null,
        'device 2 cannot sign as device 1'
    );
    assert.strictEqual(telemetry.verifyDevice(req(body, 'unknown-device', sign(body, 'x'))), null, 'an unknown device is rejected');
    assert.strictEqual(telemetry.verifyDevice(req(body, 'pi-vattakanal-01', undefined)), null, 'a missing signature is rejected');
    assert.strictEqual(telemetry.verifyDevice(req(body, undefined, sign(body, 'device-secret-1'))), null, 'a missing device id is rejected');
    assert.strictEqual(telemetry.verifyDevice(req(body, 'pi-vattakanal-01', 'short')), null, 'a wrong-length signature is rejected without throwing');

    const tampered = JSON.stringify({ hostelId: 'h2', observations: [] });
    assert.strictEqual(
        telemetry.verifyDevice(req(tampered, 'pi-vattakanal-01', sign(body, 'device-secret-1'))),
        null,
        'a modified body fails its original signature'
    );

    // --- observation validation --------------------------------------------
    const now = new Date('2026-08-07T12:00:00Z');
    const opts = { now, deviceId: 'pi-vattakanal-01' };

    const good = telemetry.validateObservation(
        { metric: 'power', status: 'up', observedAt: '2026-08-07T11:50:00Z', sequence: 42 },
        opts
    );
    assert.ok(good.value, 'a well-formed observation is accepted');
    assert.strictEqual(good.value.deviceId, 'pi-vattakanal-01', 'the device id comes from the signature, not the body');
    assert.strictEqual(good.value.sequence, 42);

    // Backfill is the normal case here — the device buffers through an outage.
    const backfilled = telemetry.validateObservation(
        { metric: 'power', status: 'down', observedAt: '2026-08-05T03:00:00Z' },
        opts
    );
    assert.ok(backfilled.value, 'a two-day-old observation is accepted — buffering is expected');

    // A bad clock corrupts a published number silently; silence only shows as a gap.
    assert.ok(
        telemetry.validateObservation({ metric: 'power', status: 'up', observedAt: '2026-09-01T00:00:00Z' }, opts).error,
        'a future timestamp is rejected'
    );
    assert.ok(
        telemetry.validateObservation({ metric: 'power', status: 'up', observedAt: '2026-01-01T00:00:00Z' }, opts).error,
        'an implausibly old timestamp is rejected'
    );
    assert.ok(
        telemetry.validateObservation({ metric: 'power', status: 'up', observedAt: 'not-a-date' }, opts).error,
        'an unparseable timestamp is rejected'
    );
    assert.ok(
        telemetry.validateObservation({ metric: 'vibes', status: 'up', observedAt: now.toISOString() }, opts).error,
        'an unknown metric is rejected'
    );
    assert.ok(
        telemetry.validateObservation({ metric: 'power', status: 'excellent', observedAt: now.toISOString() }, opts).error,
        'an unknown status is rejected'
    );

    // Junk numerics become null rather than poisoning an average.
    const junk = telemetry.validateObservation(
        { metric: 'wifi', observedAt: now.toISOString(), downloadMbps: 'fast', packetLossPct: NaN },
        opts
    );
    assert.strictEqual(junk.value.downloadMbps, null, 'a non-numeric reading is null, not NaN');
    assert.strictEqual(junk.value.packetLossPct, null, 'NaN is null');

    console.log('reliability: all assertions passed');
};

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
