# DOST-92: Dostellers Referral Engine MVP

**Priority**: P1  
**Owner**: Builder  
**Requestor**: Product Manager (Community Growth)  

## Problem  
Current Dostellers program has no referral mechanism. Competitor Zostel uses "Zo" currency and referral rewards to drive organic growth. Dostel needs a lightweight referral engine to convert long-stay guests into advocates.

## Why This Matters  
1. **Acquisition Channel**: Referrals from existing Dostellers reduce CAC  
2. **Community Growth**: "Bring a friend, stay together" aligns with brand ethos  
3. **Engagement**: Referral rewards create ongoing engagement with program  

## Scope (MVP - No Payment Gateway Required)  

### Phase 1: Referral Link Generation (Frontend + Backend)  
- [ ] Generate unique referral code on Dosteller signup (`referralCode` = first 3 letters of name + 4-digit random)  
- [ ] Store in `customer.referralCode` and `customer.referredBy` (nullable)  
- [ ] Display referral link in Dosteller dashboard (`/dashboard/referrals`)  

### Phase 2: Tracking & Rewards (Backend)  
- [ ] On booking completion event: check `referredBy` field  
- [ ] If referee is Dosteller:  
  - Referee gets 10% off first booking (auto-applied)  
  - Referrer gets 500 points (increment `points` field)  
  - Increment `referralCount` and `monthlyReferralCount` for referrer  
- [ ] Auto-upgrade referee from Bronze → Silver if first stay ≥14 nights  

### Phase 3: Fraud Prevention (Backend)  
- [ ] Flag same IP/device for referrer + referee in admin console (manual review)  
- [ ] Enforce max 10 referrals/month per Dosteller  
- [ ] Log all referral events for audit  

## Files  
- `apps/backend/src/services/referral.service.ts` (new)  
- `apps/backend/src/resolvers/referral.resolvers.ts` (new)  
- `apps/backend/src/schema/referral.types.ts` (new)  
- `apps/frontend/app/dashboard/referrals/page.tsx` (new)  

## Acceptance Criteria  
- [ ] Unique referral code generated on Dosteller signup  
- [ ] Referee gets 10% off first booking automatically  
- [ ] Referrer receives 500 points on referee's first completed stay  
- [ ] Monthly referral counter resets automatically  
- [ ] Admin panel shows flagged referrals (same IP/device)  
- [ ] No payment gateway integration required for MVP  

## Dependencies  
- **DOS-86** (membership schema) must include `referralCode`, `referredBy`, `points`, `monthlyReferralCount`  
- **DOS-85** (room availability) for booking completion event trigger  
- **DOT-5** (Dostellers landing page) for referral CTA  

## Sources  
- `.paperclip/pm/issues/DO-I907-referral-tracker.md` (original requirements)  
- `.paperclip/marketing/dostellers/dostellers-program-iteration-v3.md` (issue 5)  
- Zostel referral model: zostel.com (creator program, Zo currency)