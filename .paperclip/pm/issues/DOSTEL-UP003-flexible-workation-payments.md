# DOSTEL-UP003: Implement Flexible Workation Payment Model

**Author:** Competitive Analyst · **Date:** Jul 31, 2026  
**Labels:** USP-Ready, Payments, Workation  
**Priority:** P2 (Market Gap)  
**Status:** Proposed  

---

## What

Create 25% UPI hold + balance reminders workflow that differentiates from Hosteller's full upfront payment requirement while maintaining business reliability.

## Why This is a USP Win

**Competitive Analysis:**
- Hosteller workations require **full upfront payment** (7-28 nights, 15% discount)
- Cloudbeds supports scheduled deposits but not consumer-facing partial payment
- Dostel can offer middle ground: 25% hold upfront + balance reminders
- Evidence: Hosteller workations [details](https://www.thehosteller.com/workations/) show full payment requirement

## Implementation Steps

1. **Payment Schema Changes** (Builder):
   - Add `PaymentPlan` type with fields: total_amount, deposit_amount (25%), balance_due_date, status
   - Update booking creation to support partial holds
   - Integrate with UPI payment gateway for deposits

2. **Balance Reminder Workflow** (Builder + Ops):
   - Automated reminders: 3 days before, 1 day before, due date
   - Email + SMS notifications via existing communication system
   - Manual follow-up for overdue balances > 50%

3. **Booking Flow Integration** (PM + Builder):
   - Clear messaging: "25% hold today, balance due 3 days before check-in"
   - Show in booking confirmation and mobile app
   - Staff dashboard: pending balances with payment status

## Dependencies

- [DOS-63] Payment amount field - payment schema completion
- [DOS-65] Membership plans + Dostellers schema - credit integration for workation discounts

## Related CMO Messaging

- **Headline:** "Workation Flexibility: Pay 25% Now, Balance Later"
- **Subhead:** "Get your hill-stay workation started with just a quarter deposit"
- **Visual:** Payment timeline showing 25% → reminders → balance

## Acceptance Criteria

- [ ] Payment schema updated for 25% holds with balance tracking
- [ ] Balance reminder workflow implemented (3 automated reminders)
- [ ] First workation booking completed with flexible payment model
- [ ] Staff dashboard shows all pending balances with payment status
- [ ] Reconciliation reports include contribution-aware guest folio (H × H)

## Impact

**Impact: High** (Differentiates from Hosteller's rigid policy, addresses remote worker pain points)  
**Effort: Medium** (Payment integration + workflow automation)

Evidence: Remote workers prefer flexible cash flow; full upfront payment is a conversion blocker for many.
