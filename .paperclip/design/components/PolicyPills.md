# PolicyPills Component Contract

## Purpose
Surfaces the three material booking policies at the decision point so guests do not need to hunt through page copy.

## TypeScript contract
```typescript
type PolicyPillTone = 'neutral' | 'positive' | 'informative'

type PolicyPillItem = {
  id: string
  label: string
  detail: string
  tone: PolicyPillTone
  icon: 'calendar-check' | 'clock' | 'id-card' | 'shield-check'
}

interface PolicyPillsProps {
  items: readonly [PolicyPillItem, PolicyPillItem, PolicyPillItem]
  label?: string
  onOpen?: (item: PolicyPillItem) => void
  className?: string
}
```

## Layout and tokens
- Mobile: horizontal overflow with visible next-item affordance; never truncate a material fact.
- Desktop: one wrapping row adjacent to room or booking CTA.
- Minimum control size: 44px high; gap: `--ds-space-2`; radius: `--ds-radius-full`.
- Neutral uses White/Stone-200; positive uses Forest-100/Forest-900; informative uses a Sky tint/Forest-900.
- Labels are plain language: “Free cancel until 3 Aug”, “Check-in 2–8 PM”, “Photo ID required”.

## States
Default, hover, focus-visible, pressed, and expanded. If JavaScript is unavailable, labels remain visible and details may render as adjacent text.

## Accessibility
- Container uses `role="list"` and an accessible label such as “Important booking policies”.
- Interactive pills are native `button` elements; static pills are list items, not fake buttons.
- Expanded details use `aria-expanded` and `aria-controls`; Escape closes the detail popover and returns focus.
- Focus uses the 2px Sky ring with 2px offset. Color and icon never carry meaning without text.

## Motion
- Detail disclosure uses the prescribed 250ms panel reveal.
- Button press uses the prescribed 150ms scale to 0.97.
- Reduced motion removes transform and keeps an immediate opacity change.

## Tokens
See `../system/design-tokens.md` for color, spacing, radius, focus, and motion values.
