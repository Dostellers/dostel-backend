# Dostellers Journey Spec v3.0 – Loyalty & Long-Stay

## Overview
Dostellers are long-stay community members. This spec adds **TierCard**, **PointsBar**, **BadgeGrid**, **MemberHeader**, **QuickActions**, **MemberLayout**, and **BadgesPage**.

Competitive win: Zostel/Hosteller have no visible loyalty or pricing distinction. Dostel shows tiered benefits, long-stay discounts (20–40%), and gamified community badges.

---

## Route Pages

| Route | Page | Key Components |
|---|---|---|
| `/dostellers` | Landing page | Hero, BenefitsList, TierCard, TestimonialCarousel, FAQAccordion |
| `/dostellers/join` | Tier select + signup | TierCard, JoinForm |
| `/dashboard` | Member dashboard | MemberLayout, PointsBar, UpcomingStayCard, QuickActions, BadgeGrid |
| `/dashboard/bookings` | Past & upcoming stays | BookingsList, StayCard |
| `/dashboard/badges` | Full badge grid | BadgeGrid (all badges) |
| `/dashboard/profile` | Profile & settings | MemberHeader, SettingsForm |

---

## Component Contracts

### TierCard
File: `apps/frontend/components/TierCard.tsx`

```tsx
interface TierCardProps {
  tier: 'explorer' | 'nomad' | 'wanderer';
  name: string;
  price: number; // 0 for explorer
  period: 'free' | '/yr';
  benefits: string[];
  highlighted?: boolean;
  selected?: boolean;
  onSelect: () => void;
}
```

States:
- Default: stone-200 bg, stone-600 text
- Selected: forest-500 border, sky-500 text
- Hover: elevation-1 shadow
- Mobile: full-width, stacked vertically

### PointsBar
File: `apps/frontend/components/PointsBar.tsx`

```tsx
interface PointsBarProps {
  current: number;      // points
  nextThreshold: number; // tier threshold
  rewardValue: number;  // ₹ equivalent
  tier: 'bronze' | 'silver' | 'gold';
}
```

Visual:
- Progress track: stone-200 bg, reward gradient (bronze: #cd7f32 → silver: #c0c0c0 → gold: #ffd700)
- Text: "₹{rewardValue} in rewards"
- Subtext: "→ {tier} in {pointsToNext} more points"

### BadgeGrid
File: `apps/frontend/components/BadgeGrid.tsx`

```tsx
interface BadgeGridProps {
  badges: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    unlocked: boolean;
    criteria?: string;
  }>;
}
```

States:
- Unlocked: full color
- Locked: grayscale, criteria text below

### MemberHeader
File: `apps/frontend/components/MemberHeader.tsx`

```tsx
interface MemberHeaderProps {
  name: string;
  tier: 'bronze' | 'silver' | 'gold';
  avatar?: string;
}
```

Visual hierarchy:
- H1: "Welcome back, {name}"
- Tier badge: tier-color pill with tier name
- Points summary: "₹{rewardValue} in rewards" → progress bar

### QuickActions
File: `apps/frontend/components/QuickActions.tsx`

```tsx
interface QuickActionsProps {
  actions: Array<{ label: string; icon: React.ReactNode; href: string }>;
}
```

Layout:
- Mobile: 2x2 grid, 44px touch target
- Desktop: 4 in a row

### MemberLayout
File: `apps/frontend/app/dashboard/layout.tsx`

```tsx
interface MemberLayoutProps { children: React.ReactNode }
```

- Wraps all `/dashboard/*` routes
- Provides context: user, tier, points
- Mobile: bottom tab bar when logged in

---

## Motion Principles (v3.0)

Only 3 animations from design tokens:

1. **Page Fade-In**: `opacity 0 → 1` + `translateY(8px → 0)`, 400ms ease-out, stagger children 80ms
2. **Card Lift**: `translateY(-2px)` + shadow-md, 250ms ease-out
3. **Button Press**: `scale(1 → 0.97)`, 150ms ease-in reverse

All animations must respect `prefers-reduced-motion`.

---

## Acceptance Criteria

### Functional
- [ ] Tiers display correct pricing and benefits
- [ ] Explorer pre-selected on join page
- [ ] Phone optional for Explorer, required for Nomad/Wanderer
- [ ] Points: 10 per ₹100 spent, 100 points = ₹100 off
- [ ] Dashboard shows upcoming stays if any, else empty state CTA
- [ ] Bottom tab bar shows "Dashboard" when logged in

### Mobile
- [ ] All touch targets ≥ 44px
- [ ] Single column layout at < 768px
- [ ] Bottom tab bar fixed, 60px height

### Accessibility
- [ ] Tier cards keyboard navigable (Tab → Space/Enter selects)
- [ ] Focus ring: 2px solid sky-500
- [ ] ARIA labels on all interactive elements
- [ ] Badge unlock toast announced via `aria-live="polite"`

### Performance
- [ ] Page load < 2s on 3G
- [ ] Skeleton loaders for loading states

---

## Integration Points

1. **Navbar** → Add "Dostellers" link (desktop), "Dashboard" tab (mobile when logged in)
2. **Booking Flow** → `LongStayToggle` shows weekly/monthly rates when user is Dosteller and stay ≥ 7 nights
3. **Price Breakdown** → Line item "Dosteller discount: -₹XXX" for logged-in Dostellers
4. **Property Card** → Badge "Dosteller: up to 40% off" for eligible properties

---

## Definition of Done
- [ ] All 6 new components implemented
- [ ] All 5 new route pages created
- [ ] Token colors applied (DS-001)
- [ ] Animation guidelines enforced
- [ ] WCAG AA contrast verified
- [ ] Mobile layout verified
- [ ] Follow-up tickets linked

---

## Follow-up Tickets
- **DS-010**: Implement TierCard component + Dostellers landing page
- **DS-011**: Implement MemberHeader, PointsBar, QuickActions, BadgeGrid + Dashboard page
- **DS-012**: MemberLayout + bottom nav integration
- **DS-013**: Badges page + unlock toast notification
- **DS-014**: LongStayToggle integration in booking detail page
- **DS-015**: Non-member Dosteller pricing prompt