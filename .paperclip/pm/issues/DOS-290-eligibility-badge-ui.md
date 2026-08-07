# DOS-290: Eligibility Badge UI

**Priority:** P1  
**Owner:** Frontend Engineer  
**Status:** todo  

## Description
Implement a visual badge that indicates a room is eligible for Dosteller membership benefits (e.g., tiered discounts, exclusive activities). The badge should appear on room cards within the search and discovery UI.

## Requirements
- Badge appears on eligible room cards (based on `is_eligible_for_dostellers` GraphQL field)  
- Tooltip on hover explaining Dosteller eligibility criteria  
- Clicking badge should open activity feed or membership info modal  
- Mobile-responsive design (minimum 320px)  
- Accessibility: ARIA label "Dosteller-eligible room"  

## Acceptance Criteria
- [ ] Badge is visible on all eligible rooms across desktop and mobile views  
- [ ] Tooltip displays correct eligibility message  
- [ ] Badge design follows brand color palette (teal background, white text)  
- [ ] No layout shift when badge is rendered  
- [ ] Unit test covers badge rendering for eligible/non-eligible rooms  

## Dependencies
- GraphQL field `is_eligible_for_dostellers` must be created in `/apps/backend/src/schema/bookingTypeDefs.js`  
- Room card component will accept `isEligibleForDosteller` prop  
- Backend resolver must calculate eligibility based on `stay_duration >= 7 nights`  

## References
- Dosstel Eligibility Roadmap: `/root/dostel-backend/.paperclip/marketing/dostellers/dostellers-implementation-roadmap.md`  
- Brand color palette: `#008080` (teal) for Dosteller badge  
- Accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/