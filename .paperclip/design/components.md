# Dostel Component Contracts

## RoomCard Component

### Purpose
Displays individual room options with selection capability for booking flow.

### Props Interface
```typescript
interface RoomCardProps {
  room: {
    id: string
    name: string
    type: 'dorm-mixed' | 'dorm-female' | 'private' | 'deluxe'
    price: number
    originalPrice?: number  // For showing discounts
    capacity: number
    image: string
    amenities: string[]     // Icon keys, max 5 shown
    available: boolean
    bookedThisWeek?: number
  }
  selected: boolean
  onSelect: (roomId: string) => void
  checkIn: string           // ISO date for price calculation
  checkOut: string          // ISO date for price calculation
}
```

### States & Visual Treatment
- **Default**: Border: `1px solid var(--ds-color-stone-200)`, Background: `var(--ds-color-white)`
- **Hover/Focus**: Border: `1px solid var(--ds-color-forest-500)`, Shadow: `var(--ds-shadow-md)`
- **Selected**: Border: `2px solid var(--ds-color-forest-500)`, Background: `var(--ds-color-forest-500)/5`
- **Sold Out/Duplicate**: Opacity: `0.6`, Cursor: `not-allowed`
- **Loading State**: Skeleton shimmer (handled at list level)

### Content Structure
```
+--------------------------------------------------+
| [Image: aspect-ratio 4:3, object-cover]          |
|                                                  |
| +-- Header --------------------------------------+
| | Room Name           [Select/Selected ✓]      |
| | Price/night: ₹XXX   [Discount badge if any]  |
| +----------------------------------------------+ |
|                                                  |
| +-- Meta ----------------------------------------+
| | 👥 Capacity: X persons                        |
| | 🔒 [lock] [curtain] [socket] (amenities icons)|
| | 📅 Booked this week: X (if > 5)               |
| +----------------------------------------------+ |
+--------------------------------------------------+
```

### Accessibility
- Role: `button` (when selectable)
- Aria-label: `"Select Mixed Dorm (6 Bed), ₹327 per night"`
- Focus ring: `2px solid var(--ds-color-sky)` with `2px` offset
- Keyboard: Space/Enter to select
- Disabled state: `aria-disabled="true"` when not available

### Motion
- Hover state: Card lift animation (`translateY(-2px)` + shadow-md, 250ms ease-out)
- Selection state change: Scale animation (0.98 -> 1.0, 150ms ease-out)


