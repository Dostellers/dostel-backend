# Booking Flow Spec v3.0 — Guest Booking Journey

## Audit delta from v2.0 (Jul 28 2026)
- **v2.0 assumed a working frontend**. The audit found:
  - No checkout routes exist (`/booking/[slug]/details|review|payment|confirmation`)
  - No `BookingProvider` / `BookingContext`
  - SearchBar does NOT sync to URL params — loses state on navigation
  - Detail page sidebar has "View rooms" CTA instead of inline selection
  - Room cards have "Book now" button instead of "Select" mechanism → no cart
  - No sticky bottom bar anywhere
  - No policy pills — policies buried in long list at page bottom
  - No social proof ("booked this week") anywhere
  - Broken CSS: `@applies` → `@apply`, `@app--` on line 100, old brand tokens
  - HostelCard missing `soldOut`, `bookedThisWeek`, `dostellerPrice`, `variant`
  - No step indicator for checkout
- **v3.0 adds**: concrete code targets per step, state machine for drop-off tracking, API contract alignment with backend

## Competitive context: drop-off gaps vs Zostel/Hosteller

| Gap | Zostel / Hosteller behaviour | Dostel solution | Drop-off reduction |
|-----|------------------------------|-----------------|-------------------|
| Dates lost between steps | Dates reset on navigation | Dates + guests persist in URL params + sticky top bar across entire flow | -12% |
| Room selection = page reload | CTA "View rooms" → separate page load | Rooms inline on detail page, select → cart updates instantly | -8% |
| CTA not thumb-reachable | "Book now" mid-page, hidden on scroll | Sticky bottom bar: price + CTA always visible on mobile | -15% |
| Policy buried at bottom | Cancellation/check-in at page bottom | 3 policy chips pinned below CTA: "Free cancel 48h", "Check-in 2PM", "ID required" | -5% |
| Surprise costs at payment | Taxes/fees only shown at final step | Full price breakdown from review step, "No booking fees" badge | -10% |
| No social proof | Review count, no recency | "12 booked this week", "Verified traveller" badges on reviews | -7% |
| Session death on browser close | Form data lost on navigation | localStorage persistence of booking-in-progress | -3% |

**Target: <30% drop-off from detail → confirmation (industry avg ~45-55% for hostel OTAs)**

---

## Flow overview with drop-off annotations

```
Home/Search
    |  ← dates/guests → URL params
    v
Listing (hostels results)           drop-off: 20%
    |  ← sticky search bar with dates
    v
Property Detail + Room inline       drop-off: 35%  ← CRITICAL
    |  ← room selected → cart updates
    v
Guest Details                        drop-off: 50%
    |  ← 3 fields, auto-format phone
    v
Review + Price Breakdown             drop-off: 55%
    |  ← price shock mitigation
    v
Payment                              drop-off: 60%
    |  ← UPI-first, Razorpay
    v
Confirmation                         drop-off: 5% (last mile)
```

---

## Step 0: Token layer (blocks everything)

**Current state**: `globals.css` uses old brand tokens. All frontend pages reference `--color-brand-primary`, `--color-brand-secondary`, `--color-border`, `--color-background` etc.

**Target state**: Replace with Dostel tokens from `design-tokens.md`.

**CSS files to change**:
- `apps/frontend/app/globals.css` — full token replacement + fix `@applies`→`@apply` + fix `@app--` line 100
- `apps/frontend/app/layout.tsx` — replace Geist with Playfair Display + Inter
- `apps/frontend/components/HostelCard.tsx` — fix `--color-surface`, `--color-border`, `--color-brand-primary` etc.
- `apps/frontend/components/SearchBar.tsx` — fix color references
- `apps/frontend/components/Navbar.tsx` — fix color references
- `apps/frontend/app/page.tsx` — fix `--color-text-primary`, `--color-text-muted`, `--color-brand-primary` etc.
- `apps/frontend/app/hostels/page.tsx` — fix `--color-brand-primary`, `--color-brand-secondary`
- `apps/frontend/app/hostels/[slug]/page.tsx` — fix all CSS var references

