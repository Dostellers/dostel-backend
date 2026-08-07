# Finalized Product Requirements for Referral Launch

## Overview
This document outlines the finalized requirements for the Dosteller Referral Program launch, incorporating dependencies identified in current Product issue tickets.

## Core Requirements (From DOS-401 & Referral-Program-Brief.md)

### 1. Referral Link Generation
- Unique referral link/code per Dosteller: `https://65.109.113.80:3001/referral?code={userCode}`
- Backend GraphQL mutation: `createReferralLink(userId) → code`
- Link stored in DB as foreign key to `userId`

### 2. Link Tracking & Attribution
- Capture `code` on landing page; store in `referral_links` table
- On first completed booking using the link, increment `referralsCount` for referrer
- Table: `referral_links(referral_id, user_id, code, created_at, booked_at)`

### 3. Reward Logic (Tiered)
- 2 referrals → ₹10 coupon
- 5 referrals → ₹50 coupon + 200 Dosteller points  
- 10 referrals → free guided trek + 1‑week priority activity access
- Backend mutation: `applyReferral(referral_id) → reward`

### 4. Points & Wallet
- 1 Dosteller point = ₹1 value
- Backend mutation: `addPoints(userId, amount)`

### 5. Notification
- Email/push on: referral link shared, referral conversion, reward unlocked
- Integrate with SendGrid + Shopify Push API

### 6. UI Component
- Dashboard widget titled “Refer a Friend”
- Shows personal link, referral count, and reward progress
- Frontend React component: `client/src/referral/ReferralWidget.tsx`

## Dependency Resolution (Based on Current Product Tickets)

### DOS-250 (Eligibility & Consent Engine) - P0
- **Status**: Required dependency
- **Resolution**: Referral system should check `booking.isDostellerEligible` before awarding rewards
- **Implementation**: Only award referral rewards if referrer has Dosteller eligibility status

### DOS-252 (Staff Event Management UI) - P0
- **Status**: Potential dependency concern
- **Analysis**: Referral rewards should trigger on booking completion, not event completion
- **Resolution**: 
  - Referral reward triggers on `booking.status = 'completed'` (checkout)
  - Event attendance tracking is separate from referral system
  - No change needed to referral logic based on DOS-252

### DOS-251 (Long-Stay Offer Display) - P0
- **Status**: Independent feature
- **Resolution**: Referral system operates independently of long-stay offer display
- **Note**: Both features can coexist in booking flow

## Acceptance Criteria (Finalized)

1. [ ] On signup, user receives a unique pre-generated referral link with their code
2. [ ] Visiting page with `?code=` shows referral banner; on checkout, system associates guest with referrer
3. [ ] After 2, 5, 10 successful referrals, corresponding rewards appear in dashboard
4. [ ] All redemption events logged in analytics (referral link clicks, conversions, reward redemptions)
5. [ ] No duplicate activations per referral code
6. [ ] Referral rewards only awarded to eligible Dostellers (per DOS-250)
7. [ ] Referral reward triggers on booking completion (checkout), not event attendance

## Metrics & Goals

- 20% of bookings via referral code within 3 months
- Average revenue per referral: ₹415 (vs. ₹200 industry baseline)
- 60% of eligible users generate ≥1 referral within 6 months

## Dependencies for Launch

1. DOS-401 Referral Engine (Primary)
2. Dosteller Dashboard Widget (DOS-364) - For referral tracking display
3. Email Service (SendGrid) Integration - For automated notifications
4. DOS-250 Eligibility Engine - For Dosteller status verification
5. Legal Approval - Referral program terms & credit expiration

## Launch Coordination Notes

- Referral program can launch independently of DOS-252 (Staff Event Management UI)
- Event attendance tracking does not affect referral reward eligibility
- Focus launch efforts on DOS-401 completion and DOS-250 integration
- Visual assets (referral widget, badges) ready for implementation upon engine completion

*This document supersedes previous briefs and serves as the final Product requirement specification for the Dosteller Referral Program launch.*