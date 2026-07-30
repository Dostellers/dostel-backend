# Property Decision Stack & Arrival Journey v1.0

**Issue:** DOS-217  
**Surface:** Guest web (`apps/frontend`)  
**Scope:** One vertical slice from property evaluation through room/date selection to confirmed-arrival guidance  
**Primary viewport:** 360×800; desktop reference: 1440×900

## 1. Outcome

A guest can answer, without leaving the property page:

1. Is this the right place and location?
2. Is it available for my dates and group?
3. Which room fits, and what is the full stay total?
4. What cancellation, check-in, age and ID rules affect me?
5. Can I reach the property safely, including the final Vattakanal approach?
6. After payment, what must I do next and whom can I contact?

The slice succeeds when the property page is a decision tool rather than a long marketing page, and confirmation becomes an arrival handoff rather than an endpoint.

## 2. Competitive win

Zostel- and Hosteller-class journeys commonly separate availability, policy and access details, hide room inventory behind another interaction, and treat confirmation as a receipt. Dostel wins by:

- showing date-specific room inventory and **total stay price** inline;
- placing material policy summaries adjacent to selection;
- making Vattakanal access constraints visible before purchase and actionable after purchase;
- preserving the selection through refresh and recoverable failures;
- using only verified-stay proof and timestamped inventory signals.

This is not permission to copy competitor styling. The visual language remains place-specific: shola green, mist neutrals, trail blue, restrained campfire accent, real property and route imagery.

## 3. Experience principles

- **Decision content before editorial content.** Rooms, price, policy and access precede amenities, community stories and long-stay promotion.
- **Total first.** `₹2,616 total for 2 guests · 4 nights` is primary; `₹327 per bed/night` is secondary.
- **No false action.** “Book now” only advances a valid selection to guest details.
- **No fabricated urgency.** Demand and scarcity require source, timestamp and expiry.
- **Material restrictions stay visible.** Age, ID, access and cancellation restrictions cannot exist only inside an accordion.
- **One primary action.** The sticky bar contains selection summary and one next action.

## 4. End-to-end flow

```text
Property opened
  ├─ valid dates + guests in URL → fetch date-specific availability
  └─ dates absent/invalid → show indicative prices; focus date editor on selection attempt

Dates/guests confirmed
  → availability and totals update
  → guest selects room/bed quantity
  → selection summary updates and is announced
  → Continue to guest details
  → Review exact policy and total
  → Pay
  ├─ success → confirmation + arrival plan
  └─ recoverable failure → retain reservation and selection; retry or choose another method

Before arrival
  → reopen booking
  → view route, landmark, final approach, check-in needs and support
  → optionally share ETA or report late arrival
```

## 5. Property decision hierarchy

The DOM and visual order must match:

1. **Property identity:** name, precise locality, verified rating/review count, share/back.
2. **Compact gallery:** one stable-ratio hero at 360px; gallery control; no 70vh marketing hero.
3. **Stay editor:** check-in, check-out, guests; current values remain in URL.
4. **Availability status:** explicit for selected dates, including last checked time when cached.
5. **Decision strip:** cancellation deadline/rule, check-in window, age and ID requirement.
6. **Room choices:** date-specific inventory, occupancy, bed/private type, essential amenities, total.
7. **Selected-stay action:** safe-area-aware sticky bar on mobile; summary sidebar on desktop.
8. **Access preview:** map, landmark, final approach, transport and after-dark guidance.
9. **Safety and proof:** staff availability, secure storage, verified-stay reviews.
10. **Supporting content:** full amenities, community, Dosteller long-stay offer and full policies.

Marketing content must never sit between room selection and the primary continue action.

## 6. Mobile layout — 360×800

```text
┌────────────────────────────────────┐
│ ←  Dostel Vattakanal        Share │ 44px controls
├────────────────────────────────────┤
│ property image              1 / 8 │ 240px, 3:2
├────────────────────────────────────┤
│ Vattakanal, Kodaikanal             │
│ 4.8 · 124 verified stays           │
│ Available for 5–9 Aug              │
├────────────────────────────────────┤
│ Check-in      Check-out            │
│ 5 Aug         9 Aug                 │
│ Guests: 2                  Change  │
├────────────────────────────────────┤
│ Free cancel until 3 Aug            │
│ Check-in 2–8 PM · Original ID · 18+│ display-only decision strip
├────────────────────────────────────┤
│ Choose your room                   │
│ Mixed dorm · 1 bed                 │
│ Locker · curtain · socket          │
│ ₹1,308 total          [ Select ]   │
│ ₹327 / bed / night · 4 left        │
│ Verified: updated 4 min ago        │
├────────────────────────────────────┤
│ Getting here                       │
│ Map · landmark · final 600 m       │
│ Limited cabs after 8 PM  [Details] │
├────────────────────────────────────┤
│ page content ends above safe area  │
├────────────────────────────────────┤
│ 1 bed · 4 nights     ₹1,308 total │
│                    [ Continue ]    │
└────────────────────────────────────┘
```