**Token migration map**:
| Old token | New token |
|-----------|-----------|
| `--color-brand-primary` | `--color-forest-900` or `--color-forest-500` |
| `--color-brand-secondary` | `--color-sunset` |
| `--color-brand-accent` | `--color-sunset` |
| `--color-brand-lime` | `--color-success` |
| `--color-brand-teal` | `--color-sky` |
| `--color-brand-light` | `--color-forest-100` |
| `--color-brand-dark` | `--color-forest-900` |
| `--color-brand-muted` | `--color-stone-400` |
| `--color-border` | `--color-stone-200` |
| `--color-background` | `--color-snow` |
| `--color-foreground` | `--color-forest-900` |
| `--color-text-primary` | `--color-forest-900` |
| `--color-text-secondary` | `--color-stone-600` |
| `--color-text-muted` | `--color-stone-400` |
| `--color-text-inverse` | `--color-white` |
| `--color-surface` | `--color-white` |
| `--color-bg-muted` | `--color-forest-100` or `--color-stone-200` |
| `--color-accent` | `--color-sunset` |
| `--color-success` | `--color-success` (keep) |

---

## Step 1: Search (Home / Hostels page)

### Audit findings
- **Current**: `SearchBar.tsx` has booking type pills (hostel/event/bus/workation/colive/membership) — does NOT push `?destination=&checkIn=&checkOut=&guests=` to URL
- **Listing page** (`hostels/page.tsx`): has a separate search bar with date inputs but no connection to URL params
- **No persistence**: refreshing the page loses all search state
- **No trending destinations** on empty search

### Required changes to SearchBar.tsx
```typescript
// Add these interfaces and URL param sync
interface SearchParams {
  destination: string
  checkIn: string        // ISO date
  checkOut: string       // ISO date
  guests: number
}

interface SearchBarProps {
  variant: 'home' | 'sticky' | 'compact'
  dark?: boolean         // keep existing for hero usage
  onSearch?: (params: SearchParams) => void
  initialValues?: Partial<SearchParams>
}
```

**Behaviour change**:
- On submit/hit Enter, push `?destination=&checkIn=&checkOut=&guests=` to URL via `useRouter().push()`
- On mount, hydrate from `useSearchParams()` if available
- Remove the booking type pills (hostel/event/bus/workation/colive/membership) — these belong in top nav, not search bar. The search bar is for destination + dates + guests only.

### Mobile layout (375px) — revised
```
+---------------------------------------+
| [Where to?]                           |
| [_____________________________]       |
|                                       |
| [Check-in]    [Check-out]             |
| [________]    [________]              |
|                                       |
| [Guests: 1 adult]                     |
|                                       |
| [  Search hostels  ]  ← THUMB        |
+---------------------------------------+
| Popular destinations                  |
| [Card] [Card]                         |
+---------------------------------------+
```

### Sticky variant (on listing + detail pages)
Collapses to pill row on scroll down:
```
| Kasol, HP | Mar 5-7 | 1 guest | [Edit] |
```
Tapping any pill re-expands the search bar inline. The "Edit" button expands all fields.

### Acceptance criteria (refined from code audit)
- [ ] `useSearchParams` hydrates search inputs on mount
- [ ] Submit pushes to `?destination=&checkIn=&checkOut=&guests=` — NOT `/hostels?q=...&type=...`
- [ ] Remove booking type pills from SearchBar (they clutter and confuse — search is for hostels)
- [ ] Mobile: sticky search bar collapses to pill row on scroll down, expands on tap
- [ ] Trending destinations shown when search is empty (from `heroSlides` or curated data)
- [ ] Date inputs use `<input type="date">` on mobile (native picker)
- [ ] Past check-in date: disabled in picker + inline message

---

## Step 2: Listing (Hostels results) — `/hostels?destination=&checkIn=&checkOut=&guests=`

### Audit findings
- **Current**: `hostels/page.tsx` is client-side only, uses `useState` for filters. No URL params for search.
- Search bar uses inline inputs (not connected to URL). Date inputs have no labels, just placeholders.
- No social proof ("booked this week") on cards
- No sort param in URL
- Category filter works but doesn't read from URL
- No grid/list toggle persistence

### Required changes
1. Make `hostels/page.tsx` read from `useSearchParams()` for destination/check-in/check-out/guests
2. Add sort param to URL (`?sort=popular|rating|price-asc|price-desc`)
3. Wire the search bar to actually filter the listing
4. Add `SocialProof` component to each card
5. Persist grid/list view toggle to `localStorage`

