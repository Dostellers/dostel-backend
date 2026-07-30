# DOS-84: Dostellers Page - Add FAQ Accordion

## Description
Add an FAQ accordion section at the bottom of the Dostellers page, keyboard accessible.

## Acceptance Criteria
- [ ] Accordion contains 4-5 common questions about Dostellers membership
- [ ] Each item can be expanded/collapsed by clicking header or pressing Enter/Space
- [ ] Only one item can be open at a time (accordion behavior)
- [ ] Smooth animation when opening/closing
- [ ] Proper ARIA attributes for accessibility

## Files to change
- `apps/frontend/app/dostellers/page.tsx`
- May need to create a new `FaqAccordion` component

## Dependencies
- Dostellers page structure (DOS-82)

## Notes
- Common Dostellers FAQ topics: pricing, benefits, events, points system, long-stay discounts
- Use CSS transitions for smooth animation
- Ensure proper focus management for keyboard navigation
- Reference the Dostellers Journey Spec v2.0, Step 1: Discover Dostellers section (Acceptance Criteria #140)