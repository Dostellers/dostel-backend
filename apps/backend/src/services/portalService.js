const crypto = require('crypto');
const Customer = require('../models/customer');
const MembershipPlan = require('../models/membershipPlan');
const MembershipSubscription = require('../models/membershipSubscription');
const PortalSession = require('../models/portalSession');
const logger = require('../config/logger');

const DEFAULT_COUNTRY_CODE = process.env.PORTAL_DEFAULT_COUNTRY_CODE || '91';
const GRANT_MINUTES = parseInt(process.env.PORTAL_GRANT_MINUTES || '1440', 10);
const ENTRY_PLAN_NAME = process.env.PORTAL_ENTRY_PLAN_NAME || 'Bronze';

/**
 * Best-effort E.164 normalization, tuned for Indian numbers since that is the
 * overwhelming majority at Vattakanal. Returns null when the input cannot be
 * confidently normalized — callers must treat null as "no match key", never as
 * a reason to reject the guest.
 */
function normalizePhone(raw, countryCode = DEFAULT_COUNTRY_CODE) {
    if (!raw || typeof raw !== 'string') return null;

    let value = raw.trim();
    const hadPlus = value.startsWith('+');
    let digits = value.replace(/\D/g, '');
    if (!digits) return null;

    if (!hadPlus && digits.startsWith('00')) {
        digits = digits.slice(2);
    } else if (!hadPlus) {
        // Domestic trunk prefix, e.g. 09876543210
        if (digits.length === 11 && digits.startsWith('0')) {
            digits = countryCode + digits.slice(1);
        } else if (digits.length === 10) {
            digits = countryCode + digits;
        }
    }

    // Reject anything outside plausible E.164 bounds rather than storing junk
    // that would later collide in the unique index.
    if (digits.length < 8 || digits.length > 15) return null;

    return `+${digits}`;
}

/**
 * Device identity for the portal.
 *
 * MAC is the reliable signal when the router supplies it. Modern phones
 * randomize MACs per-SSID, but that randomization is stable for a given
 * network, which is exactly the scope we need. We fall back to a UA+IP hash
 * when the router gives us nothing, accepting that it is weaker.
 */
function deriveFingerprint({ macAddress, userAgent, ipAddress }) {
    const basis = macAddress
        ? `mac:${macAddress.toLowerCase().replace(/[^a-f0-9]/g, '')}`
        : `ua:${userAgent || 'unknown'}|ip:${ipAddress || 'unknown'}`;
    return crypto.createHash('sha256').update(basis).digest('hex').slice(0, 32);
}

function getGrantSecret() {
    const secret = process.env.PORTAL_GRANT_SECRET;
    if (!secret) {
        throw new Error('PORTAL_GRANT_SECRET is not configured');
    }
    return secret;
}

/**
 * Sign the authorization the router acts on.
 *
 * The router must never grant access on the strength of a client-side redirect
 * alone — a guest could otherwise craft one. It verifies this HMAC first.
 */
function signGrant({ sessionId, macAddress, expiresAt }) {
    const payload = `${sessionId}|${(macAddress || '').toLowerCase()}|${expiresAt.getTime()}`;
    const signature = crypto
        .createHmac('sha256', getGrantSecret())
        .update(payload)
        .digest('hex');
    return { payload, signature };
}

