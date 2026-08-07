# DOS-91: OTA Listing Optimization

**Priority**: High (Admin Ops)  
**Owner**: Product Manager → Builder/QA  
**Requestor**: CMO  

## Problem  
Hostelworld shows 8.9/10 rating but outdated reviews from 2020. Payment method listed as "cash only". No photos of dormitory beds or bathroom facilities. This reduces trust and direct booking conversion.  

## Why This Matters  
1. **Conversion Gap**: Competitors Zostel/TH show higher current scores on Hostelworld.  
2. **Trust Signal**: New photos of facilities and community activities needed.  
3. **Direct Booking**: No booking link or discount info for Dostellers.  

## Scope  
**Phase 1: Verification (CMSO)**  
- [ ] Confirm current payment methods (UPI/card support vs cash only)  
- [ ] Capture 10 recent photos (all room types, community spaces)  

**Phase 2: Copy Update (Builder)**  
- [ ] Rewrite Hostelworld description using `ota-listing-audit-2026-07-30.md` template  
- [ ] Add Dostellers section (no unconfirmed discounts)  
- [ ] Upload photos with Alt-text optimization for SEO  

**Phase 3: Tracking (PM)**  
- [ ] Add monthly metrics to Paperpoint: views, booking conversion, rating trends  

## Files  
- Update via Hostelworld Manager Dashboard (not in repo)  
- Keep copy reference at `.paperclip/research/ota-listing-audit-2026-07-30.md`  

## Acceptance Criteria  
- [ ] 8+ new photos uploaded (dorm beds, bathrooms, community spaces)  
- [ ] Payment methods accurately reflect current backend support  
- [ ] Description mentions "Dostellers" community benefits  
- [ ] Monthly tracking metric enabled in Paperpoint  

## Dependencies  
- None (manual admin task)  

## Sources  
- `.paperclip/research/ota-listing-audit-2026-07-30.md`  
- `.paperclip/marketing/DOS-91-ota-listing-optimization.md`