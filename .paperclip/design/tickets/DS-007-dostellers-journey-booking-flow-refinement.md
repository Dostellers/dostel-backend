# DS-007: Product Designer - Dostellers Journey and Booking Flow Refinement

**Assignee**: Product Designer  
**Priority**: P2 (after the shipped foundational work)  
**Depends on**: DS-005 (Dostellers journey), DS-002/003 (booking flow), DS-006 (design system refinement)

## Context

We have shipped the Dostellers journey (DS-005) and the booking flow (DS-002/003). Now we need to refine these flows based on the competitive analysis (Zostel/Hosteller gaps) and the Dostel brand guidelines to ensure we are truly competitive and on-brand.

## Competitive Gaps to Address

From `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md`, Dostel wins on:
1. Social proof (reviews, booking momentum) - implemented but needs verification
2. Loyalty program (Dostellers) - implemented but needs verification of integration
3. Inline availability (rooms on detail page) - implemented but needs verification
4. Policy pills (3 pills below CTA) - implemented but needs verification
5. Sticky CTA bar (thumb-reachable) - implemented but needs verification
6. Session persistence (URL + context + localStorage) - implemented but needs verification
7. Price transparency (full breakdown at review) - implemented but needs verification
8. Distinct brand identity (mountain community warmth) - needs verification

## Dostel Brand Guidelines

From `.paperclip/design/system/design-tokens.md` and `DESIGN_SYSTEM.md`:
- Mountain-grounded colors (forest greens, sunset amber, warm earth)
- Community soul (Playfair Display + Inter, warm off-white backgrounds)
- Mobile-first, thumb-friendly
- Accessible by default
- 3 animations only (no motion noise)
- Warm not trendy (no purple gradients, no dashboard-in-hero, no cream+terracotta)

## Task

Review the implemented Dostellers journey and booking flow for:
1. **Brand consistency**: Are we using the correct colors, typography, spacing, and motion?
2. **Competitive edge**: Are we beating Zostel/Hosteller on the 8 gaps listed above?
3. **User experience**: Are there any usability issues in the flows?

## Deliverable

Create a refinement plan in `.paperclip/design/flows/dostellers-journey.md` and `.paperclip/design/flows/booking-flow.md` (if needed) with:
- Specific changes to UI/UX
- Updated component contracts if needed
- Updated acceptance criteria
- Verification notes for desktop and mobile

## Acceptance Criteria

- [ ] Review completed for Dostellers journey (5 routes, 6 components)
- [ ] Review completed for booking flow (7 steps, 19 components)
- [ ] Provided specific recommendations for brand consistency and competitive edge
- [ ] Updated the spec files with the refinements
- [ ] Verification notes for desktop and mobile included

## References

- `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md`
- `.paperclip/design/system/design-tokens.md`
- `.paperclip/design/flows/dostellers-journey.md`
- `.paperclip/design/flows/booking-flow.md`
- `DESIGN_SYSTEM.md`