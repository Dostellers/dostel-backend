# DOS-96: Referral Program & Rewards Engine

**Priority**: High
**Source**: UGC/Referral Research (competitive analysis of The Hosteller membership tiers, Zostel Zo currency)
**Owner**: Product
**Requestor**: CMO
**Date**: July 2026

## Problem
Dostel's Dosteller program lacks a digital referral mechanism and tiered rewards, leaving organic growth untapped while competitors (The Hosteller: 5-12.5% booking discounts, wallet points, affiliate vouchers) actively incentivize community-driven acquisition.

## Requirements

### 1. Referral Link Generation
- Unique URL per user: `https://65.109.113.80:3001/referral?code={userCode}`
- GraphQL mutation `createReferralLink(userId) → code`
- Code stored in `referral_links(referral_id, user_id, code, created_at)` table
- Code expires after 30 days if unused

### 2. Tracking & Attribution
- Capture `code` on landing page
- On first checkout using the link, increment `referralsCount` for referrer
- Prevent duplicate activations per code
- Track conversion events in GA4 (`referral_conversion` DataLayer push)

### 3. Tiered Rewards
- 2 referrals → ₹10 coupon
- 5 referrals → ₹50 coupon + 200 Dosteller points
- 10 referrals → free guided trek + 1-week priority activity access
- GraphQL mutation `applyReferral(referralId) → reward`
- Points: 1 Dosteller point = ₹1 wallet value

### 4. Dashboard Integration
- Widget titled "Refer a Friend" on `/dosteller`
- Shows personal link, referral count, reward progress
- Rewards appear in dashboard upon unlock

### 5. Notifications
- Email/push on: link shared, referral conversion, reward unlocked
- Integrate with SendGrid + Shopify Push API

## Acceptance Criteria
- On signup, user receives unique pre-generated referral link
- Visiting page with `?code=` shows referral banner; checkout associates guest with referrer
- After 2/5/10 successful referrals, corresponding rewards appear in dashboard
- All redemption events logged in analytics
- No duplicate activations per referral code
- Referral code expires after 30 days of inactivity

## Dependencies
- Requires: DOS-91 (Dosteller Dashboard MVP) for widget integration
- Requires: DOS-95 (Sustainability Tracker) for eco-impact badge rewards
- Requires: Backend schema updates for `Referral`, `Points`, `Coupon` tables
- Requires: SendGrid + Shopify Push API configuration

## Metrics
- 20% of bookings via referral code within 3 months
- Average revenue per referral: ₹415 (vs. ₹200 industry baseline)
- 60% of eligible users generate ≥1 referral within 6 months

## Sources
- The Hosteller membership page: https://www.thehosteller.com/membership/ (accessed Jul 2026)
- Competitive analysis: .paperclip/research/dostel-competitor-research.md
- UGC/Referral research: .paperclip/marketing/Referral-Program-Brief.md

---
*Author: Dostel CMO*