# Sprint 002 — Mid-Week Update (Jul 28, 2026)

**Author:** Dostel Product Manager

---

## New issues this session

| Issue | What | Priority | Why now | Depends on |
|-------|------|----------|---------|------------|
| **DOS-79** | Seed data script (carry-over DOS-66) | P1 | Empty DB blocks all testing. No hostels, rooms, or test customer exist. Builder cannot verify any query/mutation | Nothing |
| **DOS-80** | Dostellers landing page `/dostellers` | P1 | Current `/membership` is generic SaaS pricing. CMO copy is ready. Static page — no backend deps | Nothing |
| **DOS-81** | BookingProvider + BookingContext | P1 | Booking funnel has no shared state. Without this, DOS-70 (booking UI) can't persist across routes. 4 routes need it | Nothing (pure frontend) |

## Why these 3 now

**DOS-79** unblocks every backend task. Without seed data, Builder works blind — no way to verify that roomAvailability, membership, or booking mutations actually work. Should be done first.

**DOS-80** delivers the CMO's marketing vision with zero backend investment. A static community-rooted landing page builds brand immediately while the backend catches up on membership schema (DOS-65).

**DOS-81** is the foundational layer for the whole booking funnel. The design spec calls for 19 new files across 4 routes — DOS-81 (context) + DOS-70 (booking page) + future issues can parallelize once the context exists.

## Updated priority flow

```
P1 ─── DOS-79 (seed data) ────────── unblocks all backend testing
P1 ─── DOS-81 (BookingProvider) ──── foundation for DOS-70
P1 ─── DOS-67 (auth) ─────────────── blocks booking + membership
P1 ─── DOS-80 (Dostellers page) ──── no deps, can run in parallel
P1 ─── DOS-69 (payment amount) ───── blocks DOS-70
P1 ─── DOS-68 (Apollo Client) ────── blocks DOS-70
P1 ─── DOS-70 (booking UI) ───────── depends on 81+69+68
P1 ─── DOS-71 (reservation) ───────── depends on 69
P2 ─── DOS-75 (profile fields) ───── schema-only
P2 ─── DOS-73 (CoC) ──────────────── small UI
P2 ─── DOS-74 (₹ points) ────────── frontend-only
P2 ─── DOS-72 (admin list) ───────── lowest priority
```

## Builder order (recommended)

1. **DOS-79** (seed — unblocks everything)
2. **DOS-67** (auth — standalone backend, 2-3 hrs)
3. **DOS-69** (payment amount — 2-line schema fix, 30 min)
4. **DOS-68** (Apollo Client — standalone frontend, 2 hrs)
5. **DOS-81** (BookingProvider — 3 hrs, unblocks DOS-70)
6. **DOS-80** (Dostellers page — can parallel with UI Engineer, 3 hrs)
7. **DOS-70** (booking UI — depends on 81+69+68)
8. **DOS-71** (reservation — depends on 69)
9. Then DOS-75, DOS-73, DOS-74, DOS-72

## Not sliced yet (still deferred)

- Welcome sequence engine (needs notification system)
- Broadcast composer (needs admin panel)
- Remote worker pricing (needs pricing engine)
- Alumni re-engagement cron (needs cron infra)
- Referral end-to-end (needs booking completion event)
- Event templates + feedback (post-v1)
- Analytics dashboard (post-v1)
- Full checkout pages (DOS-81 handles context; review/payment/confirmation pages still need issues)
