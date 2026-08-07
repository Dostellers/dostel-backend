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

## Competitive Gaps vs Zostel / Hosteller (Dostel Wins)

| Feature | Zostel | Hosteller | Dostel Performance |
|---------|--------|-----------|-------------------|
| Loyalty program | None visible | None visible | Tiered (Explorer/Nomad/Wanderer) with clear benefits + points tracking |
| Long-stay pricing | No visible discount | 10-15% off weekly | 20-40% off weekly/monthly, shown upfront in search/listings |
| Community features | None in app | None in app | Events feed, member dashboard, badges |
| Gamification | None | None | Points (10/₹100 spent), badges, milestones |
| Member check-in | Generic | Generic | Dosteller-specific welcome with perks unlocked |
| Social proof integration | None | None | Real-time booking momentum on cards + detail page |
| Price transparency | Optional | Optional | Full breakdown at review step |

## Dostel Brand Compliance

- **Visual**: Uses mountain-community palette (forest greens, sunset amber, warm earth), Playfair+Inter fonts, warm off-white (`#fefcf5`)
- **Motion**: Only 3 prescribed animations: card lift (0.2s), page fade-in (0.1s), button press (0.15s)
- **Accessibility**: WCAG AA contrast verified, focus rings (Sky-500), reduced-motion respect
- **Touch**: All CTAs have 44px minimum targets, sticky bottom bar for thumb zone

## Dostellers Journey Flow

```
Discover Dostellers (/dostellers) → See benefits & tiers 
  → Join (Free tier) (/dostellers/join) 
  → Member dashboard (/dashboard)
    +--> Book long-stay (weekly/monthly rates in booking flow)
    +--> Browse events (member pricing)
    +--> Earn points (reviews, referrals, stays)
    +--> Manage profile (badges, preferences)
```

---

## Step 1: Discover Dostellers — `/dostellers`

### Quick Audit
- **Current**: `/membership` exists as a static page. Must redirect or replace with tier comparison + community benefits.

### UI (mobile-first)

**Hero Section**
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
|  | [Explorer Free] [Nomad ₹999/yr]   |
|  | [Wanderer ₹2499/yr]               |
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

### Tier Comparison Table
| Feature | Explorer (Free) | Nomad ₹999/yr | Wanderer ₹2499/yr |
|---------|-----------------|--------------|-------------------|
| Community access | ✅ | ✅ | ✅ |
| Member events | ❌ | ✅ | ✅ |
| Discount on stays | 0% | 15% | 25% |
| Priority booking | ❌ | ❌ | ✅ |
| Exclusive events | ❌ | ❌ | ✅ |
| Tree planting rewards | ✅ | ✅ | ✅ |

**UX Rule**: Presentation follows community-first mindset → never frames selection as lacking options, always frames as generosity. Explorer shows "Free community access". Nomad shows ROI: "Save ₹3,000/year on a single trip". Wanderer is aspirational.

### TierCard Component Contract
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

### Acceptance Criteria
- [ ] Hero image: mountain/nature photography consistent with Dostel brand (no stock generic imagery)
- [ ] Benefits cards: emoji + headline + 1 line detail (e.g., "🎉 Free events")
- [ ] Tiers: single column stacked on mobile, 3-column on desktop (responsive)
- [ ] "Join Dostellers - Free" CTA visible above the fold (72px tall)
- [ ] Testimonials: carousel with auto-scroll, pause on hover, keyboard accessible
- [ ] "See membership plans" scrolls to tiers section with smooth scroll
- [ ] Tier comparison table fully responsive
- [ ] All text meets WCAG AA contrast
- [ ] Motion: uses only 3 prescribed animations, respects `prefers-reduced-motion`

---

## Step 2: Join / Sign Up — `/dostellers/join`

### UI (mobile-first)

