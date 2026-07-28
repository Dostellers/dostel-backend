# DS-005: Dostellers Community UX — Journey Refinement (Updated v2)

**Assignee**: Product Designer (UX)  
**Priority**: P1  
**Depends on**: DS-002 (booking flow patterns), DS-001 (tokens), dostellers-journey.md v2.0

---

## Code audit findings (new — not in v1)

1. **No `/dostellers` route** — only a static `/membership` page exists (no tier cards, no benefits, no join CTA)
2. **No `/dostellers/join` page** — no signup flow, no tier selection
3. **No `/dashboard` route** — no member dashboard anywhere
4. **No loyalty/tier/points/badges** — zero implementation in codebase
5. **No Dosteller pricing in booking flow** — no LongStayToggle, no weekly/monthly rate display
6. **No Dostellers link in navbar or mobile bottom nav** — "Membership" link in nav points to static page
7. **No auth context** — no login/session handling in frontend (needed for protected dashboard routes)

---

## UX work required (updated)

### 1. Tier comparison — COMPONENT TO CREATE
`apps/frontend/components/TierCard.tsx`
- 3 tiers: Bronze (free), Silver (₹999/yr), Gold (₹2499/yr)
- Mobile: single column stacked cards
- Desktop: 3-column layout
- Bronze feels generous (not "lacking") — community access is the core value
- Silver shows clear ROI: "Save ₹3,000+/year"
- Gold is aspirational: "Priority booking + exclusive events"
- Props: `TierCardProps { tier, name, price, period, benefits, highlighted, ctaLabel, onSelect, selected }`

### 2. Points-to-rewards mental model — COMPONENT TO CREATE
`apps/frontend/components/PointsBar.tsx`
- Earn: 10 points per ₹100 spent, 50 per review, 100 per referral
- Burn: 100 points = ₹100 off next booking
- **Display**: "You have ₹320 in rewards" (₹-equivalent, not abstract numbers)
- Progress bar: current → next tier threshold

### 3. Badge unlock moment
- Toast notification (NOT modal): auto-dismiss 5s
- Dashboard badge pulses on first visit after unlock
- No interruptive modals

### 4. Dosteller pricing in booking flow (2 touchpoints)
- Search results: "Dosteller: up to 40% off" badge on eligible cards
- Detail page: `LongStayToggle` when date range >= 7 nights
- Non-member prompt: inline card on detail page (not modal)

### 5. Dashboard content hierarchy — ROUTE + COMPONENTS TO CREATE
Priority order:
1. Upcoming stays (most important)
2. Points + tier progress (retention)
3. Quick actions (2x2 grid)
4. Recommended (personalized)
5. Badges showcase

**Components**: `MemberHeader.tsx`, `PointsBar.tsx`, `QuickActions.tsx`, `BadgeGrid.tsx`

### 6. Mobile bottom nav update — FILE TO UPDATE
`apps/frontend/components/Navbar.tsx`
- Add "Dashboard" tab to mobile bottom nav when logged in
- Add "Dostellers" link to desktop dropdown (or as nav item)

---

## New routes
| Route | File | Priority |
|-------|------|----------|
| `/dostellers` | `app/dostellers/page.tsx` | P1 |
| `/dostellers/join` | `app/dostellers/join/page.tsx` | P1 |
| `/dashboard` | `app/dostellers/dashboard/page.tsx` | P1 |
| `/dashboard/bookings` | `app/dashboard/bookings/page.tsx` | P2 |
| `/dashboard/badges` | `app/dashboard/badges/page.tsx` | P2 |

## New components (6)
| Component | File | Used in |
|-----------|------|---------|
| `TierCard` | `components/TierCard.tsx` | `/dostellers`, `/dostellers/join` |
| `PointsBar` | `components/PointsBar.tsx` | `/dashboard` |
| `BadgeGrid` | `components/BadgeGrid.tsx` | `/dashboard`, `/dashboard/badges` |
| `MemberHeader` | `components/MemberHeader.tsx` | `/dashboard` |
| `QuickActions` | `components/QuickActions.tsx` | `/dashboard` |
| `LongStayToggle` | `components/LongStayToggle.tsx` | `/hostels/[slug]` (detail page) |

---

## Acceptance criteria

- [ ] `/dostellers` landing with tier comparison + benefits + testimonials
- [ ] `/dostellers/join` with tier selection + signup form
- [ ] `/dashboard` with points bar + upcoming stays + quick actions + badges
- [ ] Bronze (free) tier: instant access, no credit card
- [ ] Points displayed as ₹-equivalent, not abstract numbers
- [ ] Badge unlock: toast notification, not modal
- [ ] LongStayToggle on detail page when 7+ nights
- [ ] Non-members see "Unlock Dosteller pricing" prompt (inline, not modal)
- [ ] Mobile bottom nav: "Dashboard" tab when logged in
- [ ] All CTAs touch target >= 44px
- [ ] Mobile-first: single column < 768px

---

## References

- `dostellers-journey.md` — v2.0 spec with implementation order
- `booking-flow.md` — v3.0 spec (Dosteller pricing integration points)
- `Navbar.tsx` — needs bottom nav + desktop nav updates
- `apps/frontend/app/membership/page.tsx` — existing static page (replace or redirect)
