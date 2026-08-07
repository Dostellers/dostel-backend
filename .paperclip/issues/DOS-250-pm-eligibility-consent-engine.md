# DOS-250: Eligibility & Consent Engine (P0)
**Type:** Backend | **Priority:** P0 | **Status:** todo
**Files:**
- `apps/backend/src/membership/schema.ts`
- `apps/backend/src/membership/resolvers.ts`
- `apps/backend/src/membership/middleware.ts`

## Acceptance Criteria
- [ ] Detect ≥7 consecutive nights OR ≥10 cumulative nights for Dosteller eligibility
- [ ] Store eligibility flag on booking record (`booking.isDostellerEligible`)
- [ ] Capture 3 separate consents: community code acceptance, WhatsApp group join, marketing communications
- [ ] Consents linked to booking via `booking.consents` object
- [ ] GDPR-compliant data handling with audit trail
- [ ] GraphQL field `booking.dostellerEligibility` returns eligibility status + consents

## Dependencies
- DOS-86 (Membership Schema - existing)
- DOS-94 (Eligibility Engine - existing)

## Notes
Community-first approach: no points, badges, or automatic incentives. Pure opt-in membership.