# DOS-253: Guest RSVP & Privacy Flow (P0)
**Type:** Full-stack | **Priority:** P0 | **Status:** todo
**Files:**
- `apps/frontend/components/events/RSVPButton.tsx`
- `apps/frontend/components/events/EventCard.tsx`
- `apps/backend/src/events/rsvp.ts`
- `apps/backend/src/events/resolvers.ts`

## Acceptance Criteria
- [ ] Guest RSVP without exposing personal contacts (name + booking reference only)
- [ ] Store RSVP anonymously: `eventId`, `bookingRef`, `status` (going/maybe/declined), `createdAt`
- [ ] Allow RSVP cancellation up to 2 hours before event
- [ ] Generate attendance reports for staff (aggregated, no PII)
- [ ] Automated reminders: 24h before via email, 2h before via WhatsApp (if consented)
- [ ] RSVP-to-attendance tracking for analytics
- [ ] Privacy guardrails: no contact sharing without explicit consent per event

## Dependencies
- DOS-250 (Consent capture - WhatsApp opt-in)
- DOS-373 (Event Ticketing Framework)
- WhatsApp automation integration

## Notes
Consent-driven communication. No PII in RSVP data. Staff sees aggregated counts only.