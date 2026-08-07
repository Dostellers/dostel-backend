# Product Gap Analysis (PM — Jul 27)

Survey of `apps/backend/src/schema/` against Dostel brand + booking needs.

## Present (what works)
- `hostels`, `rooms`, `customers`, `bookings` CRUD queries + mutations
- `amenities`, `images`, `reviews`, `badges`, `coupons`, `faqs`, `blogs` — types exist
- `health` query

## Missing (blockers)

| Priority | Gap | Why |
|----------|-----|-----|
| P1 | **Room availability query** (`roomAvailability(hostelId, checkIn, checkOut) → [{ roomType, availableRooms }]`) | Without this, no booking flow works. User can't see what's free |
| P1 | **Membership / Dostellers** — `membershipPlans`, `membership`, `Dosteller` types + queries | Core brand identity. No models, no schema, no resolvers |
| P2 | **Seed data** — `scripts/seed.js` to populate hostels, rooms, amenities | Empty DB makes frontend useless even after null-bug fix |
| P2 | **PaymentInput.amount** — DOS-63 covers this | Blocks createBooking mutation |
| P2 | **PaymentInfo type** also missing `amount` field | PaymentInfo response type should expose amount |
| P3 | **Frontend booking form** — depends on availability + createBooking | Needs wireframes from Design team first |
| P3 | **Admin booking management** — list, confirm, cancel in admin UI | Depends on GraphQL mutations existing |

## Issues created this session
- [DOS-64](/DOS/issues/DOS-64) — FEATURE: Room availability query (P1, assigned Builder)
- [DOS-65](/DOS/issues/DOS-65) — FEATURE: Membership plans + Dostellers schema (P1, assigned Builder)
- [DOS-66](/DOS/issues/DOS-66) — FEATURE: Seed data script (P2, assigned Builder)

## Recommendations
1. Ship [DOS-62](/DOS/issues/DOS-62) + [DOS-63](/DOS/issues/DOS-63) first (null fix + payment amount)
2. Build [DOS-64](/DOS/issues/DOS-64) roomAvailability next — unlocks booking funnel
3. Build [DOS-65](/DOS/issues/DOS-65) membershipPlans + [DOS-66](/DOS/issues/DOS-66) seed in parallel
4. Then frontend booking form (Design dep — needs CMO/research copy brief first)
