# Booking Flow Spec v5.0 – Optimized for Low Drop-off

## Goal
Reduce booking drop-off by 30%+ vs. Zostel/Hosteller through a mobile-first, state-persistent, trust-centric journey.

## Competitive Differentiators (Dostel wins over Zostel/Hosteller)

| Gap | Zostel | Hosteller | Dostel Win |
|-----|--------|-----------|------------|
| Social proof | None | None | Reviews + booking momentum on every card + detail |
| Policy transparency | 3-policy section (collapsed) | Full section (verbose) | 3 pinned policy pills — thumb zone, always visible |
| Sticky CTA bar | No | Partial (desktop only) | 72px sticky bottom bar on all booking pages |
| Inline availability | Hidden behind interaction | Partial | Rooms + pricing shown inline on detail page — no extra page load |
| Dosteller pricing | Not shown | Not shown | Weekly/monthly toggle with exact discount displayed upfront |
| Session persistence | None | None | URL + localStorage + BookingContext triple persistence |
| Price transparency | Partial | Partial | Full price breakdown at review step (Dosteller discount line item) |

## Flow Overview
1. **Search** – destination + dates + guests (URL + localStorage)
2. **Listing** – filtered hostels, sort, view toggle
3. **Property Detail + Room Selection** – inline rooms, sticky sidebar
4. **Guest Details** – minimal fields, auto-format
5. **Review** – full price, policies, edit inline
6. **Payment** – UPI first, Razorpay fallback
7. **Confirmation** – reference, map, calendar, receipt

## Key Enhancements
- **Persistent Search Context** – URL + React Context + localStorage
- **Inline Room Selection** – no extra page load
- **Sticky Bottom Bar** – always visible on mobile (72px height, 80px bottom padding)
- **Policy Pills** – 3 chips pinned below CTA (cancellation, check-in, ID requirement)
- **Long-Stay Toggle** – weekly/monthly rates for Dostellers (7+ nights)
- **Trust Signals** – SocialProof badge, booking momentum counter
- **Reduced Touch Targets** – 44px minimum
- **Motion** – 3 prescribed animations, respects `prefers-reduced-motion`

## Component Contracts

### StickyBottomBar
```typescript
interface StickyBottomBarProps {
  pricePerNight: number;
  total: number;
  roomCount: number;
  isDosteller: boolean;
  dostellerDiscount?: number;
  onSelectRoom: (roomId: string) => void;
  onSelectLongStay?: (weeks: number) => void;
}
```
States: `inactive` (grayed, "Book now"), `active` (green highlight, price updated)

### PolicyPills
```typescript
interface PolicyPill {
  label: string;
  type: 'cancel' | 'checkin' | 'id';
  value: string;
}
```
States: `default` (grayed out, clickable), `expanded` (open, +)

### RoomCard
```typescript
interface RoomCardProps {
  room: { name: string; type: string; price: number; capacity: number; amenities: string[] };
  selected: boolean;
  available: boolean;
  bookedThisWeek: boolean;
  dostellerDiscount?: number;
}
```
States: `default` (stone-100 bg, hover), `selected` (forest-500 border, scale 0.97), `soldOut` (red cross), `bookedThisWeek` (gold badge)

### StepIndicator
```typescript
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}
```
States: active (forest-500, arrow), completed (forest-100, checkmark), future (stone-100, dashed)

### SocialProof
```typescript
interface SocialProofProps {
  bookedThisWeek: number;
  avgRating: number;
  recentReviews: Array<{name: string; rating: number; text: string}>;
}
```
States: `empty` (empty state with CTA), `loading` (skeleton), `full` (with data)

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
States: `inactive` (grayed, "Show options"), `active` (green, weekly/monthly rates shown)

## Acceptance Criteria

### Functional
- [ ] Search state persists across refresh/back navigation (URL + localStorage + BookingContext)
- [ ] Room selection updates sticky bar price dynamically
- [ ] Price breakdown correct on review step (Dosteller discount line item)
- [ ] LongStayToggle shows weekly/monthly breakdown for 7+ nights
- [ ] SocialProof badge updates live (every 24h, offline-first)
- [ ] Policy pills maintain 12px minimum touch area
- [ ] All interactions under 300ms latency

### Mobile
- [ ] Sticky bar always visible; thumb-zone CTAs
- [ ] Single column <768px; native `<input type="date">`
- [ ] 44px minimum touch targets on all interactive elements
- [ ] Back navigation preserves all state (localStorage)
- [ ] Edge-to-edge images on mobile (no horizontal padding)
- [ ] 80px bottom padding to prevent sticky bar overlap

### Accessibility
- [ ] WCAG AA contrast (≥4.5:1) verified per token
- [ ] Focus ring 2px Sky-500; focus-visible outline visible
- [ ] ARIA labels on icon-only controls
- [ ] Error messages linked via `aria-describedby`
- [ ] Screen reader announces dynamic changes (aria-live)
- [ ] `prefers-reduced-motion` respected

### Visual
- [ ] No purple gradients; warm mountain palette (forest greens, sunset amber, warm earth)
- [ ] No dashboard-in-hero; no cream+terracotta defaults
- [ ] Only 3 prescribed animations: card lift (0.2s), page fade-in (0.1s), button press (0.15s)
- [ ] No motion noise (respect `prefers-reduced-motion`)
- [ ] Correct token usage for all colors, typography, spacing, shadows

### Performance
- [ ] Page load <2s on 3G; CLS <0.1; no layout shift
- [ ] Animations smooth on low-end devices

## Verification Notes

### Desktop (1440×900px)
- **Sticky bar**: visible at scroll, hides on scroll-down, shows price + total on scroll-up
- **Policy pills**: positioned below header (not at page bottom), 12px touch area
- **Room cards**: 4-column grid on desktop (desktop view), single column on mobile
- **LongStayToggle**: visible when 7+ nights selected; weekly/monthly rates shown in same row as nightly
- **Social proof**: badge visible on each hostel card with "3 booked this week" counter
- **Review step**: full price breakdown shows Dosteller discount line item

### Mobile (375×812px)
- **Sticky bar**: always visible; 72px height; 80px bottom padding; CTA always thumb-reachable
- **Policy pills**: top of form area, always visible — no scrolling needed
- **Room selection**: inline selection on detail page — no separate `/rooms` page
- **LongStayToggle**: 44px touch target; weekly/monthly prices shown inline
- **Social proof**: card-level social proof (reviews, booking momentum) visible on all cards
- **No horizontal scroll**: images edge-to-edge; no horizontal padding on mobile

## Implementation Roadmap
1. **Phase 1**: LongStayToggle integration (DS-014)
2. **Phase 2**: Policy Pill state management (click-to-expand, keyboard nav)
3. **Phase 3**: BookingContext refactor (URL + localStorage/Context sync)
4. **Phase 4**: SocialProof auto-refresh (every 24h, offline-first)
5. **Phase 5**: StickyBar mobile priority (72px height, 80px bottom padding)

## Known Risks
- [ ] URL param sync with localStorage on form resets
- [ ] Handling unsupported browsers (Chrome 90+ required)
- [ ] Caching compatibility with server-side rendering
- [ ] Edge cases: back navigation with no prior state (use localStorage as fallback)

## References
- Competitive gap analysis: `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md`
- Design tokens: `.paperclip/design/system/design-tokens.md`
- Brand guidelines: `DESIGN_SYSTEM.md`
- Previous flight tickets: DS-002/DS-003, DS-005, DS-014