### Mobile behavior

- Gallery is edge-to-edge; all decision content uses 16px page gutters.
- Sticky action uses `padding-bottom: env(safe-area-inset-bottom)` and never hides validation, policy, or the last content block.
- Page bottom padding equals sticky bar rendered height plus 16px.
- Sticky action remains present after a room is selected. Before selection it says `Select a room` and scrolls/focuses the room heading; it is not disabled without explanation.
- Date inputs may use native date controls. Opening “Change” keeps focus within the labelled editor and returns focus to its trigger when dismissed.
- Room comparison remains a single vertical list; no horizontal room carousel.

## 7. Desktop layout — 1440×900

```text
┌───────────────────────────────────────────────────────────┐
│ Breadcrumb / property header                              │
├────────────────────────────────┬──────────────────────────┤
│ Gallery                        │ Sticky summary sidebar   │
│ Identity + verified proof      │ Dates / guests           │
│ Decision strip                 │ Selected room            │
│ Room list                      │ Total                    │
│ Access + safety + reviews      │ [Continue]               │
└────────────────────────────────┴──────────────────────────┘
```

- Main content max width: 760px; sidebar: 360px; gap: 32px.
- Sidebar sticks below global navigation and stops before the footer.
- The same stay editor and selection state power main content and sidebar; no duplicate uncontrolled inputs.
- Keyboard order follows DOM order in the main flow, not visual column position.

## 8. Component contracts

### `PropertyDecisionHeader`

```ts
interface PropertyDecisionHeaderProps {
  name: string
  locality: string
  rating?: number
  verifiedReviewCount?: number
  availability: 'available' | 'limited' | 'sold-out' | 'dates-required' | 'unknown'
  selectedDateLabel?: string
  gallery: Array<{ src: string; alt: string; caption?: string }>
}
```

- Do not render a rating without `verifiedReviewCount`.
- `unknown` is not visually treated as available.

### `StayEditor`

```ts
interface StayEditorProps {
  checkIn?: string
  checkOut?: string
  guests: number
  minCheckIn: string
  maxGuests: number
  onApply(value: { checkIn: string; checkOut: string; guests: number }): void
}
```

- Prevent past check-in, check-out on/before check-in, and guests outside capacity.
- Applying updates URL parameters, refetches availability and retains the previous result until the new result resolves.

### `DecisionStrip`

```ts
interface DecisionItem {
  id: 'cancellation' | 'check-in' | 'age-id' | 'access'
  shortLabel: string
  fullText: string
  severity: 'info' | 'material'
}

interface DecisionStripProps {
  items: DecisionItem[]
  policyHref: string
}
```

- Items are display summaries, not faux-interactive pills.
- If truncated visually, the accessible name and adjacent “Full policies” link expose complete meaning.
- Cancellation uses an exact deadline when dates are known.

### `RoomChoice`

```ts
interface RoomChoiceProps {
  roomId: string
  name: string
  accommodationType: 'bed' | 'private-room'
  capacity: number
  essentialAmenities: string[]
  quantityAvailable?: number
  availabilityCheckedAt?: string
  unitPrice?: number
  stayTotal?: number
  selectedQuantity: number
  onChange(quantity: number): void
}
```

- Selection is conveyed by border, check icon and `Selected` text, not color alone.
- Show `stayTotal` as the primary price only after valid dates exist.
- If dates are absent, show `From ₹x/night` and action `Add dates to check availability`.
- Multi-room quantity cannot exceed live inventory or guest need.

### `AccessGuide`

```ts
interface AccessGuideProps {
  mapUrl?: string
  address: string
  landmark: string
  finalApproach: string
  transportLimits?: string
  afterDarkGuidance?: string
  supportPhone?: string
  lastVerifiedAt: string
  variant: 'preview' | 'arrival'
}
```