### Card component contract (updated)
```typescript
interface HostelCardProps {
  slug: string
  name: string
  location: string
  tagline: string
  price: number
  rating: number
  reviewCount: number
  image: string
  tags: string[]
  isNew?: boolean
  isTrending?: boolean
  soldOut?: boolean
  bookedThisWeek?: number        // "12 booked this week" — NEW
  dostellerPrice?: number        // if user logged in as Dosteller — NEW
  variant: 'grid' | 'list'      // NEW
}
```

### States
| State | Visual | Behaviour |
|-------|--------|-----------|
| Loading | 6 skeleton cards (shimmer) | Auto-fetch on mount |
| Empty | Illustration + "No hostels match" + "Clear filters" | CTA resets URL params |
| Error | "Couldn't load" + retry | Retry re-fetches |
| Sold out card | `opacity-60`, "Sold out" badge | Card not clickable |

### Acceptance criteria (refined)
- [ ] URL params hydrate filters on mount
- [ ] Search bar in listing is connected to URL params — changing dates updates the URL
- [ ] Category filter pills read from and write to URL (`?category=mountains`)
- [ ] Sort selection reflected in URL sort param
- [ ] Grid/list toggle persisted in localStorage
- [ ] "Sold out" badge on image for sold-out hostels
- [ ] Social proof: "X booked this week" shown if > 5 (new prop on HostelCard)
- [ ] Cards link to `/hostels/[slug]?checkIn=&checkOut=&guests=`
- [ ] Price always "from ₹X/night" format

---

## Step 3: Property Detail + Room Selection — `/hostels/[slug]?checkIn=&checkOut=&guests=`

### Audit findings
- **Critical**: Detail page has "View rooms" link and per-room "Book now" buttons — neither feeds a booking cart
- Sidebar has date pickers + "View rooms" CTA → should be inline interactive room selection
- No room selection mechanism (no "Select" → border highlight → cart update)
- No sticky bottom bar — CTA is mid-page in sidebar
- No policy pills — policies are at the very bottom of the page
- No social proof on room cards
- Sidebar date pickers are disconnected from room price calculation
- Amenities marquee exists but uses duplicate content trick — fine for v1
- No LongStayToggle for 7+ nights
- No guest count selector

### THIS IS THE CRITICAL DROP-OFF STEP — maximum polish here

### Required new route: room selection happens on the detail page itself
The detail page MUST house room selection. Do NOT create a separate `/hostels/[slug]/rooms` page (remove that route if it exists). Room selection is inline.

### Page layout (mobile-first) — revised from v2.0
```
+---------------------------------------+
| [← Back]  Dostel Kasol     [Share]    |
+---------------------------------------+
| GALLERY (swipeable, dots)             |
+---------------------------------------+
| Name + Location + Rating              |
| "Kasol, Parvati Valley"              |
| ⭐ 4.8 (1.2k reviews)               |
+---------------------------------------+
| PILLS: Free cancel 48h · 2PM CI · ID |
+---------------------------------------+
| ROOMS SECTION (interactive)           |
| +-- RoomCard (selectable) ----------+ |
| | Mixed Dorm (6 Bed)                | |
| | [lock] [light] [shower] [plug]    | |
| | ₹450 ₹327/night  [Select]       | |
| | 12 booked this week               | |
| | Selected border: Forest-500 2px  | |
| +----------------------------------+ |
|                                       |
| +-- Long Stay Toggle ---------------+ |
| | Staying 7+ nights? Dostellers     | |
| | save up to 40% [See rates →]     | |
| +----------------------------------+ |
|                                       |
| AMENITIES (marquee, 2 rows)          |
| LOCATION (map + distances)           |
| POLICIES (accordion at bottom)        |
| REVIEWS (3-5 highlighted)            |
+---------------------------------------+
| STICKY BOTTOM BAR (mobile)           |
| ₹327/night · Free cancel  [Book now] |
+---------------------------------------+
```

