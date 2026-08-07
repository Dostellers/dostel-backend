# DOS-690: Community Event Ticketing (P2)
**Type:** Feature | **Priority:** P2 | **Status:** todo
**Files:**
- `apps/backend/src/events/schema.ts`
- `apps/backend/src/events/resolvers.ts`
- `apps/backend/src/bookings/resolvers.ts` (extend createBooking to add event add-ons)
- `apps/frontend/src/components/EventBooking.tsx` (new)

## Acceptance Criteria
- [ ] Define `Event` type: title, description, schedule, capacity, price, hostelId, Dosteller-hosted flag.
- [ ] Create CRUD mutations for events (admin only).
- [ ] Extend booking flow to allow adding one or more events to a stay (cart-like).
- [ ] Show events on hostel detail page and in post-booking confirmation.
- [ ] Sync event purchases to guest folio and revenue share with Dosteller hosts (50% to host, 50% to Dostel platform).
- [ ] Add GraphQL query `eventsByHostel(hostelId, dateFrom, dateTo) → [Event!]!`.
- [ ] Add Dosteller verification flag for event hosts (reputation-based).
- [ ] Allow guests to RSVP/favorite events without booking (for interest tracking).
- [ ] Email/WhatsApp reminders 24h before event start.
- [ ] Analytics: track event attachment rate to bookings.

## Dependencies
- DOS-64 (Room availability query) - for inventory validation.
- DOS-65 (Membership / Dostellers schema) - for Dosteller host verification and revenue sharing.
- DOS-504 (WhatsApp concierge agent) - for event reminders.

## Notes
- Monetizes social capital, increases dwell time, reduces OTA dependency.
- Competitors: The Hosteller has events page; Zostel offers Zo Trips; Cloudbeds has generic resource center but no integrated event monetization.
- USP framing: "#MyDostel itinerary add-on" — book stay + event in one flow with community voting for future events and revenue sharing for Dosteller hosts.
- Ship order: After staying + check-in features stable (P3).