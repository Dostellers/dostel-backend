# DOST-1: Sync Vattakanal Inventory to Channel Manager  

**Priority**: High  
**Owner**: Builder  
**Requestor**: Product Manager (Admin Ops)  

## Why  
Hostelworld only shows 1 booking window for Vattakanal. Dostel loses 15% margin to OTAs due to zero direct bookings.  
Assumption: Syncing long-stay availability (>30 day bookings) to Booking.com reduces commission waste.  

## Scope (MVP)  
1. Expose `/dosteller-discount` API for channel partners to read tiered pricing  
2. Update availability export to show dorm inventory (not just suites) for 2027+ dates  
3. Flag "Unavailable" for non-Dosteller rates after 60 days  

## Files  
- `apps/backend/src/resolvers/availability.resolvers.ts`  
- `apps/backend/src/services/channel-manager.js` (new)  

## Acceptance Criteria  
- [ ] Channel partners see **all room types** (dorms/suites/couples) for 2027+  
- [ ] API returns Dosteller discount rates (10% off Seedling tier)  
- [ ] Test sync to Hostelworld staging (manual step required)  
- [ ] Update `pms-vendor-comparison-jul-2026.md` research doc with findings  

## Dependencies  
- DOS-85 (pricing engine schema) shipped first