### Room selection behaviour (state machine)
```
IDLE → user taps "Select" on room card
  → card border: 2px forest-500, button shows "Selected ✓"
  → sticky bar updates: "₹327/night · 1 room [Book now]"
  → user can select another room (multi-select)

SELECTED → user taps "Selected ✓"
  → deselects room
  → cart updates

MULTI-SELECT → 2 rooms selected
  → sticky bar: "₹654 total · 2 rooms [Book now]"

BOOK_NOW → user taps CTA
  → redirect to /booking/[slug]/details?checkIn=&checkOut=&roomIds=
  → BookingContext hydrates from URL params
```

### Sticky bottom bar spec (mobile critical)
```
+---------------------------------------------+
| ₹327/night  |  Free cancellation            |
| ₹654 total  |  No booking fees              |
|              |  [  Book now  ]  ← THUMB     |
+---------------------------------------------+
```
- **Height**: 72px (page has 80px bottom padding)
- **Shows**: lowest available price/night + total for selected dates
- **CTA text**: "Book now" if room selected, "Select a room" if none, "Sold out" if unavailable
- **On scroll UP**: appears with slide-up (250ms ease-out)
- **On scroll DOWN**: hides
- **Desktop**: not sticky, sits in sidebar alongside room cart

### RoomCard component (updated contract)
```typescript
interface RoomCardProps {
  room: {
    id: string
    name: string
    type: 'dorm-mixed' | 'dorm-female' | 'private' | 'deluxe'
    price: number
    originalPrice?: number
    capacity: number
    image: string
    amenities: string[]       // icon keys, max 5 shown
    available: boolean
    bookedThisWeek?: number
  }
  selected: boolean
  onSelect: (roomId: string) => void
  checkIn: string
  checkOut: string
}
```

### Acceptance criteria (refined from code audit)
- [ ] **Remove** `/hostels/[slug]/rooms` link — room selection is inline on detail page
- [ ] **Replace** each room "Book now" button with "Select" / "Selected ✓" toggle
- [ ] **Replace** sidebar "View rooms" CTA with inline room cards
- [ ] Room card tap → border highlight (forest-500, 2px) + button text changes to "Selected ✓"
- [ ] Multi-select: user can select N room types
- [ ] Sticky bottom bar updates dynamically with selection + total
- [ ] Policy pills: 3 chips pinned below header row (not buried at bottom)
- [ ] Social proof: "12 booked this week" on each room card (new field in data)
- [ ] Gallery: swipeable on mobile, thumbnail grid on desktop
- [ ] No sticky bar overlap — page content has 80px bottom padding
- [ ] Desktop sidebar: booking summary + date picker + room cart + CTA
- [ ] LongStayToggle shown when date range >= 7 nights

---

## Step 4: Guest Details — Route: `/booking/[slug]/details`

### NEW ROUTE — does not exist yet

### File to create
`apps/frontend/app/booking/[slug]/details/page.tsx`

### Minimise friction — only 3 required fields

```
+---------------------------------------+
| [← Back]     Step 1 of 3     [✕]      |
|                                       |
|  Guest details                        |
|  We need these for check-in           |
|                                       |
|  Full name       [___________]  ← 44px|
|  Email           [___________]        |
|  Phone           [+91] [________]     |
|                                       |
|  [Optional] Special requests          |
|  [____________________________]       |
|                                       |
|  +-- Booking summary (collapsible)  --+
|  | Dostel Kasol · Mar 5-7 (2 nights)||
|  | Mixed Dorm x 1 · ₹327/night      ||
|  | Total: ₹781                       ||
|  +----------------------------------+ |
|                                       |
|  [  Continue to review  ]  ← THUMB   |
+---------------------------------------+
```

### BookingContext persistence
- `BookingProvider` wraps `/booking/*` routes
- On mount: hydrate from URL params → localStorage → defaults
- All field changes sync to localStorage (debounced 500ms)
- BookingContext state shape:

```typescript
interface BookingState {
  destination: string
  checkIn: string
  checkOut: string
  guests: number
  hostel: { slug: string; name: string; location: string }
  selectedRooms: Array<{
    roomId: string; name: string; quantity: number
    pricePerNight: number; total: number
  }>
  guestInfo?: {
    fullName: string; email: string; phone: string
    specialRequests?: string
  }
  subtotal: number; taxes: number; serviceFee: number
  total: number; nights: number
}
```

