# Dostellers Journey Spec v2.1 — Community Membership

## Audit delta from v1.0 (Jul 28 2026)
- **v1.0 assumed design-only**. The code audit found:
  - No `/dostellers` route — only a static `/membership` page exists (no tier comparison, no join flow)
  - No `/dostellers/join` page
  - No `/dashboard` route (member dashboard)
  - No loyalty/tier/points/badges system anywhere in the codebase
  - No Dosteller pricing in booking flow (no long-stay toggle in search or detail)
  - No Dostellers link in navbar or mobile bottom nav
  - Navbar has "Membership" link pointing to `/membership` (static page) — needs redirect to `/dostellers`
- **v2.0 adds**: concrete route targets, component specs, API contracts, integration points with booking flow

---

## What is Dostellers?

**Dostellers** are long-stay community members — not just overnight backpackers. They unlock:
- Discounted weekly/monthly rates (20-40% off)
- Free/discounted events (trekking, music festivals, workshops)
- Community network (shared meals, skillshares, WhatsApp groups)
- Loyalty points → free nights (100 points = ₹100 off)
- Badge system (Trailblazer, Storyteller, Remote Pro, etc.)
- Early access to new properties and events
- Tree planting rewards via afforestation.org partnership

---

## Competitive gap vs Zostel / Hosteller

| Feature | Zostel | Hosteller | Dostel (target) |
|---------|--------|-----------|-----------------|
| Loyalty program | None visible | None visible | Tiered (Explorer/Nomad/Wanderer) with clear benefits |
| Long-stay pricing | No visible discount | 10-15% off weekly | 20-40% off weekly/monthly, shown upfront |
| Community features | None in app | None in app | Events feed, member dashboard, badges |
| Gamification | None | None | Points, badges, milestones |
| Member check-in | Generic | Generic | Dosteller-specific welcome, perks unlocked |

---

## Dostellers journey

```
Discover Dostellers  (/dostellers)
    |
    v
See benefits & tiers
    |
    v
Join (Free tier)  (/dostellers/join)
    |
    v
Member dashboard  (/dashboard)
    |
    +--> Book long-stay (weekly/monthly rates in booking flow)
    +--> Browse events (member pricing)
    +--> Earn points (reviews, referrals, stays)
    +--> Manage profile (badges, preferences)
```

---

## Step 1: Discover Dostellers — Route: `/dostellers`

### Audit notes
**Current**: `/membership` exists as a static page. No tier cards, no join CTA, no benefits section. Must redirect or replace.

**Action**: Create `apps/frontend/app/dostellers/page.tsx`. Leave or redirect `/membership` → `/dostellers`.

### UI (mobile-first)
```
+---------------------------------------+
|  Dostellers                           |
|  Not just a stay. A community.        |
|                                       |
|  +-- Why join? -----------------------+
|  | Up to 40% off long stays          |
|  | Free events & workshops           |
|  | Community of travellers           |
|  | Earn points → free nights         |
|  +-----------------------------------+
|                                       |
|  +-- Tiers ---------------------------+
|  | [Explorer Free] [Nomad ₹999/yr]     |
|  | [Wanderer ₹2499/yr]                    |
|  | Stacked on mobile, 3-col desktop  |
|  +-----------------------------------+
|                                       |
|  +-- Testimonial ---------------------+
|  | "Stayed 3 weeks — made friends    |
|  |  for life." — Priya, Dosteller   |
|  +-----------------------------------+
|                                       |
|  [  Join Dostellers - Free  ]         |
|  [  See membership plans  ]           |
+---------------------------------------+
```

### Tier comparison
| Feature | Explorer (Free) | Nomad ₹999/yr | Wanderer ₹2499/yr |
|---------|---------------|----------------|----------------|
| Community access | ✅ | ✅ | ✅ |
| Member events | ❌ | ✅ | ✅ |
| Discount on stays | 0% | 15% | 25% |
| Priority booking | ❌ | ❌ | ✅ |
| Exclusive events | ❌ | ❌ | ✅ |
| Tree planting rewards | ✅ | ✅ | ✅ |
| Annual savings estimate | ₹0 | ₹3,000+ (on 2 trips) | ₹7,500+ (on 3 trips) |

**UX rule**: Explorer must feel generous, not "lacking". Focus on community access as the core value. Nomad shows clear ROI ("Save ₹3,000/year on a single trip"). Wanderer is aspirational.

