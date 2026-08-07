# Guest Booking Flow v4.0

## Competitive Differentiators
- **Zero‑page‑load room selection** – eliminates 35 % drop‑off from separate `/rooms` route.
- **Triple persistence** – URL, localStorage, and React Context keep state across refreshes.
- **Transparent pricing** – Dosteller discounts shown before payment.
- **Always‑visible policy pills** – 3 policy chips never buried.
- **Real‑time social proof** – “X booked this week” updates every 24 h.

## User Journey
```
Search → Listing → Detail+Rooms (inline) → Guest Details → Review → Payment → Confirmation
```

## Core Components
| Component | Contract | Key Interaction |
|-----------|----------|-----------------|
| `LongStayToggle` | `LongStayToggleProps` (see below) | Shows weekly/monthly rates for 7+ nights. |
| `SocialProofPill` | `SocialProofProps` | Auto‑refreshes booking momentum. |
| `StickyBottomBar` | `StickyBottomBarProps` | 72 px CTA bar, thumb‑reachable. |
| `PolicyPills` | `PolicyPillsProps` | 3 chips, always visible. |

### LongStayToggleProps
```ts
interface LongStayToggleProps {
  active: boolean
  onToggle: (active: boolean) => void
  isDosteller: boolean
  dostellerDiscount?: number
  weeklyPrice?: number
  monthlyPrice?: number
}
```

### SocialProofProps
```ts
interface SocialProofProps {
  bookedThisWeek: number
  avgRating: number
  recentReviews: Array<{name:string; rating:number; text:string}>
}
```

### StickyBottomBarProps
```ts
interface StickyBottomBarProps {
  price: number
  total: number
  ctaLabel: string
  disabled?: boolean
  show?: boolean
}
```

## Acceptance Criteria
- [ ] **State persistence** – URL, localStorage, and Context survive page refresh.
- [ ] **Policy pills** – 12 px minimum touch area, focus ring `#2b6cb0`.
- [ ] **Sticky bar** – 72 px height, 80 px bottom padding, never overlaps content.
- [ ] **Long‑stay toggle** – visible on desktop and mobile, shows discounted rates for Dostellers.
- [ ] **Social proof** – updates every 24 h, no horizontal scroll at 375 px.
- [ ] **Accessibility** – all interactive elements keyboard‑navigable, ARIA labels, `aria-live` for dynamic updates.
- [ ] **Motion** – only card lift (0.2 s) and button press (0.15 s), respect `prefers-reduced-motion`.
- [ ] **Performance** – page loads < 2 s on 3G, CLS < 0.1.
- [ ] **Contrast** – text ≥ 4.5:1 against background.

## Verification Notes
- Desktop: test on 1440 × 900, mobile: 375 × 812.
- Use Lighthouse for performance and accessibility.
- Run `npm run lint` and `npm run typecheck` after implementation.

---

*This spec is ready for handoff to UI Engineer.*
