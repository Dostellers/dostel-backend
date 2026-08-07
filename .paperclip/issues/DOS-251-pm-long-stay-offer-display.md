# DOS-251: Long-Stay Offer Display (P0)
**Type:** Full-stack | **Priority:** P0 | **Status:** todo
**Files:**
- `apps/frontend/components/booking/LongStayOffer.tsx`
- `apps/backend/src/pricing/rules.ts`
- `apps/backend/src/booking/resolvers.ts`

## Acceptance Criteria
- [ ] Show eligible long-stay offers during booking flow when eligibility criteria met
- [ ] Offer types: free event access, activity calendar preview, welcome intro session
- [ ] Link to pricing rule service for dynamic offer updates
- [ ] Frontend: display offer badge + "Unlock community access" CTA on booking summary
- [ ] Backend: `pricing.getLongStayOffers(bookingId)` returns applicable offers
- [ ] No discounts or free nights in pilot — only community access perks

## Dependencies
- DOS-250 (Eligibility Engine)
- Pricing rule service integration

## Notes
Offers are community access benefits, not monetary discounts. Pilot phase only.