```
+---------------------------------------+
|  Join Dostellers                      |
|                                       |
|  Select your tier                      |
|                                       |
|  [Explorer] [Nomad ✓] [Wanderer]      |
|    Free     ₹999/yr   ₹2499/yr        |
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
| Tier Selection | Cards selectable | Explorer selected → "Create account" → instant access (no credit card) |
| Payment Flow | Nomad/Wanderer selected | "Create & pay ₹999" → redirect to Razorpay after account creation |
| Validation | Errors inline below fields | Typing feedback, real-time validation |
| Success | Redirect to `/dashboard` with welcome toast | Auto-detect Dosteller tier based on account |

### Action Contracts
- **Tier Card Select**: `selected` state = border-500 (forest-500) + "Most popular" badge on Nomad
- **Form Validation**: Inline red text on validation errors
- **Terms Checkbox**: Required before CTA enabled

### Acceptance Criteria
- [ ] Tier cards selectable BEFORE form appears (or tier + form on same page)
- [ ] Explorer pre-selected by default
- [ ] Password: min 8 chars, show requirements visually (no regex patterns unless required)
- [ ] Phone: required for paid tiers, optional for Explorer
- [ ] Terms checkbox: required (CTA disabled until checked)
- [ ] Explorer: instant access — no credit card
- [ ] Nomad/Wanderer: after account creation, redirect to `/booking/membership/payment` (Razorpay)
- [ ] Success toast: "Welcome to Dostel! Your tier unlocks perks and pricing discounts"
- [ ] API integration: `createDosteller` mutation used correctly
- [ ] All text matches brand voice (warm, social, community)

---

## Step 3: Member Dashboard — `/dashboard`

### Content Hierarchy Priority
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

### Points Model
- **Earn**: 10 points per ₹100 spent on stays, 50 points per review, 100 points per referral
- **Burn**: 100 points = ₹100 off next booking
- **Display**: "You have ₹320 in rewards" (₹-equivalent, not abstract points)
- **Progress bar**: current → next tier threshold

---

## Step 4: Long-Stay Booking (Dosteller pricing in booking flow)

### Search Results Integration
- Add badge on cards for 7+ night eligible stays: "Dosteller: up to 40% off"
- Only shown if user is a Dosteller (requires auth check)
- Non-members see: "Unlock Dosteller pricing" badge (links to `/dostellers`)

### Detail Page Integration
- `LongStayToggle` component when date range >= 7 nights
- Shows weekly/monthly breakdown alongside nightly pricing
- Discount line item appears on review step

### Acceptance Criteria
- [ ] SocialProof badge visible on every property card + detail page
- [ ] Social proof updates live (every 24h, offline-first)
- [ ] Price breakdown shows Dosteller discount line item (e.g., "-₹XXX")
- [ ] Weekly/monthly pricing displayed for 7+ nights
- [ ] Non-member prompt: inline card (not modal) with CTA to `/dostellers`

### Points Integration
- Earn points on every stay, review, referral
- Burn points: 100 points = ₹100 off
- Display "You have ₹X in rewards" in dashboard header

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

### Badge Unlock Moment
- **Toast notification** (NOT modal): "🎉 You unlocked Trailblazer!" — auto-dismiss 5s
- Dashboard badge pulses gently on first visit after unlock
- No interruptive modal — just a warm inline celebration

---

## Component Contracts

### LongStayToggle
```typescript
interface LongStayToggleProps {
  onToggle: (active: boolean) => void;
  active: boolean;
  dostellerDiscount?: number;
  weeklyPrice?: number;
  monthlyPrice?: number;
  isDosteller: boolean;
}
```

### SocialProof
```typescript
interface SocialProofProps {
  bookedThisWeek: number;
  avgRating: number;
  recentReviews: Array<{name: string; rating: number; text: string}>;
}
```

### PointsBar
```typescript
interface PointsBarProps {
  current: number;      // e.g. 320
  nextThreshold: number; // e.g. 1000
  tier: string;          // e.g. "Silver"
  rewardValue: number;   // e.g. 320 (₹ eq)
}
```

### BadgeGrid
```typescript
interface BadgeGridProps {
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    unlocked: boolean;
    unlockedAt: string;
    criteria?: string;
  }>;
}
```

### MemberHeader
```typescript
interface MemberHeaderProps {
  name: string;
  tier: 'bronze' | 'silver' | 'gold';
  avatar?: string;
}
```

### QuickActions
```typescript
interface QuickActionsProps {
  actions: Array<{
    label: string;
    icon: string;
    href: string;
  }>;
}
```

---

## Acceptance Criteria (All)

- [ ] **Routes** 
  - [ ] `/dostellers` — landing page with benefits, tiers, testimonials
  - [ ] `/dostellers/join` — tier selection + signup form
  - [ ] `/dashboard` — member dashboard (protected route)
  - [ ] `/dashboard/bookings` — past/upcoming bookings (protected)
  - [ ] `/dashboard/badges` — badge grid (protected)
  
- [ ] **Components** 
  - [ ] `TierCard` — pricing tier selector (Bronze/Silver/Gold)
  - [ ] `PointsBar` — progress toward next tier showing ₹-equivalent
  - [ ] `BadgeGrid` — locked/unlocked badge display
  - [ ] `MemberHeader` — name + tier + points summary
  - [ ] `QuickActions` — 2x2 on mobile, 4 in a row on desktop
  - [ ] `LongStayToggle` — weekly/monthly rate display (shared with booking flow)
  - [ ] `SocialProof` — "X booked this week" (shared with booking flow)
  
- [ ] **Integration** 
  - [ ] Non-member sees Dosteller pricing but cannot access it (prompt to join)
  - [ ] Points: 10 per ₹100 spent, 100 points = ₹100 off
  - [ ] Dashboard shows in mobile bottom nav when logged in
  - [ ] Navbar has "Dostellers" link (desktop) / tab (mobile)
  - [ ] All pages mobile-first (single column < 768px)
  - [ ] All CTAs touch target >= 44px
  - [ ] All text meets WCAG AA contrast
  - [ ] Motion: only use the 3 prescribed animations (card lift, page fade-in, button press) and respect `prefers-reduced-motion`
  - [ ] API contracts match GraphQL schema

## References
- Competitive gap analysis: `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md`
- Design tokens: `.paperclip/design/system/design-tokens.md`
- Brand guidelines: `DESIGN_SYSTEM.md`
- Implementation order: See DS-005, DS-007 tickets