# DS-002: Booking UX Refinement — Guest Flow (Updated v2)

**Assignee**: Product Designer (UX)  
**Priority**: P0  
**Estimate**: 2-3 heartbeats  
**Depends on**: DS-001 (tokens in place), code audit completed Jul 28 2026

---

## Code audit findings (new — not in v1)

### Critical gaps discovered in frontend code audit
1. **No checkout routes exist** — `/booking/[slug]/details|review|payment|confirmation` are all missing
2. **No BookingProvider / BookingContext** — no state persistence across booking flow
3. **SearchBar does NOT sync to URL params** — uses `?q=` and `?type=` instead of `?destination=&checkIn=&checkOut=&guests=`
4. **Detail page has "View rooms" CTA** instead of inline room selection → extra page load = drop-off
5. **Room cards use "Book now" button** instead of "Select" mechanism → no cart, no multi-select
6. **No sticky bottom bar** anywhere — CTAs are mid-page, not thumb-reachable
7. **No policy pills** — 10+ policies buried at bottom of detail page
8. **No social proof** — "booked this week" appears nowhere
9. **Broken CSS**: `@applies` → `@apply` (lines 158-204), `@app--` broken (line 100)
10. **Old brand tokens**: `--color-brand-primary` (slate), `--color-brand-secondary` (red) throughout
11. **HostelCard missing props**: `soldOut`, `bookedThisWeek`, `dostellerPrice`, `variant`
12. **Navbar missing auth-aware links**: no "My Trips", no "Dashboard"
13. **No step indicator** anywhere — checkout has no progress visualization
14. **No long-stay toggle** for 7+ night stays
15. **layout.tsx uses Geist font** instead of Playfair Display + Inter

### Token migration required (blocked work)
See globals.css lines 3-18: all `--color-brand-*` tokens must be replaced with Dostel tokens (forest/sunset/sky/stone/snow palette). All `--color-text-*`, `--color-border`, `--color-background`, `--color-surface` references throughout components must be updated.

14 files need CSS var fixes: `globals.css`, `layout.tsx`, `page.tsx`, `hostels/page.tsx`, `hostels/[slug]/page.tsx`, `SearchBar.tsx`, `Navbar.tsx`, `HostelCard.tsx`, `Footer.tsx`, `HeroCarousel.tsx`, `CategoryFilter.tsx`, `CategoryTicker.tsx`, `GalleryGrid.tsx`, `TrustTicker.tsx`.

---

## Refined deliverables (updated from v1)

### 1. BookingContext provider — FILE TO CREATE
`apps/frontend/components/BookingProvider.tsx`
- State shape: `BookingState` (destination, checkIn/Out, guests, hostel, selectedRooms, guestInfo, computed totals)
- Persistence: URL params → localStorage → defaults (triple-redundant)
- Actions: `updateSearch`, `selectRoom`, `removeRoom`, `updateGuestInfo`, `resetBooking`, `restoreFromStorage`
- Wraps `/booking/*` routes

### 2. SearchBar URL param sync — FILE TO UPDATE
`apps/frontend/components/SearchBar.tsx` + `apps/frontend/app/hostels/page.tsx`
- Remove booking type pills (hostel/event/bus/workation/colive/membership) — they clutter
- Push `?destination=&checkIn=&checkOut=&guests=` on submit
- Hydrate from `useSearchParams()` on mount
- Add sticky variant (collapsible to pill row on scroll down)
- Add compact variant for mobile

### 3. Detail page room selection — FILE TO UPDATE
`apps/frontend/app/hostels/[slug]/page.tsx`
- Replace "View rooms" link + per-room "Book now" buttons with interactive RoomSelector
- Room cards: tap "Select" → border highlight (forest-500 2px) → "Selected ✓"
- Multi-select: user can select multiple room types
- StickyBottomBar: dynamically updates with selection + total

### 4. Policy pills — COMPONENT TO CREATE
`apps/frontend/components/PolicyPills.tsx`
- 3 pills always visible: "Free cancel 48h", "Check-in 2PM", "ID required"
- Shown on detail page below header, NOT buried at bottom

### 5. Sticky bottom bar — COMPONENT TO CREATE
`apps/frontend/components/StickyBottomBar.tsx`
- Height: 72px fixed at bottom
- Shows on scroll up, hides on scroll down
- CTA: "Book now" / "Select a room" / "Sold out"
- Price + total always visible
- Page has 80px bottom padding to prevent overlap

### 6. Step indicator — COMPONENT TO CREATE
`apps/frontend/components/StepIndicator.tsx`
- 3 steps: Details → Review → Payment
- States: active (●), completed (✓), future (○)
- Completed steps tappable (navigate back)
- aria-current="step" for screen readers

### 7. Checkout routes (4 new pages)
- `apps/frontend/app/booking/[slug]/details/page.tsx` — GuestDetailsForm + StepIndicator + BookingSummary + StickyBottomBar
- `apps/frontend/app/booking/[slug]/review/page.tsx` — StepIndicator + BookingSummary + PriceBreakdown + StickyBottomBar
- `apps/frontend/app/booking/[slug]/payment/page.tsx` — StepIndicator + PaymentMethodSelector + StickyBottomBar
- `apps/frontend/app/booking/[slug]/confirmation/page.tsx` — ConfirmationCard

---

## Updated acceptance criteria

- [ ] BookingContext persists state across all 4 checkout pages
- [ ] SearchBar pushes to `?destination=&checkIn=&checkOut=&guests=` — not `?q=`
- [ ] Detail page: rooms are selectable inline (no "View rooms" page load)
- [ ] Sticky bottom bar: always thumb-reachable, never overlapping content
- [ ] Policy pills: 3 visible pills above the fold on detail page
- [ ] Social proof: "X booked this week" on cards and room cards
- [ ] All `@applies` → `@apply` fixed, no CSS console errors
- [ ] No references to old `--color-brand-*` tokens remain
- [ ] Geist font replaced with Playfair Display + Inter
- [ ] Page background: warm off-white (`#fefcf5`), not cool slate (`#f8fafc`)
- [ ] Step indicator works across 3 checkout steps
- [ ] Price breakdown shows all line items — no surprise fees
- [ ] Checkout routes load without 404 or layout shift
- [ ] Mobile: all touch targets >= 44px

---

## References

- `booking-flow.md` — v3.0 spec with implementation order table
- `design-tokens.md` — token replacement map
- Code audit findings above — 15 specific gaps found in frontend code
- `apps/frontend/app/hostels/[slug]/page.tsx` — needs room selection refactor
- `apps/frontend/components/SearchBar.tsx` — needs URL param sync
- `apps/frontend/app/globals.css` — needs full token replacement
