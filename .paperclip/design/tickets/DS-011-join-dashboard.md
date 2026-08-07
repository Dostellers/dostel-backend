# DS-011: Join Page + MemberDashboard Components

**Assignee**: UI Engineer  
**Priority**: P0  
**Depends on**: DS-010 (TierCard), DS-002 (booking flow)  
**Estimate**: 2 heartbeats

---

## Deliverables

### 1. /dostellers/join Page
**File**: `apps/frontend/app/dostellers/join/page.tsx`

**UI**:
```
+---------------------------------------+
|  Join Dostellers                      |
|                                       |
|  Select your tier                      |
|  [Explorer] [Nomad ✓] [Wanderer]      |
|   Free     ₹999/yr   ₹2499/yr        |
|                                       |
|  Your details                         |
|  Full name    [________________]      |
|  Email        [________________]      |
|  Phone        [________________]      |
|  Password     [________________]      |
|                                       |
|  [v] I accept terms & privacy policy  |
|                                       |
|  [  Create my Dosteller account  ]    |
+---------------------------------------+
```

**Rules**:
- Explorer default selected
- Terms checkbox required
- Password: min 8 chars
- Phone: optional for Explorer, required for paid tiers
- Explorer: instant access (no payment)
- Nomad/Wanderer: redirect to Razorpay after account creation

---

### 2. Dashboard Components

#### a. MemberHeader (`components/MemberHeader.tsx`)
```tsx
interface MemberHeaderProps {
  name: string;
  tier: 'bronze' | 'silver' | 'gold';
  avatar?: string;
}
```
- Avatar (circle, 48px) + "Welcome back, {name}" (H1)
- Tier badge: color-coded (Bronze/forest-100, Silver/stone-400, Gold/sunset)
- "Create my Dosteller account" CTA below

#### b. PointsBar (`components/PointsBar.tsx`)
```tsx
interface PointsBarProps {
  current: number;
  nextThreshold: number;
  rewardValue: number;
  tier: 'bronze' | 'silver' | 'gold';
}
```
- "₹{rewardValue} in rewards" header
- Progress bar (gradient: bronze→silver→gold)
- "→ {tier} in {pointsToNext} more points" subtext

#### c. QuickActions (`components/QuickActions.tsx`)
```tsx
interface QuickActionsProps {
  actions: Array<{ label: string; icon: string; href: string }>;
}
```
- 4 tiles: Book a stay, Browse events, Badges, Profile
- Mobile: 2x2 grid, desktop: 4 in a row

#### d. BadgeGrid (`components/BadgeGrid.tsx`)
```tsx
interface BadgeGridProps {
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    unlocked: boolean;
    criteria?: string;
  }>;
}
```
- Locked: grayscale + criteria text
- Unlocked: full color + pulse on first visit after unlock

---

## Acceptance Criteria

| Category | Requirement |
|---|---|
| Functional | Explorer instant access; paid tiers redirect to Razorpay; password min 8 chars |
| Mobile | Single column; bottom nav includes Dashboard tab when logged in |
| Accessibility | Tab order: tier cards → form fields → checkbox → submit; focus rings; `aria-invalid` for errors |
| Performance | Dashboard page load < 2s on 3G |
| Security | Password masked; terms linked externally |

---

## Verification Checklist
- [ ] Join page form validates all fields
- [ ] Explorer account creation completes without payment
- [ ] Dashboard components render mock data correctly
- [ ] Badge pulses on unlock
- [ ] Keyboard can reach all dashboard quick actions

---

## Next Tickets
- **DS-013**: MemberLayout + bottom nav integration
- **DS-014**: LongStayToggle integration in booking flow
- **DS-015**: Badges page + unlock toast notification