- `preview` shows decision-critical constraints and a details disclosure.
- `arrival` shows sequenced directions, copy-address, open-map and contact-property actions.
- Never generate a map destination from property name alone; use approved coordinates or a verified map URL.

### `ArrivalPlan`

```ts
interface ArrivalPlanProps {
  bookingRef: string
  propertyName: string
  checkInWindow: string
  access: AccessGuideProps
  requiredItems: string[]
  guestEta?: string
  lateArrivalCutoff?: string
  onUpdateEta?(eta: string): void
  onReportLateArrival?(): void
}
```

## 9. Selection and price states

| State | UI contract | Primary recovery/action |
|---|---|---|
| Dates required | Indicative unit price; no inventory claim | `Add dates` |
| Loading availability | Layout-matched room skeleton; retain old dates/total labelled `Updating` | None; controls remain operable |
| Available | Exact inventory and stay total | `Select` |
| Limited | Exact remaining quantity only if timestamped live inventory | `Select` |
| Sold out | Disabled selection, text `Sold out for these dates` | `Change dates` |
| Availability error | Preserve dates and prior selection; mark total unconfirmed | `Retry availability` |
| Price changed | Explain old and new total before accepting | `Accept ₹x total` or `Choose another room` |
| Selection expired | Keep guest-entered data; release stale price | `Check availability again` |

Dynamic availability and totals use one debounced `aria-live="polite"` region. Do not announce loading ticks or every quantity keystroke.

## 10. Truthful proof requirements

### Allowed

- Rating only from completed, verified stays.
- Review excerpt with author display name or initials, stay month, room type and recency.
- `4 beds left` only from date-specific inventory, with `availabilityCheckedAt`.
- `Booked 8 times in the last 7 days` only from completed or reserved bookings under an agreed backend definition, generated server-side with an expiry.
- Property and community photography with consent, meaningful captions and accurate location.

### Prohibited

- Randomized “booked this week” values.
- Evergreen “selling fast,” viewer counts or countdown timers.
- Ratings without source/count.
- “Free cancellation” without deadline and conditions.
- Stock community imagery presented as Dostel guests.
- Map links inferred only from a property name.

When evidence is absent, omit the claim. Absence of proof must not collapse layout or block booking.

## 11. Arrival journey

Confirmation prioritizes next actions in this order:

1. Confirmed status and copyable booking reference.
2. Property, selected room, guests, dates and check-in window.
3. Payment state: paid, balance due, or payment pending.
4. **Arrival plan:** verified map destination, landmark, final approach and transport limitations.
5. Required check-in items: original accepted ID, age rule, booking proof and any property-specific item.
6. Support: call property; secondary written channel only if staffed.
7. Add to calendar and download receipt.
8. Update ETA or report late arrival when backend support exists.

The calendar event includes property coordinates/address, check-in window and booking reference, but no sensitive payment data.

### Arrival recovery states

| State | Message | Action |
|---|---|---|
| Map unavailable | `We couldn't open the route.` Address remains selectable/copyable | `Copy address` and `Call property` |
| Access details stale | `Directions were last verified on {date}.` | `Call property before travel` |
| Arrival after cutoff | Explain reception impact without blame | `Report late arrival` |
| Support call unavailable | Preserve property phone and booking ref | Show staffed-hours message |
| Confirmation offline | Cache non-sensitive booking and arrival details after success | `Try again` for receipt/map |
| Payment pending | Do not say confirmed; show held-until time if true | `Retry payment` or support |

## 12. Accessibility

- WCAG 2.2 AA; body text contrast ≥4.5:1 and large text/UI boundaries ≥3:1.
- Every control has a persistent label; placeholders are never labels.
- Minimum target 44×44 CSS px with 8px separation where practical.
- Focus indicator is at least 2px, high-contrast trail blue, and never clipped.
- Logical source/tab order; no positive `tabindex`; room choices are buttons or labelled quantity controls.
- Selected state includes text/icon and `aria-pressed` or native selection semantics.
- Error summary receives focus after invalid submit and links to each invalid field.
- At 200% zoom and 320 CSS px, content reflows without two-dimensional scrolling.
- Gallery controls announce position; images have meaningful alt text, decorative contour graphics use empty alt.
- External map action identifies that it opens a new app/tab.
- Reduced motion removes transforms; selection and confirmation remain immediately legible.

