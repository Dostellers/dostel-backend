# Direct Booking USP — Issue Pack

**Author:** Dostel Product Manager · **Date:** Jul 30, 2026

## Decision

Ship the direct-booking foundation before broader Dostellers features. The smallest useful sequence is:

1. [DOS-64](/DOS/issues/DOS-64): room availability query.
2. [DOS-69](/DOS/issues/DOS-69): payment amount field.
3. [DOS-70](/DOS/issues/DOS-70): booking creation UI.
4. [DOS-71](/DOS/issues/DOS-71): confirmed booking reserves inventory.
5. [DOS-210](/DOS/issues/DOS-210): record a 25% UPI hold and balance due.
6. [DOS-209](/DOS/issues/DOS-209): preview stay-date Dosteller activities before checkout.
7. [DOS-212](/DOS/issues/DOS-212): queue recent departed guests for honest review follow-up (parallel admin slice).

## Scope guardrails

- Manual UPI recording first; no gateway, webhook, cron, or automated reminders.
- Community preview is non-blocking and limited to existing published activity data.
- No broad chat, RSVP, recommendations, wallet, or contribution ledger in this slice.
- Membership work continues through [DOS-65](/DOS/issues/DOS-65), but must not delay the booking funnel.
- Review follow-up is manual and neutral; no messaging integration, reward, or review-gating behavior.

## QA focus

- Availability excludes confirmed overlapping reservations.
- Transparent total remains stable from review through confirmation.
- Completed payments alone reduce balance due.
- Community API failure never blocks checkout.
- Verify the guest flow at 320px and the GraphQL contract at the live target.

## Evidence

- Cloudbeds benchmarks mobile two-step checkout and deposits: https://www.cloudbeds.com/hospitality-platform/booking-engine/ and https://www.cloudbeds.com/hospitality-platform/payments/
- The Hosteller publishes full-upfront payment for workations: https://www.thehosteller.com/workations/
- Hostelworld provides the community-discovery benchmark: https://www.hostelworld.com/

Source analysis: `.paperclip/research/competitive-feature-matrix.md` and `.paperclip/research/usp-backlog.md`.