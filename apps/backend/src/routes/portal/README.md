# Captive portal (DOS-501)

Converts anonymous OTA arrivals into Dostellers at the WiFi login — the point
where every guest passes within ~90 seconds of arriving.

## Pieces

| Piece | Location |
|---|---|
| Portal page | `apps/frontend/public/portal/index.html` (static, self-contained) |
| API | `apps/backend/src/routes/portal/index.js` |
| Logic | `apps/backend/src/services/portalService.js` |
| Session model | `apps/backend/src/models/portalSession.js` |
| Migration | `apps/backend/migrations/001-portal-capture-indexes.js` |
| Tests | `apps/backend/test/portalCapture.test.js`, `apps/frontend/lib/portal-page.test.js` |

## Before first run

1. Generate the grant secret and put it in `apps/backend/.env`:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Set the same value on the router. See `.env.example` for the rest.

2. Run the migration — the portal cannot create phone-only customers until the
   email index is sparse:
   ```
   node migrations/001-portal-capture-indexes.js
   ```
   Read its collision report. Duplicate normalized phone numbers mean two
   customer records for one person; merge them before they diverge further.

3. Create the entry `MembershipPlan` (default name `Bronze`, `isActive: true`).
   Without it capture still works, but no membership is granted and the log
   carries a warning.

## Router configuration

Redirect unauthenticated clients to:

```
http://<frontend-host>:3001/portal/?mac=<client-mac>&ap=<ap-mac>&ssid=<ssid>&authorizeUrl=<router-auth-endpoint>&url=<original-destination>
```

Every parameter is optional — the page degrades rather than failing. Without
`mac` the device fingerprint falls back to a UA+IP hash, which is weaker and
will recognise returning guests less reliably. Without `authorizeUrl` the page
shows a success screen but cannot actually open the walled garden.

**The router must not grant access on the redirect alone.** A guest can edit a
URL. The router verifies the grant server-side first:

```
POST /api/portal/authorize
{ "sessionId": "...", "signature": "..." }

200 { "authorized": true, "macAddress": "...", "expiresAt": "...", "grantMinutes": 1440 }
403 { "authorized": false, "error": "Invalid signature." }
410 { "authorized": false, "error": "Grant expired." }
```

The signature is `HMAC-SHA256(PORTAL_GRANT_SECRET, "sessionId|mac|expiryMillis")`.
Tampering with the expiry, the MAC or the session id invalidates it.

## Walled garden allowlist

Before authorization the router must permit only:

- the frontend host on :3001 (the portal page)
- the backend host on :4000 (`/api/portal/*` only)
- DNS

Everything else stays blocked. The portal page makes no external requests at
all — no CDN, no webfonts, no analytics — so nothing else needs opening. There
is a test asserting this (`walled-garden invariant`); if it ever fails, the
page will hang for guests rather than degrade.

## Design notes

**Why static HTML and not a Next.js route.** Apple's Captive Network Assistant
and the Android captive browser are stripped-down webviews: no service workers,
unreliable storage, and a poor record with framework hydration. The App Router
would also force the site's Navbar, Footer and Apollo provider onto a page that
must stay minimal and load with no internet.

**Nothing blocks network access.** Membership provisioning, referral attachment
and consent writes are all best-effort. A guest who hits a backend failure still
gets online; we lose the capture, not their evening.

**Consent is per-purpose.** DPDP Act 2023 requires consent to be specific and
freely given, so `marketing` and `whatsapp_community` are unchecked by default
and declining them cannot cost the guest access. Only `network_terms` gates
connection. `PORTAL_POLICY_VERSION` is stamped on every record so an old consent
stays auditable after the wording changes.

**Idempotency.** The page attaches a `submissionKey` per form fill and replays it
verbatim from its offline queue. The unique sparse index on `PortalSession`
makes a replay a no-op rather than a duplicate signup.

## Metrics this enables

`PortalSession` rows with `customer: null` are the capture-rate denominator —
devices that connected and bounced. `captureType` separates new signups from
recognised returning devices, and `Customer.acquisitionSource: 'wifi_portal'`
identifies the cohort for direct-rebooking analysis against OTA-only guests.
