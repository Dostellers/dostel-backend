const assert = require('assert');

process.env.PORTAL_GRANT_SECRET = process.env.PORTAL_GRANT_SECRET || 'test-secret-do-not-use-in-prod';

const portalService = require('../src/services/portalService');
const Customer = require('../src/models/customer');
const PortalSession = require('../src/models/portalSession');

const validate = document => new Promise(resolve => document.validate(error => resolve(error)));

const run = async () => {
    // --- normalizePhone -----------------------------------------------------
    const { normalizePhone } = portalService;

    assert.strictEqual(normalizePhone('9876543210'), '+919876543210', 'bare 10-digit gets country code');
    assert.strictEqual(normalizePhone('09876543210'), '+919876543210', 'trunk prefix stripped');
    assert.strictEqual(normalizePhone('+91 98765 43210'), '+919876543210', 'spaces and plus handled');
    assert.strictEqual(normalizePhone('+91-98765-43210'), '+919876543210', 'dashes handled');
    assert.strictEqual(normalizePhone('0091 9876543210'), '+919876543210', '00 international prefix handled');
    assert.strictEqual(normalizePhone('+44 7700 900123'), '+447700900123', 'non-Indian number preserved');

    // The same guest entering their number three different ways must collapse to
    // one match key, otherwise the portal creates duplicate customers.
    const variants = ['9876543210', '+919876543210', '098765 43210'];
    const normalized = new Set(variants.map(v => normalizePhone(v)));
    assert.strictEqual(normalized.size, 1, 'all variants collapse to one key');

    assert.strictEqual(normalizePhone(''), null, 'empty is null');
    assert.strictEqual(normalizePhone(null), null, 'null is null');
    assert.strictEqual(normalizePhone('abc'), null, 'non-numeric is null');
    assert.strictEqual(normalizePhone('12345'), null, 'too short is null');
    assert.strictEqual(normalizePhone('1234567890123456789'), null, 'too long is null');

    // --- deriveFingerprint --------------------------------------------------
    const { deriveFingerprint } = portalService;

    const macA = deriveFingerprint({ macAddress: 'AA:BB:CC:DD:EE:FF', userAgent: 'x', ipAddress: '1.1.1.1' });
    const macB = deriveFingerprint({ macAddress: 'aa-bb-cc-dd-ee-ff', userAgent: 'y', ipAddress: '2.2.2.2' });
    assert.strictEqual(macA, macB, 'MAC formatting and other fields do not change the fingerprint');

    const macC = deriveFingerprint({ macAddress: '11:22:33:44:55:66' });
    assert.notStrictEqual(macA, macC, 'different MACs differ');

    const uaOnly = deriveFingerprint({ userAgent: 'Mozilla/5.0', ipAddress: '10.0.0.5' });
    assert.strictEqual(uaOnly.length, 32, 'fallback fingerprint is produced when no MAC');
    assert.notStrictEqual(uaOnly, macA, 'fallback differs from MAC-based');

    // --- grant signing ------------------------------------------------------
    const { signGrant, verifyGrant } = portalService;

    const sessionId = '507f1f77bcf86cd799439011';
    const macAddress = 'AA:BB:CC:DD:EE:FF';
    const expiresAt = new Date('2026-08-08T00:00:00.000Z');

    const { signature } = signGrant({ sessionId, macAddress, expiresAt });
    assert.ok(signature && signature.length === 64, 'signature is a sha256 hex digest');

    assert.strictEqual(
        verifyGrant({ sessionId, macAddress, expiresAt, signature }),
        true,
        'a valid grant verifies'
    );

    // A guest must not be able to extend their own access or authorize another
    // device by editing the redirect.
    assert.strictEqual(
        verifyGrant({ sessionId, macAddress, expiresAt: new Date('2027-01-01T00:00:00.000Z'), signature }),
        false,
        'tampered expiry is rejected'
    );
    assert.strictEqual(
        verifyGrant({ sessionId, macAddress: '11:22:33:44:55:66', expiresAt, signature }),
        false,
        'tampered MAC is rejected'
    );
    assert.strictEqual(
        verifyGrant({ sessionId: '507f1f77bcf86cd799439099', macAddress, expiresAt, signature }),
        false,
        'tampered session id is rejected'
    );
    assert.strictEqual(
        verifyGrant({ sessionId, macAddress, expiresAt, signature: null }),
        false,
        'missing signature is rejected'
    );
    assert.strictEqual(
        verifyGrant({ sessionId, macAddress, expiresAt, signature: 'short' }),
        false,
        'wrong-length signature is rejected without throwing'
    );

    // Case-insensitive MAC must still verify, since routers report it either way.
    const lowered = signGrant({ sessionId, macAddress: 'aa:bb:cc:dd:ee:ff', expiresAt });
    assert.strictEqual(lowered.signature, signature, 'MAC case does not change the signature');

    // --- consent records ----------------------------------------------------
    const { buildConsentRecords } = portalService;

    const records = buildConsentRecords({
        consents: { network_terms: true, marketing: false, whatsapp_community: true },
        ipAddress: '10.0.0.5',
        policyVersion: '2026-08-07'
    });
    assert.strictEqual(records.length, 3, 'one record per submitted purpose');

    const marketing = records.find(r => r.purpose === 'marketing');
    assert.strictEqual(marketing.granted, false, 'declined marketing is recorded as declined');
    assert.strictEqual(marketing.grantedAt, undefined, 'declined consent carries no grant timestamp');

    const network = records.find(r => r.purpose === 'network_terms');
    assert.strictEqual(network.granted, true);
    assert.ok(network.grantedAt instanceof Date, 'granted consent is timestamped');
    assert.strictEqual(network.source, 'wifi_portal');
    assert.strictEqual(network.policyVersion, '2026-08-07', 'policy version is captured for audit');

    // Purposes the guest was never asked about must not be fabricated as declines.
    const partial = buildConsentRecords({ consents: { network_terms: true }, ipAddress: '10.0.0.5' });
    assert.strictEqual(partial.length, 1, 'unasked purposes produce no record');

    // --- hasConsent ---------------------------------------------------------
    const customer = new Customer({
        fullName: 'Test Guest',
        phone: '9876543210',
        phoneNormalized: '+919876543210',
        acquisitionSource: 'wifi_portal'
    });

    assert.strictEqual(await validate(customer), null, 'a portal customer with no email is valid');
    assert.strictEqual(customer.hasConsent('marketing'), false, 'no record means no consent');

    customer.consents.push({ purpose: 'marketing', granted: true, grantedAt: new Date(), source: 'wifi_portal' });
    assert.strictEqual(customer.hasConsent('marketing'), true, 'granted consent reads true');

    customer.consents.push({
        purpose: 'marketing',
        granted: false,
        withdrawnAt: new Date(),
        source: 'dashboard'
    });
    assert.strictEqual(customer.hasConsent('marketing'), false, 'later withdrawal wins');

    customer.consents.push({ purpose: 'marketing', granted: true, grantedAt: new Date(), source: 'dashboard' });
    assert.strictEqual(customer.hasConsent('marketing'), true, 're-grant after withdrawal reads true');

    // Consent is per-purpose: declining marketing must not affect network access.
    assert.strictEqual(customer.hasConsent('whatsapp_community'), false, 'purposes are independent');

    // --- model validation ---------------------------------------------------
    const badConsent = new Customer({
        fullName: 'Bad',
        phone: '9876543210',
        consents: [{ purpose: 'not_a_purpose', granted: true, source: 'wifi_portal' }]
    });
    const consentError = await validate(badConsent);
    assert.ok(consentError && consentError.errors, 'an unknown consent purpose is rejected');

    const session = new PortalSession({ fingerprint: 'abc123' });
    assert.strictEqual(await validate(session), null, 'a minimal portal session is valid');
    assert.strictEqual(session.status, 'pending', 'sessions start pending');
    assert.strictEqual(session.captureType, 'none', 'capture type starts none');
    assert.strictEqual(session.customer, null, 'an unconverted session has no customer');

    const noFingerprint = new PortalSession({});
    const sessionError = await validate(noFingerprint);
    assert.ok(sessionError.errors.fingerprint, 'fingerprint is required');

    console.log('portalCapture: all assertions passed');
};

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
