# DO-I907: Referral Mechanisms & Tracking

**Summary**: End-to-end referral flow with tracking, payout, fraud prevention, and engagement limits.

**Priority**: P1
**Owner**: Product / Builder

**Description**: Full referral engine for the Dostellers program:
- Generate unique referral links on signup (`/signup?ref=CODE`)
- Store `customer.referredBy` and `customer.referralCode` at first booking stage
- Track referrals: increment `customer.referralCount` and `customer.monthlyReferralCount` only when referred friend completes first booking (tracked via completed booking event)
- Rewards: Referrer gets 500 points after referee's first stay; referee gets 10% off first booking + Bronze→Silver auto-upgrade if Bronze tier
- Fraud detection: flag same-IP/device patterns in admin console for manual review
- Enforcement: maximum 10 referrals per monthly per member

**Acceptance Criteria**:
1. Referral link generation intact with unique codes
2. Database updates storing referral relationships
3. Triggered points payout on first booking completion
4. Admin panel UI to view/topup referral stats (separate future feature)
5. Monthly reset logic for referral count

**Dependencies**: Booking completion webhook, points system schema, Razorpay integration, basic fraud flag in admin panel

**Evidence**: Requirements extracted from `.paperclip/marketing/dostellers/dostellers-program-iteration-v3.md` issue 5 and prior issue packs.