# Property Detail Flow Spec v2.1 – Decision Stack

## Goal
Eliminate the 35% drop-off from property detail to guest details by making room selection, policies, and trust signals fully visible inline.

Competitive gap: Zostel/Hosteller hide room inventory behind "View rooms" CTA; Dostel shows inventory + pricing + policies immediately.

---

## Flow Architecture

```
Property Detail Page (/hostels/[slug])
├── Identity: name + location + verified rating
├── Gallery: 3:2 hero, swipeable thumb grid (mobile) / thumbnail sidebar (desktop)
├── Decision Strip: "Free cancel until X" · "Check-in 2-8 PM" · "ID +18+"
├── Stay Editor: check-in, check-out, guests (URL-synced)
├── Room Selection: Date-specific inventory, total price inline
├── Access Preview: map + landmark + transport limits
├── Social Proof: "X booked this week" (timestamped backend data only)
├── Sticky Bottom Bar (Mobile): Always thumb-reachable, 72px height
└── Review Section: 3-5 verified reviews with recency
```

**Critical Rule**: NO `/hostels/[slug]/rooms` route. All room selection is inline on the property detail page.

---

## Component Contracts

### RoomCard (Enhanced Inline Selection)

```tsx
interface RoomCardProps {
  room: {
    id: string;
    name: string;
    type: 'dorm-mixed' | 'dorm-female' | 'private' | 'deluxe';
    price: number;            // total for stay
    originalPrice?: number;     // for Dosteller discount
    capacity: number;
    image: string;
    amenities: string[];        // max 5 icons
    available: boolean;
    bookedThisWeek?: number;    // only show if backend-verified
    dostellerPrice?: number;    // only for logged-in Dostellers
  };
  selected: boolean;
  onSelect: (roomId: string) => void;
  checkIn: string;
  checkOut: string;
}
```

**States**:
| State | Visual | AR |
|-------|--------|----|
| Default | 1px stone-200 border | button |
| Selected | 2px forest-500 border + check icon | "Selected ✓" |
| Sold Out | opacity-60, disabled button | "Sold out" |

### DecisionStrip (Policy Display)

```tsx
interface DecisionItem {
  id: 'cancellation' | 'check-in' | 'age-id' | 'accessibility';
  label: string;  // e.g. "Free cancel until Aug 3"
  severity: 'info' | 'material';  // material: affects booking
  href: string;  // link to full policy
}

interface DecisionStripProps {
  items: DecisionItem[];
}
```

**Visual**: Display-only row, no hover. Tap/click item to read full policy. Links appear on focus/hover.

### StickyBottomBar (Mobile Critical)

```tsx
interface StickyBottomBarProps {
  price: number;       // total for stay
  roomName: string;   // selected room name
  ctaLabel: string;    // "Select a room" | "Book now (₹2,616)"
  onCtaClick: () => void;
  disabled?: boolean;
  show?: boolean;
}
```

**Behavior**:
- Slide up on scroll up (250ms ease-out)
- Slide down on scroll down (200ms ease-out)
- Hide when scrolling down past 100px
- Always 72px height + 16px page padding
- `padding-bottom: env(safe-area-inset-bottom)`

---

## State Machine

```
Dates Required → Available → Selected → Sticky Bar shows total → Continue
     ↓              ↓           ↓
  Show indicator  Exact price  CTA enabled
  No inventory   No sold out   Multi-select supported
```

---

## Mobile Layout (360×800)

```
┌────────────────────────────────────┐
│ ← Dostel Kodaikanal          Share │ 44px controls
├────────────────────────────────────┤
│ property image              1 / 8 │ 240px, 3:2
├────────────────────────────────────┤
│ Kodaikanal, Tamil Nadu          │
│ ⭐ 4.8 · 124 verified stays      │
│ Available for 5–9 Aug             │
├────────────────────────────────────┤
│ Free cancel Aug 3  · 2PM CI      │
│ ID +18+                         │
├────────────────────────────────────┤
│ Choose your room                  │
│ Mixed dorm · 4 beds available     │
│ ₹1,308 total  [ Select ]        │
│ 4 left · "8 booked this week"     │
├────────────────────────────────────┤
│ Getting here                      │
│ Map pin · 2km from main road      │
│ Limited cabs after 8 PM  [Details]│
├────────────────────────────────────┤
│ 1 bed · 4 nights  ₹1,308 total │
│                [ Continue ]       │
└────────────────────────────────────┘
```

