# DS-008: UI Engineer - PolicyPills Component Implementation (Follow-up Issue)

**Assignee**: UI Engineer / Builder  
**Priority**: P2 (after DS-001, DS-002/003, DS-005 are shipped)  
**Depends on**: DS-001 (tokens), DS-002/003 (booking flow routes), DS-006 (design system refinement)  
**Related to**: DS-008-ui-engineer-policypills-component.md (design spec)

## Context

The Design Systems Designer has updated the PolicyPills component specification in `.paperclip/design/system/design-tokens.md` and created an updated component implementation in `apps/frontend/components/PolicyPills.tsx`. The Dostel Detail page (`apps/frontend/app/hostels/[slug]/page.tsx`) has been updated to use the new PolicyPills component with the correct props structure.

## Task

Implement the PolicyPills component according to the updated specification:

1. **Component Interface**: 
   - Accepts `PolicyPillsProps` with `policies: Array<{ label: string, variant?: 'default' | 'important' }>`
   - Properly handles the new policy icon mapping
   - Applies correct styling based on variant (default vs important)

2. **Styling Requirements**:
   - Use Dostel design tokens for colors, spacing, and radius
   - Default variant: `--ds-color-stone-200` background, `--ds-color-stone-600` text
   - Important variant: `--ds-color-sunset` background, `--ds-color-white` text
   - Touch targets ≥ 44px (implemented as `py-4` which is 16px vertical padding + text)
   - Responsive layout: flexible wrapping on mobile, inline on desktop
   - Proper focus states using `--ds-color-sky` for outline
   - Hover states using prescribed motion (brightness change)

3. **Accessibility Requirements**:
   - Proper ARIA roles (`role="list"` and `role="listitem"`)
   - Screen reader accessible (icons hidden with `aria-hidden="true"`)
   - Keyboard navigable
   - Color contrast compliant (already ensured by token usage)
   - Respects `prefers-reduced-motion`

4. **Implementation Details**:
   - File: `apps/frontend/components/PolicyPills.tsx`
   - Must use the exact interface specified in the spec
   - Must handle the three specific policies: "Free cancel 48h", "Check-in 2PM", "ID required"
   - Should map policy labels to appropriate icons (cancel → 🔄, "check-in" → 🕐, id → 🆔)
   - Default to 📋 icon for unmapped policies

## Acceptance Criteria

- [ ] Component renders 3 policy pills correctly with proper labels
- [ ] Uses Dostel design tokens for all styling (colors, spacing, radius)
- [ ] Default pills have stone-200 background and stone-600 text
- [ ] Important pills (if any) have sunset background and white text
- [ ] Touch targets are at least 44px tall
- [ ] Responsive layout works on mobile (<768px) and desktop (≥768px)
- [ ] Proper focus rings visible (using `--ds-color-sky`)
- [ ] Hover states use brightness change (prescribed motion)
- [ ] Respects `prefers-reduced-motion` media query
- [ ] Accessible: proper ARIA roles, screen reader friendly
- [ ] No TypeScript or linting errors
- [ ] Integrated correctly in `apps/frontend/app/hostels/[slug]/page.tsx`
- [ ] Verification notes provided for desktop and mobile

## Verification Notes

### Mobile (375px width):
- Pills should be easily tappable with thumb (bottom third of screen preferred)
- Background contrast should meet WCAG AA
- Text should be legible at default font size
- Pills should wrap appropriately on narrow screens

### Desktop (1024px+):
- Pills should display inline without wrapping unless space is constrained
- Hover states should be subtle (brightness change)
- Focus rings should be clearly visible (2px solid sky-500)
- Component should not interfere with sidebar layout

## References

- Design Spec: `.paperclip/design/tickets/DS-008-ui-engineer-policypills-component.md`
- Updated Component Spec: `.paperclip/design/system/design-tokens.md` (Motion and Accessibility sections)
- Usage Example: `apps/frontend/app/hostels/[slug]/page.tsx` line ~128
- Booking Flow Spec: `.paperclip/design/flows/booking-flow.md` (Step 3: Property Detail + Room Selection)
- Competitive Gap: `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md` (Gap #3: Policy information buried)

## Estimated Effort

2-3 hours for implementation, testing, and verification.