### Acceptance criteria
- [ ] 3 required fields: name, email, phone — validated on blur
- [ ] Phone auto-formats to "+91 XXXX-XXX-XXX"
- [ ] Data persists in BookingContext + localStorage
- [ ] Back button preserves all entered data
- [ ] Booking summary collapsible, shows key info
- [ ] Touch targets >= 44px for all inputs
- [ ] Tab navigates through fields in logical order
- [ ] All inputs have proper aria-labels
- [ ] Invalid fields: scroll to first error on submit
- [ ] CTA: "Continue to review" → navigates to `/booking/[slug]/review`

---

## Step 5: Review Booking — Route: `/booking/[slug]/review`

### NEW ROUTE — does not exist yet

### File to create
`apps/frontend/app/booking/[slug]/review/page.tsx`

```
+---------------------------------------+
| [← Back]     Step 2 of 3     [✕]      |
|                                       |
|  Review your booking                  |
|                                       |
|  +-- Property (edit ✏) -------------+ |
|  | 📍 Dostel Kasol                   | |
|  +----------------------------------+ |
|                                       |
|  +-- Dates (edit ✏) ----------------+ |
|  | 📅 Mar 5 (2PM) → Mar 7 (11AM)    | |
|  | 2 nights                          | |
|  +----------------------------------+ |
|                                       |
|  +-- Price breakdown ----------------+ |
|  | Room total            ₹654        | |
|  | Taxes (12%)           ₹78         | |
|  | Service fee           ₹49         | |
|  | ─────────────────────             | |
|  | Total                 ₹781        | |
|  | ✅ Free cancellation              | |
|  | ✅ No booking fees                | |
|  | ✅ Secure payment                 | |
|  +----------------------------------+ |
|                                       |
|  [v] I agree to house rules           |
|  [v] I agree to cancellation policy   |
|                                       |
|  [  Confirm & pay ₹781  ]  ← THUMB   |
|  Secured by Razorpay                  |
+---------------------------------------+
```

### Acceptance criteria
- [ ] Edit pencil on each section (inline edit where possible)
- [ ] Price breakdown shows per-line items — no surprise fees
- [ ] Cancellation policy with exact date: "Free cancel before Mar 3"
- [ ] Both checkboxes required before CTA enabled
- [ ] Razorpay trust badge visible
- [ ] CTA: "Confirm & pay ₹X" → `/booking/[slug]/payment`
- [ ] Back button preserves all selections

---

## Step 6: Payment — Route: `/booking/[slug]/payment`

### NEW ROUTE — does not exist yet

### File to create
`apps/frontend/app/booking/[slug]/payment/page.tsx`

### UPI-first (Indian market reality)

```
+---------------------------------------+
| [← Back]     Step 3 of 3     [✕]      |
|                                       |
|  Payment                              |
|                                       |
|  Amount: ₹781                         |
|  Dostel Kasol · Mar 5-7              |
|                                       |
|  [🔵] UPI (GPay / PhonePe / Paytm)   |
|  [ ] Credit / Debit Card             |
|  [ ] Net Banking                     |
|                                       |
|  UPI ID                               |
|  [________________________]           |
|                                       |
|  [  Pay ₹781  ]  ← THUMB             |
|                                       |
|  ✅ Secured by Razorpay              |
|  ✅ Free cancellation                |
+---------------------------------------+
```

### Payment flow
1. UPI pre-selected by default
2. User enters UPI ID → auto-validate on blur
3. Tap "Pay ₹781" → Razorpay checkout overlay
4. On success: auto-redirect to confirmation page (3s)
5. On failure: "Payment failed" toast + "Try again"
6. On 10min inactivity: "Session expired" → "Start over"

### Acceptance criteria
- [ ] UPI pre-selected, first in list
- [ ] Razorpay integration (test mode for dev)
- [ ] Payment timeout after 10 minutes of inactivity
- [ ] On failure: booking saved as "payment_pending"
- [ ] CTA disabled during processing (prevents double charge)

---

## Step 7: Confirmation — `/booking/[slug]/confirmation`

### NEW ROUTE — does not exist yet

### File to create
`apps/frontend/app/booking/[slug]/confirmation/page.tsx`

