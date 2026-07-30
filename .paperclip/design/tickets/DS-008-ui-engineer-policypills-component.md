# DS-008: UI Engineer - PolicyPills Component Implementation

**Assignee**: UI Engineer / Builder  
**Priority**: P2 (after DS-001, DS-002/003, DS-005 are shipped)  
**Depends on**: DS-001 (tokens), DS-002/003 (booking flow routes), DS-006 (design system refinement)

## Context

From the booking flow spec (`.paperclip/design/flows/booking-flow.md`), we need to implement the `PolicyPills` component to address the competitive gap of policy information being buried (Zostel/Hosteller gap #3).

The PolicyPills component displays 3 policy pills directly below the CTA on the property detail page, making critical policies immediately visible in the thumb zone.

## Component Contract

From the booking flow spec:

```typescript
// File: apps/frontend/components/PolicyPills.tsx
interface PolicyPillProps {
  label: string
  // Optional: icon or visual indicator
  variant?: 'default' | 'important' // e.g., for non-refundable policies
}

interface PolicyPillsProps {
  policies: Array<{
    label: string
    variant?: 'default' | 'important'
  }>
}
```

### Expected Policies (from spec):
1. "Free cancel 48h"
2. "Check-in 2PM"
3. "ID required"

### Visual Spec (from spec):
- Pills are displayed inline below the header row on the detail page
- Mobile: full-width pills, stacked or wrapped
- Desktop: inline pills
- Styling: use Dostel tokens for background, text, and border
- Touch target: >= 44px height
- Use appropriate border radius (`--ds-radius-md` or `--ds-radius-lg`)

## Implementation Requirements

1. Create `apps/frontend/components/PolicyPills.tsx`
2. Use Dostel design tokens from `.paperclip/design/system/design-tokens.md`
3. Ensure responsive layout:
   - Mobile (<768px): pills stack vertically or wrap with proper spacing
   - Desktop: pills display inline with gap
4. Apply appropriate states:
   - Default state: use `--ds-color-stone-200` for background, `--ds-color-stone-600` for text
   - Important variant (if used): use `--ds-color-sunset` for background, `--ds-color-white` for text
5. Ensure touch targets are at least 44px
6. Respect `prefers-reduced-motion` for any hover/press animations
7. Follow accessibility guidelines:
   - Proper color contrast (already ensured by tokens)
   - Consider adding `aria-label` if needed for clarity
   - Keyboard navigable (if interactive, but these are display-only)

## Acceptance Criteria

- [ ] Component renders 3 policy pills correctly
- [ ] Uses Dostel design tokens for colors, spacing, radius
- [ ] Responsive layout works on mobile and desktop
- [ ] Touch targets are >= 44px
- [ ] No linting or TypeScript errors
- [ ] Component is used in `apps/frontend/app/hostels/[slug]/page.tsx` (detail page) below the header row
- [ ] Verification notes for desktop and mobile provided

## Verification Notes

### Mobile (375px width):
- Pills should be easily tappable with thumb (bottom third of screen)
- Background contrast should meet WCAG AA
- Text should be legible at default font size

### Desktop (1024px+):
- Pills should display inline without wrapping unless space is constrained
- Hover states should be subtle (use prescribed motion: brightness change)
- Focus rings should be visible (use `--ds-color-sky` for outline)

## References

- Booking flow spec: `.paperclip/design/flows/booking-flow.md` (see Step 3: Property Detail + Room Selection)
- Design tokens: `.paperclip/design/system/design-tokens.md`
- Competitive gap: `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md` (Gap #3: Policy information buried)