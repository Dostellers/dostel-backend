# DS-006: Design System Refinement - Motion and Accessibility Guidelines

**Assignee**: Design Systems Designer  
**Priority**: P2 (after the shipped foundational work)  
**Depends on**: DS-001 (guest tokens), DS-002/003 (booking flow), DS-005 (Dostellers)

## Context

We have shipped the foundational design tokens and component implementations for guest, Dostellers, and prepared admin tokens.
Now we need to refine the design system with detailed motion and accessibility guidelines to ensure consistency and accessibility.

## Motion Guidelines

We currently have 3 prescribed animations. We need to expand on when to use each and provide examples.

- **Card hover lift**: Use on all interactive cards (HostelCard, RoomCard, TierCard, etc.) to indicate interactivity.
- **Page fade-in**: Use on full-page transitions (between routes) for a smooth experience.
- **Button press**: Use on all buttons for tactile feedback.

We should also define:

- **Loading states**: Use skeleton shimmer for content that is loading, with a pulse animation of 1.5s.
- **Error states**: Use a subtle shake animation (250ms, ease-in-out) for form errors to draw attention without being disruptive.
- **Success states**: Use a brief scale-up then down (like a checkmark appearance) for 400ms with spring easing.

We must also define when to respect `prefers-reduced-motion`.

## Accessibility Guidelines

We have defined contrast and focus states in the tokens, but we need to provide detailed guidelines:

- **Contrast**: All text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text). We have already defined tokens that meet this, but we must ensure usage.
- **Focus order**: Ensure logical tab order, especially in modals and complex forms.
- **Screen readers**: Use ARIA labels for icons, live regions for dynamic content (like toast messages), and proper heading hierarchy.
- **Touch targets**: All interactive elements must be at least 44x44 dp.
- **Text scaling**: Ensure the layout works when text is scaled up to 200%.

## Deliverable

Update `.paperclip/design/system/design-tokens.md` with:

- A new section for Motion Guidelines (expanding on the current motion section)
- A new section for Accessibility Guidelines

## Acceptance Criteria

- [ ] Motion guidelines documented with usage examples
- [ ] Accessibility guidelines documented with specific techniques and testing methods
- [ ] Updated tokens file reflects the guidelines (if any new tokens are needed for accessibility, e.g., focus ring width)

## References

- [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/)
- [Apple Haptics Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/user-interaction/feedback/)
- [Google Material Motion](https://material.io/design/motion/)