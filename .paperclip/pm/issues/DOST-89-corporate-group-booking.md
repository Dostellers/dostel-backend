# DOST-89: Corporate Group Booking Workflow  

**Priority**: Medium  
**Owner**: Builder  
**Requestor**: Product Manager (Corporate Partnerships)  

## Why  
Hostelworld currently shows only 1 listing for Vattakanal with 3 rooms visible. Corporate travel planners need to book multiple beds at once, but the flow is fragmented. This creates friction for groups seeking long‑stay community immersion.  
Assumption: Adding a dedicated `/corporate-group-booking` endpoint will increase corporate conversions by 12% (based on early prototype data).  

## Scope (MVP)  
1. Expose `/corporate-group-booking` GraphQL query that returns:  
   - Available room types for group size ≥4  
   - Pricing breakdown (base rate × group multiplier)  
   - Dosteller status flag for each room  
2. Add form to `/corporate-group-booking` page with fields for:  
   - Group name  
   - Number of travelers  
   - Desired stay dates (min 30 nights)  
   - Contact email (for booking confirmation)  
3. Email template for confirmation (`emailTemplates/groupBookingConfirmation.html`)  

## Dependencies  
- **DOS-1** (channel manager sync) must be built first to expose inventory for groups  
- **DOS-85** (room availability query) must include group‑size calculation  
- **DOST-2** (membership schema) – groups can be marked as "Corporate Dostellers" for tiered pricing  

## Acceptance Criteria  
- [ ] Query returns accurate availability for groups of 4‑30 travelers, including dorm beds and suites  
- [ ] Pricing shows base rate + group multiplier (e.g., 1.2× for groups 4‑7, 1.5× for groups 8‑15)  
- [ ] Dosteller discount (10%) applied automatically for qualified groups  
- [ ] Email confirmation sent to provided contact with itinerary and Dosteller welcome badge  
- [ ] Group booking flow appears on `/corporate-group-booking` page  

## Notes  
- Reference research: `pms-vendor-comparison-jul-2026.md` (section on group bookings)  
- Align terminology with `community-issue-pack-jul-30-2026.md` when describing "Dosteller" branding for groups