# DOS-83: Dostellers Page - Add Testimonials Carousel

## Description
Add a testimonials carousel below the benefits section and above the tiers section, featuring auto-scroll and pause on hover.

## Acceptance Criteria
- [ ] Carousel displays at least 3 testimonials (can use placeholder data from `dostellerTestimonials`)
- [ ] Auto-scrolls every 5 seconds
- [ ] Pauses auto-scroll when user hovers over carousel
- [ ] Includes navigation dots or arrows for manual control
- [ ] Accessible: supports keyboard navigation and screen readers
- [ ] Responsive layout: slides adjust for mobile/desktop

## Files to change
- `apps/frontend/app/dostellers/page.tsx`
- May need to create a new `TestimonialCarousel` component in `components/`

## Dependencies
- Dostellers page structure (DOS-82)

## Notes
- Use existing `dostellerTestimonials` data from `@/lib/data`
- Consider using a simple CSS-only carousel or a lightweight React carousel library if available
- Ensure pause on hover works for both mouse and touch devices
- Reference the Dostellers Journey Spec v2.0, Step 1: Discover Dostellers section