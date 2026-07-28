# DS-003: Component Implementation — Booking Flow UI

**Assignee**: UI Engineer  
**Priority**: P0  
**Depends on**: DS-001 (tokens), DS-002 (UX specs)  
**Estimate**: 2-3 heartbeats

---

## Overview

Implement 12 new components and update 4 existing components for the booking flow.
All components use the Dostel design tokens (DS-001) and follow the UX specs from DS-002.

---

## New components to build

### 1. `StepIndicator`
```tsx
// apps/frontend/components/StepIndicator.tsx
interface StepIndicatorProps {
  currentStep: 1 | 2 | 3
  labels?: [string, string, string]  // default: ["Details", "Review", "Payment"]
}
```
- States: active (●), completed (✓), future (○)
- Completed steps are tappable (navigate back)
- Mobile: horizontal with labels below
- Desktop: labels on right
- WCAG: announces current step to screen readers

### 2. `BookingSummary`
```tsx
// apps/frontend/components/BookingSummary.tsx
interface BookingSummaryProps {
  booking: BookingState
  compact?: boolean
}
```
- Shows: hostel name, dates, rooms selected, total
- Compact mode: collapsible drawer (mobile)
- Full mode: sidebar widget (desktop)
- Edit pencil icon on each section

### 3. `GuestDetailsForm`
```tsx
// apps/frontend/components/GuestDetailsForm.tsx
interface GuestDetailsFormProps {
  onSubmit: (data: GuestInfo) => void
  initialData?: GuestInfo
  loading?: boolean
}
```
- 3 required fields: full name, email, phone
- Phone auto-formats to "+91 XXXX-XXX-XXX"
- Email validates format on blur
- All fields persist to localStorage on change (debounced 500ms)
- Optional: special requests (max 500 chars), govt ID

### 4. `PriceBreakdown`
```tsx
// apps/frontend/components/PriceBreakdown.tsx
interface PriceBreakdownProps {
  subtotal: number
  taxes: number
  serviceFee: number
  total: number
  currency?: string  // default "₹"
}
```
- Line items: room total, taxes, service fee
- Divider before total
- Badges: "Free cancellation", "No booking fees", "Secure payment"
- Trust footer: "Secured by Razorpay"

### 5. `PaymentMethodSelector`
```tsx
// apps/frontend/components/PaymentMethodSelector.tsx
type PaymentMethod = 'upi' | 'card' | 'netbanking'

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
  loading?: boolean
}
```
- UPI pre-selected (Indian market priority)
- Methods: UPI (GPay/PhonePe/Paytm), Credit/Debit Card, Net Banking
- UPI ID input with validation
- States: ready, validating, processing, success, failed, expired (10min timeout)

### 6. `ConfirmationCard`
```tsx
// apps/frontend/components/ConfirmationCard.tsx
interface ConfirmationCardProps {
  booking: {
    ref: string
    hostelName: string
    location: string
    checkIn: string
    checkOut: string
    nights: number
    roomName: string
    total: number
  }
  contactEmail: string
  contactPhone: string
}
```
- Celebration: green checkmark + scale-in animation (400ms ease-spring)
- Booking ref prominently displayed
- "What to bring" section (dynamic per property)
- "How to reach" with transport info
- Actions: Add to Calendar (.ics), Download Receipt (PDF)
- Print CSS support

### 7. `StickyBottomBar`
```tsx
// apps/frontend/components/StickyBottomBar.tsx
interface StickyBottomBarProps {
  price: number
  total: number
  ctaLabel: string
  subtitle?: string
  onCtaClick: () => void
  disabled?: boolean
  show: boolean  // visibility toggle
}
```
- Height: 72px fixed
- Slide up on scroll (250ms ease-out), slide down on scroll down
- Mobile: always in thumb zone (bottom of viewport)
- Desktop: not sticky, sits in sidebar
- Page has 80px bottom padding to prevent overlap

### 8. `PolicyPills`
```tsx
// apps/frontend/components/PolicyPills.tsx
interface PolicyPillsProps {
  policies: string[]  // max 3
}
```
- Display: 3 pill-shaped badges
- Each pill: icon + short text (e.g. "🔄 Free cancel 48h")
- Colors: default (Stone-200 bg), success (green), info (sky)
- Mobile: horizontal scroll if overflow

