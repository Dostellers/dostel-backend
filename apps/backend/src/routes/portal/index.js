const express = require('express');
const PortalSession = require('../../models/portalSession');
const Referral = require('../../models/referral');
const portalService = require('../../services/portalService');
const logger = require('../../config/logger');

const router = express.Router();

// Scoped rather than global: the Stripe webhook in routes/admin needs the raw
// body, so a top-level express.json() would break it.
router.use(express.json({ limit: '16kb' }));

const POLICY_VERSION = process.env.PORTAL_POLICY_VERSION || '2026-08-07';

// ---------------------------------------------------------------------------
// Rate limiting
//
// These endpoints are unauthenticated and reachable by anyone on the guest LAN.
// The project has no rate-limit dependency, so this is a deliberately small
// in-memory limiter. It is per-process, which is fine for a single-property
// deployment; revisit if the backend is ever horizontally scaled.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = parseInt(process.env.PORTAL_RATE_LIMIT_MAX || '20', 10);
const hits = new Map();

function rateLimit(req, res, next) {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
        hits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return next();
    }

    entry.count += 1;
    if (entry.count > RATE_LIMIT_MAX) {
        return res.status(429).json({ error: 'Too many requests, please wait a moment.' });
    }
    next();
}

// Bounded cleanup so the map cannot grow without limit on a long-running process.
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
        if (now > entry.resetAt) hits.delete(key);
    }
}, RATE_LIMIT_WINDOW_MS).unref();

router.use(rateLimit);

function clientContext(req) {
    return {
        macAddress: req.query.mac || req.body?.macAddress || null,
        apMacAddress: req.query.ap || null,
        ssid: req.query.ssid || null,
        userAgent: req.get('user-agent') || null,
        ipAddress: req.ip || null
    };
}

/**
 * GET /api/portal/session
 *
 * Entry point the router redirects unauthenticated clients to. Tells the portal
 * page whether this device is already known (skip the form) or new (show it).
 */
router.get('/session', async (req, res) => {
    try {
        const ctx = clientContext(req);
        const fingerprint = portalService.deriveFingerprint(ctx);

        const session = await PortalSession.create({
            fingerprint,
            macAddress: ctx.macAddress,
            apMacAddress: ctx.apMacAddress,
            ssid: ctx.ssid,
            userAgent: ctx.userAgent,
            ipAddress: ctx.ipAddress,
            status: 'pending'
        });

        const known = await portalService.findCustomerByFingerprint(fingerprint);

        if (known) {
            session.customer = known._id;
            portalService.upsertDeviceFingerprint(known, { fingerprint, ...ctx });
            await known.save();
            const grant = await portalService.authorizeSession(session, { captureType: 'returning' });
            return res.json({
                sessionId: session._id.toString(),
                returning: true,
                greetingName: known.fullName,
                grant
            });
        }

        return res.json({
            sessionId: session._id.toString(),
            returning: false,
            policyVersion: POLICY_VERSION
        });
    } catch (err) {
        logger.error(`portal: session start failed: ${err.message}`);
        res.status(500).json({ error: 'Could not start a portal session.' });
    }
});

/**
 * POST /api/portal/session
 *
 * Form submission. Creates or matches the guest, records consent, provisions the
 * entry membership, and returns the signed grant.
 *
 * Idempotent on `submissionKey` so the portal page's offline queue can replay a
 * submission safely once connectivity returns.
 */
