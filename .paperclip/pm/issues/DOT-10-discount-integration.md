# DOT-10: Integrate 10% Dosteller Discount into Booking Widget

**Priority**: P1  
**Owner**: Builder  
**Requestor**: Product Manager  

## Why  
- The 10% discount is validated as competitive with Zostel's pricing.  
- Must be applied automatically when a logged-in Dosteller uses the booking widget.  

## Files to Modify  
- `apps/frontend/components/BookingWidget.tsx` – Add tiered pricing logic for Dostellers  
- `apps/backend/src/resolvers/booking.resolvers.ts` – Add discount calculation for `roomAvailability` query results  

## Acceptance Criteria  
- [ ] When a logged-in Dosteller views room prices, the displayed rates reflect a **10% discount**.  
- [ ] For non-Dostellers, full base price is shown.  
- [ ] Pricing shown in the widget matches the values calculated in `Pricing-Rules-Engine-Final-Brief.md`.  
- [ ] The widget's "Fax your Days Today!" message remains unchanged (brand voice).  

## Dependencies  
- **DOS-86** (membership schema) must be shipped first to determine `isDosteller` status.  
- **DOT-1** (room availability query) must return price data for calculation.