# DOS-501: WiFi captive-portal capture → Dosteller signup

## Priority: P0
## Type: Full-stack
## Parent: DOS-500

### Source
- StayLoop ("Capture. Rebook. Grow.") — BHC vendor cohort
- Capture→rebook loop mechanics: https://stayfi.com/vrm-insider/2025/07/11/how-to-build-a-guest-loyalty-funnel-using-wifi-data-operational-automation/
- `.paperclip/pm/hotel-tech-teardown-2026-08-07.md`

### Problem
Every guest who books through Hostelworld or Booking.com arrives anonymous. We pay the commission and get no relationship — no email, no phone, no consent, no way to bring them back direct. The referral engine, reminder service, coupons and membership models all exist in the backend and have nothing to operate on for the majority of arrivals.

### Opportunity
The captive portal is the cheapest OTA-to-direct conversion point that exists: every guest connects to WiFi within ~90 seconds of arriving, before they have unpacked. A branded portal that signs them into Dostellers (Bronze, free) in exchange for network access converts anonymous OTA demand into an owned, re-marketable membership base.

This feeds DOS-392 (direct booking widget) the demand it currently lacks.

### Acceptance Criteria
- [ ] Captive-portal landing page served from `apps/frontend` (walled-garden safe: no external CDN/font/script dependencies — the guest has no internet yet)
- [ ] Property router (UniFi/Mikrotik/TP-Link) redirects unauthenticated clients to the portal and grants access on callback
- [ ] Portal collects: name, phone (or email), country, and stay purpose (backpacker / remote worker / group)
- [ ] Submission creates or matches a `Customer` and provisions a Bronze `MembershipSubscription`
- [ ] `customer.acquisitionSource` recorded as `wifi_portal`, with `capturedAt` and device fingerprint for dedup
- [ ] Returning guests are recognised by phone/MAC and skip straight to network access
- [ ] Three separate consents captured and stored per DOS-250's consent engine: (a) network terms, (b) marketing contact, (c) WhatsApp community — marketing must be independently declinable without losing WiFi
- [ ] Guest can withdraw consent later from the Dosteller dashboard
- [ ] Rate limiting + abuse protection on the public portal endpoint

### Technical Notes
- New unauthenticated route group (`/portal/*`) — must NOT sit behind the existing auth middleware
- Backend: `apps/backend/src/models/customer.js` gains `acquisitionSource`, `consents[]`, `deviceFingerprints[]`
- Reuse `apps/backend/src/services/referralService.js` — a portal signup should still honour a referral code if present
- Router integration: prefer external RADIUS-less "external portal" mode (UniFi guest portal / Mikrotik hotspot) with an HMAC-signed authorize callback so the router never trusts a raw client redirect
- Offline-first: portal must render and queue submissions if the backend is unreachable (mountain connectivity is unreliable) — flush on reconnect

### Dependencies
- DOS-250 (eligibility & consent engine) — consent primitives
- Property network hardware audit — model and firmware of the current router at Vattakanal is unconfirmed

### Compliance
India DPDP Act 2023: consent must be free, specific, informed and unambiguous, with an equally easy withdrawal path. Bundling marketing consent into network access is not compliant — keep the checkboxes separate.

### Metrics
- Portal capture rate: > 70% of connecting devices complete signup
- OTA arrivals converted to Dosteller identity: > 60%
- Direct rebooking rate among portal-captured members vs. OTA-only guests: +15pp within two seasons

### Status
todo
