# DOST-94: Dosteller Dashboard - Full Community Hub

**Priority**: P1  
**Owner**: Builder (Frontend + Backend)  
**Requestor**: Product Manager (Community Growth)  

## Why  
The Dostellers program currently exists only as a landing page (DOT-5) and activity sign-up (DOT-6). Competitors (The Hosteller, Zostel) provide branded apps with unified community hubs. Dostel needs a true "Dosteller Hub" to differentiate from OTA pricing and create stickiness.

## Scope (MVP Dashboard)
1. **Profile & Status Section**  
   - Current tier (Explorer/Contributor/Dosteller/Elder) with progress bar  
   - Points balance + ₹ equivalent display  
   - Referral code + monthly referral count  

2. **Activity Calendar & Bookings**  
   - Upcoming activities (guided treks, skill-shares, cultural nights)  
   - One-click sign-up with capacity indicators  
   - Past activities attended with badges earned  

3. **Network Access**  
   - Directory of nearby Dostellers (opt-in, filter by skills/interests)  
   - "Request intro" button to peer members  

4. **Perks & Discounts**  
   - Tier-specific discounts (cafe, laundry, trekking partners)  
   - Digital badge for completed eco-contributions  

## Files
- `apps/frontend/app/dashboard/page.tsx` (expand existing)
- `apps/frontend/components/DostellerProfile.tsx` (new)
- `apps/frontend/components/ActivityCalendar.tsx` (new)
- `apps/frontend/components/DostellerDirectory.tsx` (new)
- `apps/backend/src/resolvers/dostellerDashboard.resolvers.ts` (new)
- `apps/backend/src/schema/dostellerDashboard.types.ts` (new)

## Acceptance Criteria
- [ ] Dashboard accessible at `/dashboard` for logged-in Dostellers
- [ ] Tier progress bar updates in real-time based on stays/points
- [ ] Activity sign-up from calendar creates booking record
- [ ] Directory shows opt-in members only with privacy controls
- [ ] Points display matches referral engine logic (DOST-92)

## Dependencies
- **DOS-86** (membership schema) — must include tier, points, referral fields
- **DOT-6** (activity sign-up flow) — backend already exists
- **DOST-92** (referral engine) — for referral display

## Source
- `.paperclip/marketing/Dostel-Growth-Requirements-Brief-for-Product.md` (Competitive Research Gap #1)