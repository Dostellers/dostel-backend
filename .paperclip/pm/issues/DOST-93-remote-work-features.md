# DOST-93: Remote Work Integration Features

**Priority**: Medium  
**Owner**: Builder  
**Requestor**: Product Manager  

## Why  
Remote workers are a key audience segment (identified in `.paperclip/research/competitive-feature-matrix.md`). Currently, no dedicated infrastructure exists for this group, creating a missed opportunity vs. The Hosteller's workation packages.

## Scope (MVP)
1. **Remote Worker Profile Tag**  
   - Add `isRemoteWorker: boolean` field to `user` schema
   - Enable via profile onboarding and dashboard update
2. **Dedicated Workation Rooms**  
   - Tag 1-2 rooms with:
     - High-speed Wi-Fi (≥50 Mbps)
     - Power outlet + blackout curtains
     - Quiet zone rating (admin panel)
3. **Remote Work Pricing Bundle**  
   - ₹450/night (includes breakfast + work space)
   - 5% discount for stays ≥30 nights
4. **Workation Dashboard**  
   - `/dashboard/remote-work` page with:
     - Status tracking (Active/Upcoming/Completed)
     - Invoice generation with internet package line item

## Dependencies
- **DOS-86** (membership schema) – for `isRemoteWorker` flag
- **DOT-4** (booking widget) – to display "Workation Room" badge
- **DOS-89** (corporate booking) – for group workation packages

## Acceptance Criteria
- [ ] Remote worker profile field added to `apps/backend/src/schema/user.types.ts`
- [ ] "Workation Room" badge shown in hostel detail pages
- [ ] Pricing engine reflects ₹450/night base + 5% long-stay discount
- [ ] Dashboard stub with invoice generation capability
- [ ] Minimum-stay validation for workation rooms

## Sources
- `.paperclip/research/booking-remote-worker-integration.md`