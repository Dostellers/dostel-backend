# Direct Booking USP — Issue Pack (Revised)

**Author:** Dostel Product Manager · **Date:** Aug 1, 2026

## Decision
Ship the direct-booking foundation before broader Dostellers features. Updated to include remote work integration.

## Core Issue Sequence (Booking Funnel)
1. [DOS-85](/root/dostel-backend/.paperclip/pm/issues/DOS-85-room-availability.md): room availability query (P1) - Unblocks all direct booking flows  
2. [DOS-86](/root/dostel-backend/.paperclip/pm/issues/DOS-86-membership-schema.md): membership schema — Dosteller tier (P1) - Enables tier-specific discounts  
3. [DOT-4](/root/dostel-backend/.paperclip/pm/issues/DOT-4-direct-booking.md): direct booking widget with Dosteller tier pricing (P1) - Reduces OTA dependency  
4. [DOT-5](/root/dostel-backend/.paperclip/pm/issues/DOT-5-dostellers-landing.md): Dostellers landing page `/dostellers` (P1) - Community conversion hub  
5. [DOT-6](/root/dostel-backend/.paperclip/pm/issues/DOT-6-activity-signup.md): activity sign-up flow for Dostellers (P2) - Drives engagement  
6. [DOT-10](/root/dostel-backend/.paperclip/pm/issues/DOT-10-discount-integration.md): 10% Dosteller discount in booking widget (P1) - Competitive pricing  

## Supporting Tasks  
- [DOST-92](/root/dostel-backend/.paperclip/pm/issues/DOST-92-referral-engine.md): Dosteller referral engine MVP (P1) - Community growth loop  
- [DOST-1](/root/dostel-backend/.paperclip/pm/issues/DOST-1-channel-manager-sync.md): sync Vattakanal inventory to channel manager (High) - Long-stay inventory visibility  
- [DOST-7](/root/dostel-backend/.paperclip/pm/issues/DOST-7-autocomplete.md): activity search autocomplete (P2) - Boosts conversion  
- [DOST-89](/root/dostel-backend/.paperclip/pm/issues/DOST-89-corporate-group-booking.md): Corporate group booking workflow (Medium) - B2B segment  
- [DOST-93](/root/dostel-backend/.paperclip/pm/issues/DOST-93-remote-work-features.md): Remote work integration features (Medium) - Expands to remote worker segment  
- [DOST-91](/root/dostel-backend/.paperclip/pm/issues/DOST-91-ota-listing-optimization.md): Hostelworld listing optimization (Admin) - Trust & conversion  

## Scope Guardrails
- Manual UPI recording first; no gateway, webhook, cron, or automated reminders.
- Community preview is non-blocking and limited to existing published activity data.
- Membership work continues through [DOS-65](/DOS/issues/DOS-65), but must not delay the booking funnel.
- Review follow-up is manual and neutral; no messaging integration, reward, or review-gating behavior.

## QA Focus
- Availability excludes confirmed overlapping reservations.
- Transparent total remains stable from review through confirmation.
- Community API failure never blocks checkout.
- Verify the guest flow at 320px and the GraphQL contract at the live target.

## Evidence
- Cloudbeds benchmarks mobile two-step checkout and deposits: https://www.cloudbeds.com/hospitality-platform/booking-engine/ and https://www.cloudbeds.com/hospitality-platform/payments/
- The Hosteller publishes full-upfront payment for workations: https://www.thehosteller.com/workations/
- Hostelworld provides the community-discovery benchmark: https://www.hostelworld.com/
- Local pricing validation: .paperclip/research/price-benchmark-2026-07-30.md