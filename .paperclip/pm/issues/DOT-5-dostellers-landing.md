# DOT-5: Create Dostellers Landing Page

**Priority**: P1  
**Owner**: Frontend Engineer  
**Requestor**: Product Manager  

## Description
Build `/dostellers` page using copy from `marketing/membership-dostellers-copy.md` to serve as the community membership hub.

## Why
- Core brand differentiator vs. Zostel/TH (per `competitive-feature-matrix.md`)
- Converts browsers to members by explaining "More than a membership. A community."

## Files to Modify
- `apps/frontend/app/dostellers/page.tsx` (new)
- `apps/frontend/components/Navbar.tsx` (rename "Membership" → "Dostellers")
- Redirect `/membership` → `/dostellers`

## Acceptance Criteria
- [ ] Hero: "Become a Dosteller" with "Community | Savings | Access" pillars
- [ ] Tier cards: Explorer (₹999/mo), Nomad (₹1,999/mo), Wanderer (₹4,999/mo)
- [ ] Stats: 40+ yrs hostelling, 3,000+ Dostellers, 12+ countries
- [ ] FAQ accordion (keyboard accessible)
- [ ] All CTAs use "Join" / "Tier" language (no "subscribe" / "plan")

## Dependencies
- DOST-2 (membership schema)

## Copy Source
- `/root/dostel-backend/.paperclip/marketing/membership-dostellers-copy.md`