### TierCard component contract
```typescript
interface TierCardProps {
  tier: 'explorer' | 'nomad' | 'wanderer'
  name: string
  price: number            // 0 for explorer
  period: 'free' | '/yr'
  benefits: string[]
  highlighted?: boolean     // "Most popular" badge
  ctaLabel: string
  onSelect: () => void
  selected?: boolean
}
```

### States
| State | Visual |
|-------|--------|
| Loading | Skeleton cards |
| Loaded | Full tier comparison |
| Explorer selected | Card border highlighted (forest-500) |
| Nomad selected | Card highlighted, "Most popular" badge |
| Wanderer selected | Card highlighted, premium border treatment |

### Acceptance criteria
- [ ] Hero image: mountain/nature photography consistent with Dostel brand
- [ ] Benefits cards: emoji + headline + 1 line detail
- [ ] Tiers: single column stacked on mobile, 3-column on desktop
- [ ] "Join Dostellers - Free" CTA visible above the fold
- [ ] Testimonials: carousel with auto-scroll, pause on hover
- [ ] FAQ accordion keyboard accessible
- [ ] "See membership plans" scrolls to tiers section

---

## Step 2: Join / Sign Up — Route: `/dostellers/join`

### NEW ROUTE — does not exist

### File to create
`apps/frontend/app/dostellers/join/page.tsx`

