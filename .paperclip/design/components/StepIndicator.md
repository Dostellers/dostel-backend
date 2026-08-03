# StepIndicator Component Contract

## Purpose
Orients guests within the three checkout steps while allowing safe navigation back to completed steps.

## TypeScript contract
```typescript
type BookingStep = {
  id: 'details' | 'review' | 'payment'
  label: string
  href?: string
}

interface StepIndicatorProps {
  steps: readonly BookingStep[]
  currentStepId: BookingStep['id']
  onNavigate?: (step: BookingStep) => void
  className?: string
}
```

## Layout and tokens
- Mobile: compact horizontal sequence with “Step X of 3” visible; labels may shorten but current label remains visible.
- Desktop: full labels connected by rules.
- Completed: Forest-500 check; current: Forest-900 filled marker; future: Stone-400 outline.
- Every navigable step has a minimum 44px target. Markers are 24px visual elements and do not define the target size.

## Behavior and states
Completed steps may navigate backward. Current and future steps are not links. Navigation preserves booking state; future steps cannot be entered until prerequisites pass.

## Accessibility
- Uses `<nav aria-label="Booking progress"><ol>…</ol></nav>`.
- Current item has `aria-current="step"` and accessible text “Step 2 of 3: Review”.
- Completed navigable steps are links when `href` exists, otherwise native buttons.
- Visual connectors are hidden from assistive technology.
- Focus uses the 2px Sky ring with 2px offset; DOM order matches visual order.

## Motion
- State changes use the prescribed 150ms color transition only.
- No pulse: progress is status, not an attention mechanism.
- Reduced motion makes the state change immediate.

## Tokens
See `../system/design-tokens.md` for color, typography, focus, and motion values.
