# Dostellers — Deferred Issues (not yet sliced)

**Author:** Dostel PM  
**Source:** `.paperclip/marketing/dostellers/dostellers-issues-for-pm.md` (10 issues from Community Lead)  
**Date:** Jul 28, 2026

---

Of the 10 Community Lead issues, 7 are deferred. Rationale below.

| # | Issue | Priority | Why deferred | What's needed first |
|---|-------|----------|-------------|-------------------|
| 1 | Welcome Sequence Engine | P1 | Too big. Needs notification infra (WhatsApp/email), cron system, and dashboard page. The schema slice went to DOS-75 | Notification system, frontend dashboard |
| 2 | Broadcast Composer | P2 | Depends on admin panel being real (not skeleton) and notification system. Admin needs DOS-72 first | DOS-72, notification system |
| 3 | Remote Worker Profile Flag | P2 | Schema slice went to DOS-75 (profile.isRemoteWorker). Pricing rules engine doesn't exist yet | Pricing rules engine (post-v1) |
| 4 | Alumni Re-Engagement Cron | P2 | Needs notification system + cron infrastructure. Both don't exist yet | Cron infra, notification system |
| 5 | Referral End-to-End | P2 | Schema slice went to DOS-75 (referredBy). Payout trigger needs booking completion event. Fraud check is phase 2 | Booking completion event, notification system |
| 6 | Seasonal Event Templates | P3 | Events model exists but template engine is a full feature. Post-v1 | Event model is ready — can unblock if needed |
| 7 | Post-Event Feedback | P3 | Needs notification system. Slim schema — could be revived as a single-issue slice | Notification system |
| 10 | Analytics Dashboard | P3 | Needs all data sources connected. Post-v1 | Everything else |

## Revive checklist

When the following infrastructure ships, these become viable:
- **Notification system** (WhatsApp/email send capability): unblocks Issues 1, 2, 4, 5, 7
- **Cron/trigger infrastructure** (scheduler.js): unblocks Issues 1, 4
- **Admin panel real pages**: unblocks Issue 2
- **Pricing rules engine**: unblocks Issue 3
- **Booking completion event**: unblocks Issue 5
