# DOT-3: Add Payment Amount Field

**Priority**: P2  
**Owner**: Builder  
**Requestor**: Product Manager  

## Description
Add `amount` field to `PaymentInput` and `PaymentInfo` types to unblock booking confirmation and enable split payments (deposit + final settlement).

## Why
- Currently blocks `createBooking` mutation
- Required for transparent total pricing (reference: `local-hostel-competitor-pricing-analysis.md`)

## Files to Modify
- `apps/backend/src/schema/payment.types.ts`
- `apps/backend/src/resolvers/payment.resolvers.ts`

## Acceptance Criteria
- [ ] `amount` field persisted in payment records
- [ ] Amount validation (must be > 0)
- [ ] Supports partial payment tracking (deposit vs. balance)

## Dependencies
- DOS-63 (payment integration)

## Notes
- Reference: Competitive analysis shows competitors display total upfront; this field enables that transparency.