router.post('/session', async (req, res) => {
    try {
        const {
            sessionId,
            submissionKey,
            fullName,
            phone,
            email,
            country,
            stayPurpose,
            referralCode,
            consents = {}
        } = req.body || {};

        if (!fullName || (!phone && !email)) {
            return res.status(400).json({ error: 'A name and either a phone number or email are required.' });
        }

        // Replay of an already-processed submission: return the original grant
        // rather than creating a second customer.
        if (submissionKey) {
            const prior = await PortalSession.findOne({ submissionKey, status: 'authorized' });
            if (prior) {
                const { signature } = portalService.signGrant({
                    sessionId: prior._id.toString(),
                    macAddress: prior.macAddress,
                    expiresAt: prior.expiresAt
                });
                return res.json({
                    sessionId: prior._id.toString(),
                    replayed: true,
                    grant: {
                        sessionId: prior._id.toString(),
                        expiresAt: prior.expiresAt,
                        grantMinutes: prior.grantMinutes,
                        signature
                    }
                });
            }
        }

        const ctx = clientContext(req);
        const fingerprint = portalService.deriveFingerprint(ctx);

        let session = sessionId ? await PortalSession.findById(sessionId) : null;
        if (!session) {
            // The portal page may have been filled in offline, after the original
            // session row was lost. Create one rather than rejecting the guest.
            session = await PortalSession.create({
                fingerprint,
                macAddress: ctx.macAddress,
                apMacAddress: ctx.apMacAddress,
                ssid: ctx.ssid,
                userAgent: ctx.userAgent,
                ipAddress: ctx.ipAddress,
                status: 'pending'
            });
        }

        const { customer, isNew } = await portalService.matchOrCreateCustomer({
            fullName,
            phone,
            email,
            country,
            fingerprint,
            userAgent: ctx.userAgent,
            macAddress: ctx.macAddress
        });

        const consentRecords = portalService.buildConsentRecords({
            consents,
            ipAddress: ctx.ipAddress,
            policyVersion: POLICY_VERSION
        });
        consentRecords.forEach(record => customer.consents.push(record));

        // Keep the legacy marketing flag in step with the consent record so
        // existing mail paths respect a portal opt-out.
        if (Object.prototype.hasOwnProperty.call(consents, 'marketing')) {
            customer.newsletterSubscription = consents.marketing === true;
        }

        if (referralCode) {
            await attachReferral(customer, referralCode);
        }

        await customer.save();

        // Best-effort: a failure here must not cost the guest their network access.
        await portalService.provisionEntryMembership(customer);

        session.customer = customer._id;
        session.stayPurpose = stayPurpose || null;
        session.referralCode = referralCode || null;
        if (submissionKey) session.submissionKey = submissionKey;

        const grant = await portalService.authorizeSession(session, {
            captureType: isNew ? 'new' : 'returning'
        });

        return res.json({
            sessionId: session._id.toString(),
            customerId: customer._id.toString(),
            isNew,
            grant
        });
    } catch (err) {
        // A duplicate submissionKey means a concurrent replay won the race; the
        // guest is already captured, so treat it as success on retry.
        if (err.code === 11000 && req.body?.submissionKey) {
            return res.status(409).json({ error: 'Submission already processed, retry to fetch the grant.' });
        }
        logger.error(`portal: submission failed: ${err.message}`);
        res.status(500).json({ error: 'Could not complete signup. Please ask at reception.' });
    }
});

/**
 * POST /api/portal/authorize
 *
 * Called by the router to verify a grant before opening the walled garden. The
 * router must not trust a client-side redirect on its own.
 */
router.post('/authorize', async (req, res) => {
    try {
        const { sessionId, signature } = req.body || {};
        if (!sessionId || !signature) {
            return res.status(400).json({ authorized: false, error: 'sessionId and signature are required.' });
        }

        const session = await PortalSession.findById(sessionId);
        if (!session || session.status !== 'authorized' || !session.expiresAt) {
            return res.status(404).json({ authorized: false, error: 'No authorized session.' });
        }

        if (session.expiresAt.getTime() < Date.now()) {
            session.status = 'expired';
            await session.save();
            return res.status(410).json({ authorized: false, error: 'Grant expired.' });
        }

        const valid = portalService.verifyGrant({
            sessionId: session._id.toString(),
            macAddress: session.macAddress,
            expiresAt: session.expiresAt,
            signature
        });

        if (!valid) {
            return res.status(403).json({ authorized: false, error: 'Invalid signature.' });
        }

        return res.json({
            authorized: true,
            macAddress: session.macAddress,
            expiresAt: session.expiresAt,
            grantMinutes: session.grantMinutes
        });
    } catch (err) {
        logger.error(`portal: authorize failed: ${err.message}`);
        res.status(500).json({ authorized: false, error: 'Authorization check failed.' });
    }
});

/**
 * Resolve a referral code onto the new customer. Validation only — the payout
 * still fires on the referee's first completed booking, per the referral design.
 */
async function attachReferral(customer, code) {
    try {
        const referral = await Referral.findOne({ code: String(code).trim().toUpperCase() });
        if (!referral) return;
        if (referral.expirationDate && referral.expirationDate.getTime() < Date.now()) return;
        if (!customer.referredBy) customer.referredBy = referral.referrer;
        if (customer.acquisitionSource === 'wifi_portal') {
            customer.acquisitionSource = 'referral';
        }
    } catch (err) {
        logger.warn(`portal: referral attach failed for code ${code}: ${err.message}`);
    }
}

module.exports = router;
