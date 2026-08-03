# Booking Flow Specification v4.0

## Competitive Differentiators (Dostel Wins)
1. **Single-Step Booking**: Eliminates 35% drop-off from separate room selection
2. **Persistent Commitment**: Dual persistence (URL + localStorage)
3. **Transparent Pricing**: Dosteller discounts visible upfront
4. **Policy Transparency**: 3 always-visible policy pills
5. **Social Proof Integration**: Real-time booking momentum stats

## User Journey
```
Search -> Listing -> Detail+Rooms (inline) -> Guest Details
  -> Review (1-5 stars + policy reminder) -> Payment
  -> Confirmation (wait indicator + dosteller badge)
```

## Core Components

### 1. Long Stay Toggle
```typescript
interface LongStayToggleProps {
  onToggle: (active: boolean) => void
  active: boolean
  dostellerDiscount?: number
  weeklyPrice?: number
  monthlyPrice?: number
  isDosteller: boolean
}
```

| State | Visual | Interaction |
|-------|--------|-------------|
| Inactive | Grayed Out | "Show options" button |
| Active | Green highlight | Week/Month prices shown |

### 2. Social Proof Pill
```typescript
interface SocialProofProps {
  bookedThisWeek: number
  avgRating: number
  recentReviews: Array<{name: string; rating: number; text: string}>}
```

### 3. Sticky Bottom Bar
```typescript
interface StickyBottomBarProps {
  price: number
  total: number
  ctaLabel: string
  disabled?: boolean
  show?: boolean
}
```

## Acceptance Criteria
- [ ] Long Stay Toggle visible on desktop/handheld (16:9/768px+)
- [ ] Social Proof updates dynamically (auto-refresh every 24h)
- [ ] Policy pills maintain 12px minimum touch area
- [ ] Sticky bar height: exact 72px (non-negotiable)
- [ ] Dosteller discount shown as "Save ₹XXX" label
- [ ] All interactions under 300ms latency

## Implementation Roadmap
1. Phase 1: Long Stay Toggle + Social Proof integration (DS-014)
2. Phase 2: Sticky Bar refactor for mobile priority
3. Phase 3: Policy Pill validation alerts

## Known Risks
- [ ] URL param sync with localStorage on form resets
- [ ] Handling unsupported browsers (Chrome 90+ required)
- [ ] Caching compatibility with server-side rendering

## Design System Compliance
- All text: Playfair Display/Inter with 4.7:1 contrast
- Motion: Only card lift (0.2s) and button press (0.15s) used
- No purple gradients in pricing display