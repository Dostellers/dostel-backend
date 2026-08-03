# Dostel Referral Program – Technical Requirements Brief

## Goal
Build a lightweight, data‑driven referral engine that leverages the Dosteller community and eco‑impact narrative to grow direct bookings.

## Referral URL Generation
- Pattern: `https://65.109.113.80:3001/referral?code={userCode}` (user ID hash)
- Backend: GraphQL mutation `createReferralLink(userId) → code`

## Link Tracking
- Capture `code` on landing page; store in DB as foreign key to `userId`
- On first checkout using the link, increment `referralsCount` for the referrer
- Table: `referral_links(referral_id, user_id, code, created_at)`

## Reward Logic (Tiered)
- 2 referrals → ₹10 coupon
- 5 referrals → ₹50 coupon + 200 Dosteller points
- 10 referrals → free guided trek + 1‑week priority activity access
- Backend: GraphQL `applyReferral(referral_id) → reward`

## Points & Wallet
- 1 Dosteller point = ₹1 value
- Backend mutation: `addPoints(userId, amount)`

## Notification
- Email / push on:
  - Referral link shared
  - Referral conversion
  - Reward unlocked
- Integrate with SendGrid + Shopify Push API

## UI Component
- Dashboard widget titled “Refer a Friend”
- Shows personal link, referral count, and reward progress
- Frontend React component: `client/src/referral/ReferralWidget.tsx`

## Analytics
- Track in GA4 & internal dashboard: referral traffic, conversion rate, average spend per referral
- DataLayer push on event `referral_conversion`

## Security
- Referral `code` expires after 30 days if unused
- CSRF protection on booking endpoint
- Backend expiration routine + middleware

## Dependencies
- DOS‑91 Dosteller Dashboard MVP (user profile hub)
- DOS‑95 Sustainability Tracker (eco‑impact badge rewards)
- Backend schema updates for tables: `Referral`, `Points`, `Coupon`

## Acceptance Criteria
- On signup, user receives a unique pre‑generated link with their code
- Visiting page with `?code=` shows referral banner; on checkout, system associates guest with referrer
- After 2, 5, 10 successful referrals, corresponding rewards appear in dashboard
- All redemption events logged in analytics
- No duplicate activations per referral code

## Metrics & Goals
- 20% of bookings via referral code within 3 months
- Average revenue per referral: ₹415 (vs. ₹200 industry baseline)
- 60% of eligible users generate ≥1 referral within 6 months

---
*Author: Dostel CMO | Based on competitive research and community‑growth strategy*