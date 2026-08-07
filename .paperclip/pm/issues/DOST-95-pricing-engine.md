# DOST-95: Pricing Engine for Long-Stay & Dosteller Discounts

**Priority**: P1  
**Owner**: Builder (Backend)  
**Requestor**: Product Manager (Revenue Optimization)  

## Why  
Static OTA pricing limits revenue capture. Competitors offer tiered discounts; Dostel must implement rule-based pricing for ≥7 day stays, Dosteller tiers, and activity bundles to reduce OTA dependency.

## Scope (Pricing Engine MVP)
1. **Base Policy Configuration**  
   - 7+ nights: 10% discount  
   - 14+ nights: 15% discount  
   - 21+ nights: 20% discount  

2. **Dosteller Tier Multipliers**  
   - Explorer/Contributor: No additional discount  
   - Dosteller: +10% off base rates  
   - Elder: +15% off base rates  

3. **Activity Bundles**  
   - "Community Access Pack": 3 skill-shares + 2 treks (15% off)  
   - "Workation Bundle": Dedicated workspace + weekly activities (10% off)

4. **Transparent Price Display**  
   - Show base rate, LOS discount, Dosteller discount, bundle savings on booking widget  
   - Total displayed before payment (matches Hostelworld expectations)

## Files
- `apps/backend/src/services/pricing-engine.ts` (new)  
- `apps/backend/src/schema/pricing.types.ts` (new)  
- `apps/backend/src/resolvers/booking.resolvers.ts` (update)  
- `apps/frontend/components/PriceBreakdown.tsx` (new)

## Acceptance Criteria
- [ ] Pricing engine returns correct discount tier based on stay duration
- [ ] Dosteller discount applied only to logged-in Dostellers (via DOS-86 schema)
- [ ] Bundle discounts calculated and displayed on booking UI
- [ ] Total price remains stable from review through confirmation
- [ ] Pricing rules configurable via env/constants (future-proof)

## Dependencies
- **DOS-86** (membership schema) — for Dosteller status  
- **DOT-10** (discount display) — frontend integration  
- **DOS-89** (corporate booking) — group rate logic

## Source
- `.paperclip/marketing/Pricing-Rules-Engine-Final-Brief.md` (Revised)  
- `.paperclip/research/local-hostel-competitor-pricing-analysis.md`