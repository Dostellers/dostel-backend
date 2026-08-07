# Property Detail & Room Selection Flow Spec v1.0
## Critical Drop-off Fix: Inline Room Selection

### Drop-off Problem
| Metric | Value |
|--------|-------|
| Current Rate | 35% from detail → guest details |
| Root Cause | Room selection lives on separate `/hostels/[slug]/rooms` route |
| Zostel/Hosteller Gap | Both require full page loads for room evaluation |
| Dostel Solution | Inline room cards with immediate selection on property detail page |

### Key Rule
**NO separate `/hostels/[slug]/rooms` route.** Rooms are inline on property detail page.

---

## Flow Architecture

```
Property Detail Page (/hostels/[slug])
├── Header: Name + Location + Rating + Share
├── PolicyPills: 3 chips (Free cancel 48h • Check-in time • ID required)
├── Gallery: Swipeable images (mobile) / thumbnail grid (desktop)
├── Rooms Section: Inline RoomSelector
│   ├── RoomCard (Selectable)
│   ├── SocialProof: "X booked this week"
│   ├── Dosteller Price: Discounted rate if logged in
│   └── LongStayToggle: For 7+ night stays
├── Amenities Marquee
├── Policies Accordion
├── Reviews Section (3-5 highlighted)
└── Sticky Bottom Bar (Mobile Critical)
    ├── Shows price/night + total
    ├── CTA: "Select a room" → "Book now"
    └── Always thumb-reachable (72px height)
```

---

## Component Contracts

### Enhanced RoomCard (inline selection)
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
    dostellerPrice?: number
  }
  selected: boolean
  onSelect: (roomId: string) => void
  checkIn: string
  checkOut: string
}
```

**States:**
| State | Visual |
|-------|--------|
| Default | Border: 1px solid #e0e0e0 |
| Selected | Border: 2px solid #2d6a4f, Button: "Selected ✓" |
| Sold Out | Opacity: 0.6, Button: "Sold out", disabled |

### StickyBottomBar (mobile critical)
```typescript
interface StickyBottomBarProps {
  price: number        // price/night
  total: number        // total for selected rooms
  ctaLabel: string     // "Select a room" | "Book now" | "Sold out"
  onCtaClick: () => void
  disabled?: boolean
  show?: boolean       // auto-hide on scroll down
}
```

### PolicyPills (static below header)
```typescript
interface PolicyPillsProps {
  policies: Array<{ label: string }>
}
```

---

## State Machine

```
IDLE → User taps room card
  → Card border: 2px forest-500
  → Button: "Selected ✓"
  → StickyBar updates total

SELECTED → User taps "Selected ✓"
  → Deselects room
  → StickyBar updates

MULTI-SELECT → Multiple rooms
  → StickyBar shows combined total
  → "Book now" CTA enabled
```

---

## Acceptance Criteria

### Functional
- [ ] Room selection is INLINE on detail page (no separate `/rooms` route)
- [ ] Clicking a room card selects it with visual feedback
- [ ] Tapping "Selected ✓" deselects
- [ ] Sticky bottom bar updates in real-time
- [ ] Back navigation preserves selected rooms
- [ ] No horizontal scroll at 375px viewport

### Accessibility
- [ ] All touch targets ≥ 44px
- [ ] Focus indicator visible (2px solid sky-500)
- [ ] Room cards have proper aria-labels
- [ ] Policy pills keyboard accessible

### Visual
- [ ] Policy pills visible below header row
- [ ] Social proof shows on each room card
- [ ] Dosteller pricing shown when applicable
- [ ] Only 3 prescribed animations used
- [ ] Animations respect `prefers-reduced-motion`

---

## Implementation Order

### Phase 1: Remove redundant route
1. Delete `apps/frontend/app/hostels/[slug]/rooms/page.tsx`
2. Remove any link to this route from detail page

### Phase 2: Integrate RoomSelector inline
1. In `apps/frontend/app/hostels/[slug]/page.tsx`:
   - Import `RoomSelector`
   - Add `selectedRoomIds: string[]` state
   - Replace `RoomAvailability` with direct `RoomSelector` embed
   - Add `onSelect` handler

### Phase 3: Add sticky bottom bar
1. Import `StickyBottomBar`
2. Calculate total from selected rooms
3. Position at bottom (mobile) or sidebar (desktop)

### Phase 4: Add policy pills
1. Import `PolicyPills`
2. Place below header row

### Phase 5: Add social proof to rooms
1. Ensure `RoomSelector` displays `bookedThisWeek`
2. Ensure `RoomSelector` displays `dostellerPrice` when applicable

---

## Mobile-first Rules (enforced)
1. Sticky bottom bar: 72px height with 80px page padding
2. Touch targets: ≥ 44px
3. Single column < 768px
4. No horizontal scroll at 375px
5. Policy pills always visible (pinned below header)

---

## Dostel Competitive Wins
- **Inline selection**: No page load between property → room
- **Thumb zone CTA**: Always reachable via sticky bar
- **Policy transparency**: 3 pills always visible
- **Social proof**: "X booked this week" reduces uncertainty
- **Session persistence**: Selection survives browser refresh