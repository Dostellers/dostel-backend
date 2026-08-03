# RoomCard Component Contract

## Purpose
Displays individual room options with selection capability for booking flow.

## Props Interface
```typescript
interface RoomCardProps {
  room: {
    id: string
    name: string
    type: 'dorm-mixed' | 'dorm-female' | 'private' | 'deluxe'
    price: number
    originalPrice?: number
    capacity: number
    image: string
    amenities: string[]
    available: boolean
    bookedThisWeek?: number
  }
  selected: boolean
  onSelect: (roomId: string) => void
  checkIn: string           // ISO date for price calculation
  checkOut: string          // ISO date for price calculation
}
```

## States & Visual Treatment
- **Default**: Border: `1px solid var(--ds-color-stone-200)`, Background: `var(--ds-color-white)`
- **Hover/Focus**: Border: `1px solid var(--ds-color-forest-500)`, Shadow: `var(--ds-shadow-md)`
- **Selected**: Border: `2px solid var(--ds-color-forest-500)`, Background: `var(--ds-color-forest-500)/5`
- **Sold Out/Duplicate**: Opacity: `0.6`, Cursor: `not-allowed`
- **Loading State**: Skeleton shimmer (handled at list level)

## Content Structure
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

## Accessibility
- Role: `button` (when selectable)
- Aria-label: `"Select Mixed Dorm (6 Bed), ₹327 per night"`
- Focus ring: `2px solid var(--ds-color-sky)` with `2px` offset
- Keyboard: Space/Enter to select
- Disabled state: `aria-disabled="true"` when not available

## Motion
- Hover state: Card lift animation (`translateY(-2px)` + shadow-md, 250ms ease-out)
- Selection state change: Scale animation (0.98 -> 1.0, 150ms ease-out)
- Reduced motion removes transforms and changes selection state immediately.

## Tokens
See `../system/design-tokens.md` for color, spacing, focus, shadow, and motion values.