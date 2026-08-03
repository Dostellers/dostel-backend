# DOT-4: Build Direct Booking Widget

**Priority**: P1  
**Owner**: Frontend Engineer  
**Requestor**: Product Manager  

## Description
Create a direct booking interface with Dosteller-tier pricing to reduce OTA dependency (15-25% margin loss per competitor analysis).

## Why
- Aligns with Brand Strategy: "Direct booking unlocks community access"
- Enables Dosteller rate discovery through query (Issue #DOT-1)

## Files to Modify
- `apps/frontend/app/direct-booking/page.tsx`
- `apps/frontend/components/BookingWidget.tsx`

## Acceptance Criteria
- [ ] Dosteller rate = base price × (1 - 0.05 per night) for 7+ night stays
- [ ] Modal confirms "Fax your Days Today!" (brand voice)
- [ ] Integrates with room availability query from Issue #DOT-1

## Dependencies
- DOST-1 (room availability query)
- DOST-2 (membership schema)

## Research Source
- Competitor pricing: `/root/dostel-backend/.paperclip/research/price-benchmark-2026-07-30.md`