```
+---------------------------------------+
|                                       |
|  ✅ Booking confirmed!                |
|                                       |
|  Booking ref: DOS-2025-03-A1B2C       |
|                                       |
|  📍 Dostel Kasol                      |
|  Mar 5 (2PM) → Mar 7 (11AM)         |
|  2 nights · Mixed Dorm              |
|                                       |
|  What to bring:                       |
|  • Govt-approved photo ID            |
|  • Downloaded confirmation           |
|  • Power bank                        |
|                                       |
|  How to reach:                        |
|  • Bhuntar bus → 30km, cab ₹1600    |
|                                       |
|  [📅 Add to Calendar]                 |
|  [📄 Download Receipt]               |
|  [  View my trips  ]  ← THUMB        |
+---------------------------------------+
```

### Acceptance criteria
- [ ] Booking ref displayed prominently (DOS-YYYY-MM-XXXXX)
- [ ] "What to bring" dynamic per property
- [ ] "How to reach" shows transport info
- [ ] Add to Calendar generates .ics file
- [ ] Download Receipt generates PDF
- [ ] "View my trips" → /trips page
- [ ] Page is printable (print CSS removes nav, buttons)

---

## Step indicator (shared across checkout)

### File to create
`apps/frontend/components/StepIndicator.tsx`

```
[1] Guest details ──── [2] Review ──── [3] Payment
     ● ─────────────── ○ ─────────────── ○     ← current
     ✓ ─────────────── ● ─────────────── ○     ← middle
     ✓ ─────────────── ✓ ─────────────── ●     ← last
```

- Completed steps show checkmark (✓) — tappable, navigate back
- Current step shows filled circle (●)
- Future steps show empty circle (○)
- `aria-current="step"` on current step
- Announce current step to screen readers via `aria-live="polite"`

### Mobile layout
- Horizontal row, labels truncated on very small screens
- Tappable area for each step: 44px min

---

## Shared state: BookingContext

### File to create
`apps/frontend/components/BookingProvider.tsx`

### Persistence chain (triple-redundant)
1. URL query params (highest priority — SSR-compatible)
2. localStorage (survives browser close + refresh)
3. Defaults (empty — initial mount)

### Hydration order on mount
```
URL params → setState → localStorage backup → render
```

### Actions
```typescript
interface BookingActions {
  updateSearch: (params: Partial<BookingState>) => void
  selectRoom: (room: RoomSelection) => void
  removeRoom: (roomId: string) => void
  updateGuestInfo: (info: BookingState['guestInfo']) => void
  resetBooking: () => void
  restoreFromStorage: () => void
}
```

---

## Mobile-first layout rules (enforced across all booking pages)

1. **Sticky bottom bar** on detail + checkout: price + CTA in thumb zone
2. **Thumb zone** (bottom 72px): primary actions only — nothing critical above it
3. **Date inputs**: native `<input type="date">` — no custom pickers
4. **Single column** on < 768px, sidebar layout on desktop (detail + review + payment)
5. **Back navigation**: `history.back()` for back buttons, never `router.push()`
6. **Touch targets**: all interactive elements >= 44px
7. **Edge-to-edge images**: no horizontal padding on gallery, cards full-width on mobile

---

## Verification checklist

### Functional
- [ ] Search → results → detail → room select → details → review → pay → confirm
- [ ] Dates + guests persist across all steps (via URL params)
- [ ] Browser refresh mid-flow restores state (localStorage)
- [ ] Back navigation preserves state at every step
- [ ] Multiple rooms can be selected
- [ ] Price breakdown correct (room x nights x qty + taxes + fees)
- [ ] Payment failure → booking saved as "payment_pending"
- [ ] No reference to old `--color-brand-*` tokens anywhere

### Accessibility
- [ ] All steps work keyboard-only (Tab, Enter, Escape)
- [ ] Focus indicator visible on all interactive elements (sky-500 outline, 2px)
- [ ] ARIA labels on all inputs
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Step indicator announces current step to screen readers

### Visual
- [ ] All text meets WCAG AA contrast (>= 4.5:1)
- [ ] Sticky bottom bar on mobile does not overlap content (page has 80px pb)
- [ ] No horizontal scroll on any page at 375px viewport
- [ ] Animations respect `prefers-reduced-motion`

### Edge cases
- [ ] Sold out room shows correctly with disabled state
- [ ] No rooms available for dates → "Change dates" CTA
- [ ] Invalid date (past, too far future) handled gracefully
- [ ] Network failure → toast with retry
- [ ] Session timeout during payment → "Start over" dialog
- [ ] Email already registered → suggest login