### 9. `SocialProof`
```tsx
// apps/frontend/components/SocialProof.tsx
interface SocialProofProps {
  count: number
  label: string  // e.g. "booked this week"
  variant?: 'card' | 'detail' | 'badge'
}
```
- Card variant: small text below price
- Detail variant: medium text in room card
- Badge variant: pill with fire icon
- Hidden if count < 5

### 10. `RoomSelector`
```tsx
// apps/frontend/components/RoomSelector.tsx
interface RoomSelectorProps {
  rooms: RoomCard[]
  selectedRoomIds: string[]
  onSelect: (roomId: string) => void
  checkIn: string
  checkOut: string
}
```
- Room cards with: name, type, amenities (max 5 icons), price, availability
- Select → border highlight (2px Forest-500)
- Multiple room types selectable
- "Selected ✓" state
- Sold out cards: opacity-60, disabled

### 11. `LongStayToggle`
```tsx
// apps/frontend/components/LongStayToggle.tsx
interface LongStayToggleProps {
  onToggle: (active: boolean) => void
  active: boolean
  dostellerDiscount?: number  // e.g. 40
}
```
- Shown on detail page when date range ≥ 7 nights
- Toggle: switch or checkbox
- Shows discount percentage
- "Unlock Dosteller pricing" prompt for non-members

### 12. `BookingProvider`
```tsx
// apps/frontend/components/BookingProvider.tsx
// Wraps checkout routes with BookingContext
interface BookingProviderProps {
  children: React.ReactNode
}
```
- Provides BookingState + BookingActions to all nested components
- Hydrates from URL params → localStorage → defaults
- Syncs to localStorage on state change (debounced 500ms)
- Clears on successful booking confirmation

---

## Existing components to update

### `HostelCard.tsx`
Add props:
- `soldOut?: boolean` — disables card, shows "Sold out" badge
- `bookedThisWeek?: number` — social proof text
- `dostellerPrice?: number` — conditional pricing display
- `variant: 'grid' | 'list'` — layout switcher
Fix: replace old CSS var references with Dostel tokens

### `SearchBar.tsx`
Add:
- URL param sync (`useSearchParams` + `useRouter`)
- Variants: `'home' | 'sticky' | 'compact'`
- Sticky variant: collapsible to pill row on scroll
- Compact variant: single line with pill display
- Trending destinations on empty search
- 150ms debounce on input

### `Navbar.tsx`
Add:
- "My Trips" link when logged in (conditional)
- "Dashboard" link for Dostellers (conditional)
- Mobile: "Sign in" icon when logged out

---

## Motion implementation

Only 3 animation types (from design-tokens.md):

1. **Card hover lift**: `translateY(-2px)` + shadow-md, 250ms ease-out
2. **Page fade-in**: `opacity 0→1` + `translateY(8px→0)`, 400ms, stagger children 80ms
3. **Button press**: `scale(1→0.97)`, 150ms ease-in, reverse on release

**All animations must respect `prefers-reduced-motion`**.

---

## Route pages to create

| Route | Page component | Key components |
|---|---|---|
| `/booking/[slug]/details` | `app/booking/[slug]/details/page.tsx` | StepIndicator, GuestDetailsForm, BookingSummary, StickyBottomBar |
| `/booking/[slug]/review` | `app/booking/[slug]/review/page.tsx` | StepIndicator, BookingSummary, PriceBreakdown, StickyBottomBar |
| `/booking/[slug]/payment` | `app/booking/[slug]/payment/page.tsx` | StepIndicator, PaymentMethodSelector, BookingSummary, StickyBottomBar |
| `/booking/[slug]/confirmation` | `app/booking/[slug]/confirmation/page.tsx` | ConfirmationCard |

---

## Verification checklist

- [ ] All 12 new components render without errors
- [ ] All components accept their defined props
- [ ] Token colors/typography match spec (DS-001)
- [ ] 3 animation types implemented, respects reduced-motion
- [ ] All touch targets ≥ 44px
- [ ] Focus-visible rings visible (2px sky blue outline)
- [ ] Keyboard navigation: Tab order logical, Enter/Space activate
- [ ] Components have proper aria-labels
- [ ] No horizontal scroll at 375px viewport
- [ ] BookingProvider restores state from localStorage on refresh

## References

- `.paperclip/design/system/design-tokens.md` — all tokens
- `.paperclip/design/flows/booking-flow.md` — full flow spec + component contracts
- DS-001 — token migration (must be done first)
- DS-002 — UX refinement (provides interaction specs)
