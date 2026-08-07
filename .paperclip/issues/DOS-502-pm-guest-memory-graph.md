# DOS-502: Guest memory graph — staff voice capture → structured guest facts

## Priority: P0
## Type: Backend / Full-stack
## Parent: DOS-500

### Source
- Harlow (https://www.tryharlow.com/) — staff badge: touch, speak, send; AI routes the note with context attached
- `.paperclip/pm/hotel-tech-teardown-2026-08-07.md`

### Problem
Harlow's actual innovation is not the wearable — it is that a staff observation becomes structured data in seconds instead of dying in someone's head. At Dostel, everything we know about a returning guest lives in the memory of whoever was on shift. Staff turnover erases it. The whole Dostellers promise is *being known*, and we have no system that knows anything.

### Opportunity
We do not need the badge. The Vattakanal team already lives in WhatsApp. A voice note to a bot number is the same interaction Harlow sells hardware for, at zero hardware cost.

> "Priya doesn't eat dairy."
> "Marco's the one who fixed the guitar."
> "Room 4 couple are here for their anniversary on the 12th."

Captured in five seconds, surfaced at the next check-in and in the pre-arrival message.

### Acceptance Criteria
- [ ] WhatsApp Business API webhook accepts voice notes and text from an allowlist of staff numbers
- [ ] Audio transcribed, then extracted into structured facts by an LLM (Claude) — free text in, typed records out
- [ ] `guestFacts[]` subdocument on `Customer`: `{ text, category, capturedBy, capturedAt, source, confidence, expiresAt, visibility }`
- [ ] Categories at minimum: `dietary`, `accessibility`, `interest`, `relationship`, `logistics`, `caution`
- [ ] Guest matching: resolve the subject against customers with an active or imminent booking; when ambiguous, bot replies asking staff to disambiguate rather than guessing
- [ ] Low-confidence extractions are queued for review in admin, not written silently
- [ ] Facts surface on the admin check-in view and in the pre-arrival message composer
- [ ] Guest can view and delete their own facts from the Dosteller dashboard
- [ ] `caution` facts are staff-only and never surfaced to the guest-facing dashboard or any automated message
- [ ] Facts carry a default TTL; expired facts are excluded from surfacing (stale preferences are worse than none)

### Technical Notes
- Model: extend `apps/backend/src/models/customer.js`; resolver work in `apps/backend/src/resolvers/customerResolver.js`
- New `apps/backend/src/services/guestMemoryService.js` — transcription, extraction, matching, confidence scoring
- Keep extraction prompt and category enum versioned; store `extractorVersion` on each fact so a prompt change is auditable
- Reuse the WhatsApp integration surface being stood up for DOS-291 (WhatsApp opt-in flow) rather than adding a second one

### Dependencies
- DOS-291 (WhatsApp opt-in flow) — shared WhatsApp Business API surface
- DOS-250 (consent engine) — a guest must have consented before facts about them are stored
- DOS-501 — portal capture supplies the identity these facts attach to

### Compliance & ethics
- DPDP Act 2023 rights: access and erasure must both work from the guest dashboard.
- Explicit rule: this is a hospitality memory, not a surveillance log. `caution` entries require a named `capturedBy`, expire by default, and are reviewable — no anonymous notes about guests.

### Metrics
- Guest facts captured per occupied bed-night: > 0.3
- Returning guests with ≥1 surfaced fact at check-in: > 80%
- Extraction precision on a manually-labelled sample: > 90%

### Status
todo