### UI
```
+---------------------------------------+
|  Join Dostellers                      |
|                                       |
|  Select your tier                      |
|                                       |
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

### States
| State | Visual | Behaviour |
|-------|--------|-----------|
| Loading | Spinner on create button | |
| Explorer selected | "Create account" → instant access | No credit card needed |
| Nomad/Wanderer selected | "Create & pay ₹999" | Redirect to Razorpay after account creation |
| Email taken | "Already registered? Log in" link | Link to /login |
| Validation errors | Inline red text below fields | |
| Success | Redirect to /dashboard with welcome toast | |

### Acceptance criteria
- [ ] Tier cards: selectable BEFORE form appears (or tier + form on same page)
- [ ] Explorer pre-selected by default
- [ ] Password: min 8 chars, show requirements visually
- [ ] Phone: required for paid tiers, optional for Explorer
- [ ] Terms checkbox: required (CTA disabled until checked)
- [ ] Explorer: instant access — no credit card
- [ ] Nomad/Wanderer: after account creation, redirect to `/booking/membership/payment` (Razorpay)

---

## Step 3: Member Dashboard — Route: `/dashboard`

### NEW ROUTE — does not exist

### File to create
`apps/frontend/app/dashboard/page.tsx`

### Content hierarchy (priority order)
1. **Upcoming stays** (if any) — most important action item
2. **Points + tier progress** — retention loop
3. **Quick actions** — 2x2 grid: Book a stay, Browse events, Badges, Profile
4. **Recommended** — personalized event + long-stay offer
5. **Badges showcase** — last 3 unlocked

### UI (mobile)
```
+---------------------------------------+
|  Welcome back, Rahul!                  |
|  Silver Dosteller                      |
|                                       |
|  +-- Your rewards --------------------+
|  | ₹320 in rewards                    |
|  | [########...........] 320/1000    |
|  | → Silver in 680 more points       |
|  +-----------------------------------+
|                                       |
|  +-- Upcoming stay -------------------+
|  | Dostel Kasol · Mar 5-7           |
|  | Mixed Dorm · ₹654 paid            |
|  | [View details →]                  |
|  +-----------------------------------+
|                                       |
|  +-- Quick actions -------------------+
|  | [Book] [Events] [Badges] [Profile]|
|  +-----------------------------------+
|                                       |
|  +-- Badges --------------------------+
|  | [Trailblazer] [Storyteller] [Lock] |
|  +-----------------------------------+
+---------------------------------------+
```

### Points model
- **Earn**: 10 points per ₹100 spent on stays, 50 points per review, 100 points per referral
- **Burn**: 100 points = ₹100 off next booking
- **Display**: "You have ₹320 in rewards" (₹-equivalent, not abstract points)
- **Progress bar**: current → next tier threshold

### Dashboard component contracts
```typescript
// apps/frontend/components/MemberHeader.tsx
interface MemberHeaderProps {
  name: string
  tier: 'bronze' | 'silver' | 'gold'
  avatar?: string
}

// apps/frontend/components/PointsBar.tsx
interface PointsBarProps {
  current: number      // e.g. 320
  nextThreshold: number // e.g. 1000
  tier: string         // e.g. "Silver"
  rewardValue: number  // e.g. 320 (₹ eq)
}

// apps/frontend/components/QuickActions.tsx
interface QuickActionsProps {
  actions: Array<{
    label: string
    icon: string
    href: string
  }>
}

// apps/frontend/components/BadgeGrid.tsx
interface BadgeGridProps {
  badges: Array<{
    id: string
    name: string
    icon: string
    unlocked: boolean
    criteria?: string
  }>
}
```

### States
| State | Visual |
|-------|--------|
| Loading | Skeleton: header shimmer, points bar pulse, 2 card skeletons |
| Empty (no stays) | "No upcoming stays — start your first trip" with CTA to `/hostels` |
| Loaded | Full dashboard |
| Error | "Couldn't load dashboard" + retry |

### Mobile bottom nav update
Add "Dashboard" tab to mobile bottom nav when logged in:
```
[🏠 Home] [🔍 Search] [📋 Dashboard] [🎉 Events] [👤 Profile]
```

### Acceptance criteria
- [ ] Points bar: shows ₹ equivalent + progress to next tier
- [ ] Tier badge: color-coded (Bronze/forest-100, Silver/stone-400, Gold/sunset)
- [ ] Quick actions: 2x2 on mobile, 4 in a row on desktop
- [ ] Upcoming stays link to `/dashboard/bookings/[id]`
- [ ] Recommended uses HostelCard component (reuse)
- [ ] Mobile bottom nav: includes "Dashboard" tab when logged in
- [ ] Dashboard loads in < 2s on 3G

---

## Step 4: Long-Stay Booking (Dosteller pricing in booking flow)

### Integration points with booking flow

#### 1. Search results (`/hostels`)
- Add badge on cards for 7+ night eligible stays: "Dosteller: up to 40% off"
- Only shown if user is a Dosteller (requires auth check)
- Non-members see: "Unlock Dosteller pricing" badge (links to `/dostellers`)

#### 2. Detail page (`/hostels/[slug]`)
- `LongStayToggle` component when date range >= 7 nights
- Shows weekly/monthly breakdown alongside nightly pricing
```diff
+ Nightly:  ₹327/night
+ Weekly:   ₹1,950 (₹279/night - 15% off) ← Dostellers-only
+ Monthly:  ₹6,540 (₹218/night - 33% off) ← Dostellers-only
```

#### 3. Price breakdown (review step)
- Line item: "Dosteller discount: -₹XXX"
- Only visible for logged-in Dostellers

#### 4. Non-member prompt
- Inline card on detail page (NOT a modal): "Save up to 40% on long stays — join Dostellers free"
- CTA: "Learn more" → `/dostellers`

### LongStayToggle component contract
```typescript
interface LongStayToggleProps {
  onToggle: (active: boolean) => void
  active: boolean
  dostellerDiscount?: number   // e.g. 40
  weeklyPrice?: number
  monthlyPrice?: number
  isDosteller: boolean
}
```

### States
| State | Visual |
|-------|--------|
| Not available (< 7 nights) | Hidden entirely |
| Available (7+ nights), Dosteller | Toggle with weekly/monthly rates shown |
| Available (7+ nights), non-Dosteller | "Unlock Dosteller pricing" inline prompt |

---

## Step 5: Badge System

### Badges v1 (6 badges)
| Badge | Criteria | Icon |
|-------|----------|------|
| Trailblazer | Book 3 stays | 🥾 |
| Storyteller | Write 3 reviews | ✍️ |
| Social Butterfly | Attend 2 events | 🦋 |
| Remote Pro | Book workation 2x | 💻 |
| Hometown Hero | Stay 30+ nights total | 🏠 |
| Early Adopter | Joined in first 6 months | ⭐ |

### Display
- Dashboard: last 3 unlocked badges in a row
- Badges page (`/dashboard/badges`): full grid
- Locked: grayscale + criteria text
- Unlocked: full color

### Badge unlock moment
- **Toast notification** (NOT modal): "🎉 You unlocked Trailblazer!" — auto-dismiss 5s
- Dashboard badge pulses gently on first visit after unlock
- No interruptive modal — just a warm inline celebration

---

## Full acceptance criteria (Dostellers journey)

### Routes
- [ ] `/dostellers` — landing page with benefits, tiers, testimonials
- [ ] `/dostellers/join` — tier selection + signup form
- [ ] `/dashboard` — member dashboard (protected route)
- [ ] `/dashboard/bookings` — past/upcoming bookings (protected)
- [ ] `/dashboard/badges` — badge grid (protected)

### Components
- [ ] `TierCard` — pricing tier selector (Bronze/Silver/Gold)
- [ ] `PointsBar` — progress toward next tier
- [ ] `BadgeGrid` — locked/unlocked badge display
- [ ] `MemberHeader` — name + tier + points summary
- [ ] `QuickActions` — 2x2 grid of dashboard links
- [ ] `LongStayToggle` — weekly/monthly rate display (shared with booking flow)
- [ ] `SocialProof` — "X booked this week" (shared with booking flow)

### Integration
- [ ] Non-member sees Dosteller pricing but cannot access it (prompt to join)
- [ ] Points: 10 per ₹100 spent, 100 points = ₹100 off
- [ ] Dashboard shows in mobile bottom nav when logged in
- [ ] Navbar has "Dostellers" link (desktop) / tab (mobile)
- [ ] All pages mobile-first (single column < 768px)
- [ ] All CTAs touch target >= 44px
- [ ] All text meets WCAG AA contrast
- [ ] Motion: only use the 3 prescribed animations (card lift, page fade-in, button press) and respect `prefers-reduced-motion`

### Backend API contracts
```graphql
type Mutation {
  createDosteller(input: CreateDostellerInput!): DostellerAccount
  upgradeMembership(tier: Tier!): Membership
  redeemPoints(bookingId: ID!, points: Int!): Booking
}

type Query {
  dostellerDashboard: DostellerDashboard
  badges: [Badge]
}

input CreateDostellerInput {
  fullName: String!
  email: String!
  phone: String
  password: String!
  tier: Tier!         # bronze/silver/gold
}

type DostellerDashboard {
  member: MemberProfile
  points: PointsSummary
  upcomingStays: [Booking]
  badges: [Badge]
  recommendedEvents: [Event]
}

type PointsSummary {
  current: Int       # points
  rewardValue: Int   # ₹ equivalent
  nextTier: String
  pointsToNextTier: Int
}

type Badge {
  id: ID!
  name: String!
  icon: String!
  unlocked: Boolean!
  unlockedAt: String
  criteria: String
}

type DostellerAccount {
  id: ID!
  tier: Tier!
  memberSince: String!
}
```

---

## Implementation order

| Phase | What | Files | Depends on |
|-------|------|-------|-----------|
| P1-a | Dostellers landing page | `app/dostellers/page.tsx`, `TierCard.tsx` | DS-001 tokens |
| P1-b | Join page | `app/dostellers/join/page.tsx` | P1-a |
| P1-c | Dashboard page | `app/dashboard/page.tsx`, `MemberHeader.tsx`, `PointsBar.tsx`, `QuickActions.tsx`, `BadgeGrid.tsx` | P1-b, auth |
| P1-d | Navbar + bottom nav links | `Navbar.tsx` | P1-a |
| P1-e | LongStayToggle in booking flow | `LongStayToggle.tsx`, detail page, price breakdown | Booking flow (DS-002/003) |
| P1-f | Badges page | `app/dashboard/badges/page.tsx` | P1-c |

---

## New files summary (Dostellers only)

### Route pages (5 new)
| Route | File |
|-------|------|
| `/dostellers` | `app/dostellers/page.tsx` |
| `/dostellers/join` | `app/dostellers/join/page.tsx` |
| `/dashboard` | `app/dashboard/page.tsx` |
| `/dashboard/bookings` | `app/dashboard/bookings/page.tsx` |
| `/dashboard/badges` | `app/dashboard/badges/page.tsx` |

### Components (6 new)
| Component | File |
|-----------|------|
| `TierCard` | `components/TierCard.tsx` |
| `PointsBar` | `components/PointsBar.tsx` |
| `BadgeGrid` | `components/BadgeGrid.tsx` |
| `MemberHeader` | `components/MemberHeader.tsx` |
| `QuickActions` | `components/QuickActions.tsx` |
| `LongStayToggle` | `components/LongStayToggle.tsx` |

### Updated components (1)
| Component | Changes |
|-----------|---------|
| `Navbar.tsx` | Add "Dostellers" link (desktop), "Dashboard" tab (mobile bottom nav when logged in) |
