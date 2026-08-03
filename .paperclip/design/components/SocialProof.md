# SocialProof Component Contract

## Purpose
Surface trust signals inline on property cards and detail pages so guests see social proof without leaving the decision flow. Addresses competitive gap #1: Zostel and The Hosteller show zero reviews, ratings, or booking momentum.

## TypeScript contracts

```typescript
type ReviewVariant = 'card' | 'detail' | 'badge'

interface ReviewItem {
  id: string
  name: string
  rating: number // 1-5
  date: string // ISO date, displayed as "3 days ago"
  avatar?: string
  verified: boolean
  stayLength?: number // nights, for Dosteller identification
}

interface SocialProofProps {
  reviews?: readonly ReviewItem[]
  bookedThisWeek?: number
  totalDostellers?: number
  variant: ReviewVariant
  className?: string
  'aria-label'?: string
}
```

## Component variants

### Card variant (HostelCard)
**Layout:** Inline row below property name (flex row, gap `--ds-space-2`, items center)
- Shows: 3-star rating ★★★☆☆ + "12 booked this week" badge
- Rating stars: `--ds-color-sunset`, size 16px, height 20px
- Rating text: `--ds-color-stone-600`, max width 60px, truncate with ellipsis
- "Booked this week" badge: `--ds-color-sunset` background, white text, pill shape, `--ds-radius-full`, 20px height, 4px horizontal padding
- Visual hierarchy: Rating left-aligned, spacing right of rating

**States:**
- **Loading:** Skeleton shimmer (2.5 lines, 24px height each, 150ms pulse)
- **Empty:** Hidden component (preserve layout space)
- **Error:** "Could not load reviews" text with retry link (aria-live="polite")

### Detail variant (property detail page)
**Layout:** Horizontal scroll on mobile (<768px), grid on desktop (≥768px)
- Shows: 3-5 highlighted reviews with photos
- Card width: 280px mobile, 320px desktop
- Each review card: White background, `--ds-shadow-sm`, `--ds-radius-md`, 16px padding

**Review card structure:**
```
+-------------------------------------------+
| [Avatar: 40x40]  [Verified: ✓]            |
| [Name]  [★★★☆☆]                            |
| [3 days ago]  •  [7 nights] (Dosteller)  |
+-------------------------------------------+
```

**Layout rules:**
- Desktop: 3-column grid with gap `--ds-space-4`
- Mobile: Horizontal scroll with scroll snap (12px track)
- Item spacing: `--ds-space-3` between reviews

**States:**
- **Loading:** 3 skeleton cards with shimmer animation
- **No reviews:** Empty state with "Be the first to review" CTA
- **Error:** "Reviews temporarily unavailable" with error details

### Badge variant (trust badge)
**Layout:** Small inline badge (inline-flex, pill shape)
- Shows: "Trusted by 200+ Dostellers" with mountain icon
- Container: `--ds-radius-full`, height 24px, padding 8px 12px
- Background: `--ds-color-forest-500`, text: `--ds-color-white`
- Icon: Mountain SVG (20x20), margin right 6px

**States:**
- **Hover:** Background `--ds-color-forest-700`
- **Focus:** Ring `2px solid var(--ds-color-sky)` offset 2px
- **Value change:** Pulse scale (1.0 -> 1.03 -> 1.0, 200ms ease-in-out)

## Visual treatment

| Element | Token | Description |
|---------|-------|-------------|
| Star rating | `--ds-color-sunset` | Sunset amber for ratings |
| Verified badge | `--ds-color-forest-100` background, `--ds-color-forest-900` text | Badge with checkmark icon |
| "Booked this week" | `--ds-color-sunset` background, `--ds-color-white` text | Accent background, white text |
| Trust badge | `--ds-color-forest-500` background, `--ds-color-white` text | Primary brand color |
| Review text | `--ds-color-stone-600` | Body text |
| Review name | `--ds-color-forest-900` | Strong text |
| Card background | `--ds-color-white` | Surface for review items |

## Layout rules
- Card variant: Flex row, gap `--ds-space-2`, items center
- Detail variant: Horizontal scroll on mobile (<768px), grid layout on desktop (≥768px)
- Badge variant: Inline-flex, pill shape (`--ds-radius-full`)
- All touch targets ≥ 44px (achieved via padding)
- Responsive typography: `--ds-text-small` (14px) for card, `--ds-text-xs` (12px) for detail

## Accessibility
- **Card variant:** `role="status"` with `aria-live="polite"` for booking count updates
- **Detail variant:** `role="list"` with `aria-label="Reviews"` (default), each review `role="listitem"` with `aria-labelledby`
- **Badge variant:** `role="img"` with `aria-label="Trusted by {count} Dostellers"`
- Star rating: `role="img"` with `aria-label="{rating} out of 5 stars"`
- Verified badge: `aria-label="Verified traveller"` with `role="status"`
- Focus ring: `2px solid var(--ds-color-sky)` with `2px` offset
- Keyboard navigation: Tab order through all interactive elements
- All content meets WCAG AA contrast ratios (≥4.5:1)

## Motion
- **Card variant:** Fade-in on scroll (250ms ease-out) for new review cards
- **Detail variant:** Horizontal scroll snap (no animation for native feel)
- **Badge variant:** Subtle pulse on value change (200ms ease-in-out, scale 1.0 -> 1.03 -> 1.0)
- **Skeleton:** Shimmer animation (1.5s duration) for loading states
- All animations respect `prefers-reduced-motion` (disabled when set)

## Integration points

### Hostelling platform competitive differentiators:

**Gap 1: Zero social proof (both competitors fail here)**
- ✅ **Dostel wins:** Inline review cards with verified traveller status and booking momentum badges
- ✅ **Zostel/Hosteller:** Show zero reviews, ratings, or booking activity

**Gap 2: Room availability hidden behind interaction**
- ✅ **Dostel wins:** Social proof appears immediately on property cards without additional clicks
- ✅ **Zostel/Hosteller:** Hide all availability until user interacts with "View rooms"

**Gap 3: Policy information buried**
- ✅ **Dostel wins:** Social proof complements policy pills for complete trust picture
- ✅ **Zostel/Hosteller:** No visible trust signals at all

**Gap 7: Session fragility**
- ✅ **Dostel wins:** Social proof loads from cached state or server SSR
- ✅ **Zostel/Hosteller:** No persistence; refresh loses all social proof

## Tokens
See `../system/design-tokens.md` for color, spacing, radius, focus, and motion values.