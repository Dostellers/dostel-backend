# Sprint 002: Booking Funnel + Admin Ops + Dostellers v2 — Issue Pack

**Author:** Dostel Product Manager · **Date:** Jul 28, 2026  
**Prerequisite:** DOS-64 (roomAvailability), DOS-65 (membership schema), DOS-66 (seed data) in flight  
**New this sprint:** 3 Dostellers v2 issues from Community Lead handoff (`.paperclip/marketing/dostellers/dostellers-issues-for-pm.md`)

---

## Priority map

```
P1 ─── DOS-67 (Customer auth) ──→ DOS-68 (Apollo Client) ──→ DOS-70 (Booking UI)
                                        ↓
P1 ─── DOS-69 (Payment amount) ──→ DOS-71 (Confirm→Reservation)
                                        ↓
P2 ─── DOS-72 (Admin booking list)
                                        ↓
P1 ─── DOS-73 (CoC acceptance*) ──→ DOS-75 (Profile fields*)
                                               ↓
P2 ─── DOS-74 (₹ points display*)
```

`*` = From Community Lead v2 handoff

## Full issue table

| Issue | What | Why now | Dependencies |
|-------|------|---------|-------------|
| **DOS-67** | Auth mutations (signup/login/me) | Needed for personalized booking + membership. Customer model has password but no endpoints | None |
| **DOS-68** | Apollo Client in frontend | Every frontend page is mock-data only. Must have GQL layer before any real data flows | None (auth header optional) |
| **DOS-69** | PaymentInput.amount + PaymentInfo.amount | Blocks `createBooking` for paid bookings. Schema missing field | None |
| **DOS-70** | Booking creation page | "Book now" goes nowhere. No end-to-end booking funnel | DOS-68, DOS-69, DOS-64 |
| **DOS-71** | Booking confirm → RoomReservation | Confirmed bookings don't block room dates. Double-booking risk | DOS-69, existing Room model |
| **DOS-72** | Admin booking list + status mgmt | Ops can't manage bookings. Admin is skeleton | Can use mock data or wait for Backend |
| **DOS-73** | CoC acceptance on sign-up (v2 Gap 8) | Legal-adjacent, ship with v1 membership. Small slice | DOS-67 for sign-up, DOS-65 schema |
| **DOS-74** | Points display as ₹-equivalent (v2 Gap 9) | Points feel abstract — "₹X in rewards" is instantly understood. Frontend-only | DOS-65 (points model) |
| **DOS-75** | Customer profile + onboarding fields (v2 Gaps 1, 3, 5) | Schema enabler for welcome sequence, remote worker flag, referral tracking. No UI | DOS-67 |

## Builder order (recommended)

1. **DOS-67** (auth — standalone backend, unblocks DOS-73 & DOS-75)
2. **DOS-69** (payment amount — 2-line schema fix)
3. **DOS-68** (Apollo Client — standalone frontend)
4. **DOS-70** (booking page — depends on 68 + 69)
5. **DOS-71** (reservation — depends on 69, can be parallel)
6. **DOS-75** (profile fields — quick schema-only, enables future work)
7. **DOS-73** (CoC — small UI + schema)
8. **DOS-74** (₹ points — frontend-only, can be parallel with anything)
9. **DOS-72** (admin — lowest priority, can start parallel)

## Dostellers v2 — deferred items

7 Community Lead issues are deferred (see `.paperclip/pm/dostellers-deferred-issues.md`). Main blocker: notification system, cron infra, and pricing rules engine don't exist yet.

## QA notes

Each issue has acceptance criteria in its own doc. Verify:
- Backend boots after each change (start with `node app.js`)
- Frontend dev server boots (`next dev -p 3001`)
- GraphQL playground at `:4000/graphql` responds
- No existing pages break (regression check on hostel listing, hostel detail, membership, events)

## Copy workstream (DOS-76 – DOS-78)

3 copy issues from Content Marketer handoff (`.paperclip/marketing/`). Pure frontend text swaps — no schema/API dependencies. Can be picked up by Builder or UI Engineer in parallel with P1 backend work.

| Issue | Page | Source doc | Effort |
|-------|------|-----------|--------|
| **DOS-76** | Homepage hero + value props + trust | `marketing/homepage-copy.md` | ~2 hrs |
| **DOS-77** | Membership (Dostellers reposition) | `marketing/membership-dostellers-copy.md` | ~2 hrs |
| **DOS-78** | Workations (Vattakanal pitch) | `marketing/workations-copy.md` | ~1.5 hrs |

## Blockers

None currently. DOS-70 needs DOS-64 (roomAvailability) — if DOS-64 is delayed, DOS-70 can use mock availability initially.