## 13. Purposeful motion

1. **Room selection:** 150ms border/background transition; no bounce.
2. **Date/details panel:** 250ms opacity and ≤8px translate reveal.
3. **Confirmation:** one 400ms checkmark reveal after verified success.

No auto-rotating gallery, parallax, shimmer after content loads, or motion-based urgency. Under `prefers-reduced-motion: reduce`, remove transforms and shorten transitions to effectively immediate.

## 14. Acceptance criteria

### Property and room decision

- [ ] At 360px, property identity, date status, decision strip and first room start appear before editorial modules.
- [ ] Exact total is primary after dates are valid; `/night` is secondary.
- [ ] Date and guest changes update URL and availability without losing prior valid state during loading.
- [ ] A room can be selected and deselected using touch, keyboard Space and Enter.
- [ ] Selected state is not communicated by color alone.
- [ ] CTA cannot advance until dates, guests and room quantity are valid.
- [ ] CTA explains the missing action rather than appearing silently disabled.
- [ ] Sticky action respects safe-area inset and obscures no final content, policy, or validation.
- [ ] Desktop shows one 360px summary sidebar driven by the same state as room content.

### Trust, policy and access

- [ ] Decision strip includes exact cancellation summary, check-in window, original-ID requirement and age rule where applicable.
- [ ] Material restrictions remain visible and link to full policy text.
- [ ] Access preview includes verified destination, landmark, final approach and any transport/after-dark limitation.
- [ ] Reviews identify verified stay and recency.
- [ ] Inventory/booking momentum is omitted unless timestamped backend evidence is present.
- [ ] No countdown, viewer count, randomized demand claim or unqualified “free cancellation” appears.

### Confirmation and recovery

- [ ] Payment success presents booking reference and arrival plan above receipt utilities.
- [ ] Payment pending is never labelled confirmed.
- [ ] Map failure leaves copyable address and property support available.
- [ ] Refresh at property, guest details and payment recovery preserves safe booking state.
- [ ] Availability error, sold out, price change, expired selection, offline confirmation and late-arrival states each provide one clear recovery action.

### Accessibility and responsive verification

- [ ] Keyboard-only completion has visible, unobscured focus and logical order.
- [ ] Dynamic price/availability changes are announced once through a polite live region.
- [ ] 200% zoom and 320px width retain all required content/actions without horizontal scrolling.
- [ ] 360×800 and 390×844 pass touch, safe-area and on-screen-keyboard checks.
- [ ] 1280×800 and 1440×900 pass sidebar, focus-order and total/policy consistency checks.
- [ ] Reduced-motion mode removes transforms and preserves state clarity.

## 15. Engineering handoff

### Existing targets

- `apps/frontend/app/hostels/[slug]/page.tsx`: replace the 70vh hero/card-grid structure with the decision hierarchy; current room cards do not select inventory.
- `apps/frontend/components/RoomSelector.tsx`: align pricing, quantity, timestamps, accessible selected semantics and evidence rules.
- `apps/frontend/components/PolicyPills.tsx`: evolve into display-only `DecisionStrip`; remove hover affordance from non-controls.
- `apps/frontend/components/StickyBottomBar.tsx`: add safe-area sizing, explanatory incomplete states and live total.
- `apps/frontend/components/ConfirmationCard.tsx`: make access data explicit/verified; replace name-derived map URL; distinguish confirmed from pending.
- `apps/frontend/components/BookingProvider.tsx`: preserve URL/in-memory/local recovery state and invalidate stale availability.

### Required data

- Date-specific room/bed inventory and `availabilityCheckedAt`.
- Unit price, taxes/fees and exact stay total from one pricing source.
- Policy summary plus canonical full policy and effective date.
- Verified latitude/longitude or approved map URL, landmark, final approach, transport limits, after-dark guidance and `lastVerifiedAt`.
- Verified-stay review flag and stay date.
- Optional booking-momentum aggregate with definition, generated timestamp and expiry.

### Verification note template

```text
Mobile 360×800:
- dates/guests:
- room selection + total:
- sticky safe area:
- policy/access visibility:
- keyboard/zoom/reduced motion:

Desktop 1440×900:
- main/sidebar synchronization:
- keyboard focus order:
- total/policy consistency:

Recovery:
- sold out:
- availability error:
- price changed/expired:
- payment pending:
- map unavailable:
```