```

## PolicyPills Component

### Purpose
Displays 3 critical policy items adjacent to primary CTA for trust and transparency.

### Props Interface
```typescript
interface PolicyPillsProps {
  items: Array<{
    label: string          // Short display text (max 20 chars)
    fullText: string       // Full policy text for tooltip/modal
    severity: 'info' | 'material'
  }>
  className?: string
}
```

### States & Visual Treatment
- **Default**: Background: `var(--ds-color-forest-100)`, Text: `var(--ds-color-forest-900)`
- **Hover**: Background: `var(--ds-color-forest-100)/80`, Text: `var(--ds-color-forest-900)`
- **Focus**: Ring: `2px solid var(--ds-color-sky)` offset `2px`
- **Material policies** (cancellation, check-in, ID): Slightly heavier font weight

### Layout Rules
- Always displays exactly 3 pills horizontally
- Wraps to multiple rows on narrow screens (< 320px)
- Fixed height: `36px` for consistent alignment
- Minimum touch target: `44px` (achieved with padding)
- Margin between pills: `8px`
- Radius: `var(--ds-radius-full)` (pill shape)

### Content
```
[pill] Free cancel until 3 Aug    [pill] Check-in 2PM-8PM    [pill] ID required
```

### Accessibility
- Role: `group`
- Aria-label: `"Important policies: Free cancellation until August 3, Check-in 2PM-8PM, ID required"`
- Each pill: `role="button"` with appropriate aria-label for full text
- Focus visible on each pill individually
- Tooltip on hover/focus showing fullText

### Motion
- Fade-in when scrolling into viewport (250ms ease-out)
- Hover state: subtle background opacity change (150ms ease-in-out)

## StickyBottomBar Component

### Purpose
Provides persistent primary CTA in thumb zone on mobile, contextual sidebar on desktop.

### Props Interface
```typescript
interface StickyBottomBarProps {
  pricePerNight: number      // Base price/night
  totalPrice: number         // Total for selected dates/rooms
  selectedRooms: Array<{
    id: string
    name: string
    quantity: number
    pricePerNight: number
  }>
  onPrimaryAction: () => void
  primaryLabel: string       // "Select a room", "Book now", etc.
  isLoading?: boolean
  isDisabled?: boolean
  showPolicySummary?: boolean
  policyItems?: Array<{label: string}> // For desktop sidebar
}
```

### States & Visual Treatment
**Mobile (always sticky bottom 72px):**
- Background: `var(--ds-color-white)/90` (semi-transparent for backdrop blur)
- Border-top: `1px solid var(--ds-color-stone-200)`
- Height: `72px` + `env(safe-area-inset-bottom)`
- Padding: `16px` horizontal, `12px` vertical
- Default state: `"Select a room"` CTA (disabled appearance)
- Room selected: Shows price/night + total + primary CTA
- Loading state: Skeleton shimmer on price elements
- Disabled state: Opacity `0.5`, cursor `not-allowed`

**Desktop (appears in sidebar):**
- Not sticky, flows naturally with content
- Width: `100%` of sidebar container
- Same styling as mobile but without safe area padding
- May show policy summary in expandable section

### Content Layout (Mobile)
```
+------------------------------------------------------------------+
| ₹327/night      ● ● ●                                             |
| ₹1,308 total    [  Book now  ]                                    |
+------------------------------------------------------------------+
```
- Left side: Price information (aligns left)
- Right side: Primary CTA button (minimum 44px height, flexible width)
- Dot indicators: Show selected room count (● ● ● = 3 rooms)

### Accessibility
- Role: `region` with aria-label `"Booking summary and primary action"`
- Price elements: `aria-live="polite"` for dynamic updates
- CTA button: Standard button accessibility
- Focus management: Traps focus when loading/disabled states active
- Screen reader announces price updates when they change

### Motion
- Appear/disappear: Slide animation (250ms ease-out/in)
- Price updates: Micro-interaction scale (1.0 -> 1.02 -> 1.0, 150ms ease-in-out)
- Respects `prefers-reduced-motion` by using opacity changes only

## StepIndicator Component

### Purpose
Shows progress through multi-step booking process with navigation capability.

### Props Interface
```typescript
interface StepIndicatorProps {
  currentStep: number          // 1-indexed (1, 2, 3...)
  totalSteps: number
  steps: Array<{
    label: string
    href?: string             // If navigable (completed steps)
  }>
  className?: string
}
```

### States & Visual Treatment
- **Completed Step**: Checkmark (✓) in circle, text `--ds-color-forest-900`
- **Current Step**: Filled circle (•) in circle, text `--ds-color-forest-900`
- **Future Step**: Empty circle (○), text `--ds-color-stone-400`
- **Disabled/Future**: Text `--ds-color-stone-400`, cursor `not-allowed` (if not navigable)
- **Hover/Future navigable**: Background `--ds-color-stone-50`/`--ds-color-stone-100`

### Layout Rules
- Horizontal row on desktop (≥ 768px)
- Vertical stack on mobile (< 768px) with full-width tap targets
- Minimum touch target: `44px` for each step
- Spacing between steps: `24px`
- Circle size: `24px` diameter
- Text alignment: Left-aligned labels
- Current step indicator: Slightly larger circle (`28px`) or subtle scale (1.05)

### Content Examples
**Horizontal (desktop):**
```
[1] Guest details ─── ● ─── [2] Review ─── ○ ─── [3] Payment ─── ○
```

**Vertical (mobile):**
```
1. Guest details    ●
2. Review           ○
3. Payment          ○
```

### Accessibility
- Role: `navigation`
- Aria-label: `"Booking progress indicator"`
- Current step: `aria-current="step"`
- Each step: `role="button"` if navigable, with appropriate aria-label
- Focus ring: `2px solid var(--ds-color-sky)` offset `2px`
- Screen reader announces: `"Step 2 of 3: Review. Current step."`

### Motion
- Step transition: Fade-in/out of circle states (150ms ease-in-out)
- Current step indicator: Subtle pulse animation (250ms ease-in-out)
- Respects `prefers-reduced-motion` by disabling animations