# StickyBottomBar Component Contract

## Purpose
Keeps price context and the next booking action in the mobile thumb zone without obscuring page content.

## TypeScript contract
```typescript
type StickyBottomBarSelection = {
  roomCount: number
  nightlyFrom: number
  total: number
  currency: 'INR'
}

interface StickyBottomBarProps {
  selection: StickyBottomBarSelection | null
  primaryLabel: string
  onPrimaryAction: () => void
  disabled?: boolean
  loading?: boolean
  statusMessage?: string
  className?: string
}
```

## Layout and tokens
- Mobile: fixed to viewport bottom, minimum 72px plus `env(safe-area-inset-bottom)`; page reserves matching bottom space.
- Price summary is left aligned; one primary action is right aligned and at least 44px high.
- Desktop: render the same content contract in the booking sidebar without fixed positioning.
- Surface: White, Stone-200 top border, `--ds-shadow-lg`; CTA uses Sunset-700 with White text.
- Unselected state says what is needed (“Select a room”) rather than showing a false price.

## States
Unselected, ready, loading, disabled, and recoverable error. Loading preserves dimensions. Error keeps the guest’s room selection and changes the action to “Try again”.

## Accessibility
- Uses `role="region"` with `aria-label="Booking summary and action"`.
- Price/status changes announce through a separate `aria-live="polite"` node.
- Loading uses `aria-busy`; it never traps focus.
- The action is a native button with visible 2px Sky focus ring.
- At 200% zoom, price and action wrap without overlap.

## Motion
- The bar may reveal on upward scroll with the prescribed 250ms panel motion; it remains visible whenever focus is inside.
- CTA uses the prescribed 150ms button press.
- Reduced motion removes translation. Price changes do not scale or pulse.

## Tokens
See `../system/design-tokens.md` for color, shadow, focus, and motion values.