function verifyGrant({ sessionId, macAddress, expiresAt, signature }) {
    if (!signature) return false;
    let expected;
    try {
        expected = signGrant({ sessionId, macAddress, expiresAt }).signature;
    } catch (err) {
        return false;
    }
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(String(signature), 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

function buildConsentRecords({ consents = {}, ipAddress, policyVersion }) {
    const now = new Date();
    // network_terms is implied by using the network at all; the other two are
    // separate purposes the guest can decline while still getting online.
    return ['network_terms', 'marketing', 'whatsapp_community']
        .filter(purpose => Object.prototype.hasOwnProperty.call(consents, purpose))
        .map(purpose => ({
            purpose,
            granted: consents[purpose] === true,
            grantedAt: consents[purpose] === true ? now : undefined,
            source: 'wifi_portal',
            policyVersion,
            ipAddress
        }));
}

/**
 * Grant the entry-tier membership that makes a captured guest a Dosteller.
 *
 * Deliberately best-effort: a missing plan or a write failure must never stop a
 * guest getting online. We log and move on, and the guest is still captured.
 */
async function provisionEntryMembership(customer) {
    try {
        const existing = await MembershipSubscription.findOne({
            customer: customer._id,
            status: 'active'
        });
        if (existing) return existing;

        const plan = await MembershipPlan.findOne({ name: ENTRY_PLAN_NAME, isActive: true });
        if (!plan) {
            logger.warn(`portal: entry plan "${ENTRY_PLAN_NAME}" not found; skipping membership`);
            return null;
        }

        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

        return await MembershipSubscription.create({
            customer: customer._id,
            plan: plan._id,
            status: 'active',
            startDate,
            endDate,
            autoRenew: false
        });
    } catch (err) {
        logger.error(`portal: membership provisioning failed for ${customer._id}: ${err.message}`);
        return null;
    }
}

/**
 * Find the guest behind this submission, or create them.
 *
 * Match order is phone, then email — phone is the primary identity in this
 * market and the one the portal always asks for.
 */
async function matchOrCreateCustomer({ fullName, phone, email, country, fingerprint, userAgent, macAddress }) {
    const phoneNormalized = normalizePhone(phone);
    const normalizedEmail = email ? String(email).trim().toLowerCase() : null;

    let customer = null;
    if (phoneNormalized) {
        customer = await Customer.findOne({ phoneNormalized });
    }
    if (!customer && normalizedEmail) {
        customer = await Customer.findOne({ email: normalizedEmail });
    }

    const isNew = !customer;

    if (isNew) {
        customer = new Customer({
            fullName: fullName || 'Guest',
            phone: phone,
            phoneNormalized,
            acquisitionSource: 'wifi_portal',
            acquisitionCapturedAt: new Date()
        });
        if (normalizedEmail) customer.email = normalizedEmail;
        if (country) customer.address = { ...(customer.address || {}), country };
    } else {
        // Fill gaps on an existing record without overwriting what we already
        // hold — an OTA import may have better data than a hurried form fill.
        if (!customer.phoneNormalized && phoneNormalized) customer.phoneNormalized = phoneNormalized;
        if (!customer.email && normalizedEmail) customer.email = normalizedEmail;
        if (!customer.fullName && fullName) customer.fullName = fullName;
    }

    upsertDeviceFingerprint(customer, { fingerprint, userAgent, macAddress });

    return { customer, isNew };
}

function upsertDeviceFingerprint(customer, { fingerprint, userAgent, macAddress }) {
    if (!fingerprint) return;
    const now = new Date();
    const existing = (customer.deviceFingerprints || []).find(d => d.fingerprint === fingerprint);
    if (existing) {
        existing.lastSeenAt = now;
        if (macAddress && !existing.macAddress) existing.macAddress = macAddress;
    } else {
        customer.deviceFingerprints.push({
            fingerprint,
            macAddress,
            userAgent,
            firstSeenAt: now,
            lastSeenAt: now
        });
    }
}

/**
 * Look up a device we have seen before, so a returning guest goes straight
 * online instead of filling the form again.
 */
async function findCustomerByFingerprint(fingerprint) {
    if (!fingerprint) return null;
    return Customer.findOne({ 'deviceFingerprints.fingerprint': fingerprint });
}

/**
 * Authorize a session and produce the signed grant the router needs.
 */
async function authorizeSession(session, { captureType }) {
    const expiresAt = new Date(Date.now() + GRANT_MINUTES * 60 * 1000);
    session.status = 'authorized';
    session.captureType = captureType;
    session.authorizedAt = new Date();
    session.grantMinutes = GRANT_MINUTES;
    session.expiresAt = expiresAt;
    await session.save();

    const { signature } = signGrant({
        sessionId: session._id.toString(),
        macAddress: session.macAddress,
        expiresAt
    });

    return {
        sessionId: session._id.toString(),
        expiresAt,
        grantMinutes: GRANT_MINUTES,
        signature
    };
}

module.exports = {
    normalizePhone,
    deriveFingerprint,
    signGrant,
    verifyGrant,
    buildConsentRecords,
    provisionEntryMembership,
    matchOrCreateCustomer,
    upsertDeviceFingerprint,
    findCustomerByFingerprint,
    authorizeSession,
    GRANT_MINUTES,
    ENTRY_PLAN_NAME
};