---

## Desktop Layout (1440×900)

```
┌── Main (760px) ──┬── Sidebar (360px) ──┐
│ Identity        │ Dates / Guests       │
│ Decision Strip  │ Selected Room        │
│ Room List       │ Total                │
│ Access Guide    │ [Continue]           │
│ Reviews         │                      │
└─────────────────┴──────────────────────┘
```

- Sidebar sticks below nav, 32px gap
- Same state drives main content and sidebar
- Keyboard order follows DOM (main column-first)

---

## Acceptance Criteria

### Functional
- [ ] No separate `/hostels/[slug]/rooms` route exists or is linked
- [ ] Clicking room card selects it and updates sticky bar
- [ ] Tapping "Selected ✓" deselects
- [ ] Sticky bar updates in real-time on selection change
- [ ] Back navigation preserves selected rooms and dates
- [ ] Policy strip items are not faux-interactive pills

### Mobile (360×800)
- [ ] Sticky bar always visible when room selected
- [ ] No horizontal scroll at 360px width
- [ ] Safe area padding on iPhone X+ devices
- [ ] Single column layout
- [ ] Gallery is edge-to-edge, first image 240px 3:2

### Accessibility (WCAG AA)
- [ ] All touch targets ≥ 44×44 CSS px
- [ ] Focus indicator: 2px solid sky-500, never clipped
- [ ] Selected state has text/icon + `aria-pressed="true"`
- [ ] Policy strip items linked to full policy with `aria-label`
- [ ] No color-only communicated state (e.g., sold out is opacity + text)
- [ ] Dynamic price/availability changes announced via `aria-live="polite"`
- [ ] 200% zoom: no horizontal scroll

### Trust & Safety
- [ ] Social proof ("X booked this week") only appears with backend-verified timestamp
- [ ] Booking momentum only shown with `availabilityCheckedAt` and expiry
- [ ] NO randomized "selling fast" or countdown timers
- [ ] NO unqualified "Free cancellation" - always shows exact deadline

---

## Motion Principles (Only 3 Types)

1. **Room Selection**: 150ms border/background transition, no bounce
2. **Panel Reveal**: 250ms opacity + ≤8px translateY for date/editor panels
3. **Confirmation**: 400ms checkmark reveal after verified success

**All animations must respect `prefers-reduced-motion`**.

---

## Competitive Wins vs Zostel/Hosteller

| Feature | Zostel/Hosteller Gap | Dostel Win |
|---------|---------------------|------------|
| Room availability | Hidden until date selection click | Visible on page load |
| Pricing | "From ₹X/night" only | Exact total for stay |
| Policy clarity | Collapsed accordion | Decision strip always visible |
| Trust signals | Zero reviews/momentum | Inline ratings + verified momentum |
| Mobile CTA | Footer or header | Always thumb-reachable sticky bar |
| Drop-off point | 35% from detail → guest details | <20% target with inline selection |

---

## Definition of Done
- [ ] `/hostels/[slug]/rooms` route removed
- [ ] RoomSelector embedded inline on detail page
- [ ] DecisionStrip placed below gallery, above room list
- [ ] StickyBottomBar persists selection with `env(safe-area-inset-bottom)`
- [ ] SocialProof component uses backend-verified timestamp (no fabricated)
- [ ] All WCAG AA requirements verified
- [ ] Mobile + desktop layouts tested at breakpoints
- [ ] Follow-up tickets for remaining components created

---

## Related Tickets
- DS-010: TierCard + Dostellers landing page
- DS-011: Join page + Dashboard components
- DS-012: MemberLayout + bottom nav integration
- DS-013: Badges page + unlock toast notification
- DS-014: LongStayToggle integration in booking flow