---

## Implementation order (sequential — each blocks the next)

| Phase | What | Files | Depends on |
|-------|------|-------|-----------|
| P0-a | Token migration + CSS fix | globals.css, layout.tsx, all components | Nothing |
| P0-b | BookingProvider + BookingContext | BookingProvider.tsx | P0-a |
| P0-c | Detail page room selection | hostels/[slug]/page.tsx, RoomSelector.tsx, StickyBottomBar.tsx, PolicyPills.tsx | P0-a, P0-b |
| P0-d | Guest details route | booking/[slug]/details/page.tsx, GuestDetailsForm.tsx, StepIndicator.tsx | P0-b, P0-c |
| P0-e | Review route | booking/[slug]/review/page.tsx, PriceBreakdown.tsx | P0-d |
| P0-f | Payment route | booking/[slug]/payment/page.tsx, PaymentMethodSelector.tsx | P0-e |
| P0-g | Confirmation route | booking/[slug]/confirmation/page.tsx, ConfirmationCard.tsx | P0-e |
| P1-a | SearchBar URL sync | SearchBar.tsx, hostels/page.tsx | P0-a |
| P1-b | Social proof + card updates | HostelCard.tsx, SocialProof.tsx | P0-a |
| P1-c | Navbar auth links | Navbar.tsx | P0-a |
| P1-d | LongStayToggle | LongStayToggle.tsx | P0-c |

---

## New files summary (19 total)

### Route pages (4 new)
| Route | File | Key components |
|-------|------|---------------|
| `/booking/[slug]/details` | `app/booking/[slug]/details/page.tsx` | StepIndicator, GuestDetailsForm, BookingSummary |
| `/booking/[slug]/review` | `app/booking/[slug]/review/page.tsx` | StepIndicator, BookingSummary, PriceBreakdown |
| `/booking/[slug]/payment` | `app/booking/[slug]/payment/page.tsx` | StepIndicator, PaymentMethodSelector |
| `/booking/[slug]/confirmation` | `app/booking/[slug]/confirmation/page.tsx` | ConfirmationCard |

### Components (12 new)
| Component | File | Used in |
|-----------|------|---------|
| `StepIndicator` | `components/StepIndicator.tsx` | All checkout pages |
| `BookingSummary` | `components/BookingSummary.tsx` | Sidebar, mobile drawer |
| `GuestDetailsForm` | `components/GuestDetailsForm.tsx` | `/booking/[slug]/details` |
| `PriceBreakdown` | `components/PriceBreakdown.tsx` | Review, sidebar |
| `PaymentMethodSelector` | `components/PaymentMethodSelector.tsx` | `/booking/[slug]/payment` |
| `ConfirmationCard` | `components/ConfirmationCard.tsx` | `/booking/[slug]/confirmation` |
| `StickyBottomBar` | `components/StickyBottomBar.tsx` | Detail + checkout |
| `PolicyPills` | `components/PolicyPills.tsx` | Detail page |
| `SocialProof` | `components/SocialProof.tsx` | Cards, detail page |
| `RoomSelector` | `components/RoomSelector.tsx` | Detail page |
| `LongStayToggle` | `components/LongStayToggle.tsx` | Detail page |
| `BookingProvider` | `components/BookingProvider.tsx` | Root layout or checkout group |

### Updated components (5)
| Component | Changes needed |
|-----------|---------------|
| `globals.css` | Full token replacement, fix `@applies`→`@apply`, fix `@app--` |
| `layout.tsx` | Replace Geist with Playfair Display + Inter |
| `SearchBar.tsx` | URL param sync, remove booking type pills, sticky variant |
| `HostelCard.tsx` | Add `soldOut`, `bookedThisWeek`, `dostellerPrice`, `variant` props; fix CSS vars |
| `Navbar.tsx` | Add "My Trips" + "Dashboard" links when logged in; add "Dostellers" to mobile bottom nav |
| `hostels/[slug]/page.tsx` | Replace room "Book now" with "Select" mechanism, add sticky bar, add policy pills, add social proof |
| `hostels/page.tsx` | Connect to URL params, add SocialProof, fix CSS vars |
| `page.tsx` | Fix all CSS var references to Dostel tokens |
