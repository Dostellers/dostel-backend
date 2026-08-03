# DS-014: LongStayToggle Integration in Booking Flow

**Assignee**: UI Engineer  
**Priority**: P1  
**Depends on**: DS-011 (Dashboard components), Booking Flow spec v5.0  
**Estimate**: 1 heartbeat

---

## Deliverables

### 1. LongStayToggle Component
**File**: `apps/frontend/components/LongStayToggle.tsx`

```tsx
interface LongStayToggleProps {
  onToggle: (active: boolean) => void
  active: boolean
  dostellerDiscount?: number  // e.g. 40
  weeklyPrice?: number
  monthlyPrice?: number
  isDosteller: boolean
}
```

**Visual**:
- Desktop: horizontal toggle below dates
- Mobile: checkbox with label "Dosteller pricing?"
- Toggle states:
  - Off: "Unlock Dosteller pricing" (gray disabled style)
  - On: switch with discount percentage badge ("40% off")
- Contextual messaging:
  - When active: shows "Weekly: ₹1,950 → ₹1,170 (‑40%) | Monthly: ₹6,540 → ₹4,356 (‑40%)"
  - When inactive: shows "Unlock exclusive Dosteller pricing and discounts for stays of 7+ nights"

**Behavior**:
- Toggles `isDosteller` state in BookingContext
- When inactive on 7+ night stay, shows "Unlock Dosteller pricing" CTA that redirects to `/dostellers`
- When active, shows weekly/monthly discounted prices
- Respects `prefers-reduced-motion` (no animation on reduce motion)

### 2. Integration Points

#### a. Property Detail Page (`apps/frontend/app/hostels/[slug]/page.tsx`)
```tsx
<LongStayToggle
  onToggle={handleToggle}
  active={toggleActive}
  dostellerDiscount={40}
  weeklyPrice={1950}
  monthlyPrice={6540}
  isDosteller={isDosteller}
/>
```

#### b. Price Breakdown Update (`PriceBreakdown.tsx`)
Add line item when `isDosteller` and discount exists:
```tsx
{isDosteller && (
  <div className="flex justify-between text-sm">
    <span className="text-stone-600 font-medium">
      Dosteller discount
    </span>
    <span className="text-forest-900 font-medium">
      -{discountAmount} ({discountPercentage}%)
    </span>
  </div>
)}
```

### 2. Acceptance Criteria

| Category | Requirement |
|---|---|
| Functional | Toggle controls `isDosteller` state; discount appears in price breakdown; redirects to `/dostellers` when inactive on eligible stay |
| Mobile | Toggle touch target >= 44px; fits in available space without overflow; clear label |
| Accessibility | Button has ARIA label; toggle role="switch"; focus visible; screen reader announces state |
| Visual | Uses Dostel tokens only; active state uses forest-500; inactive uses stone-400; discount badge uses sky-500 background |
| Performance | No layout shift when toggling; animation respects reduced motion setting |

---

## Verification Checklist
- [ ] Toggle renders correctly in day/night mode
- [ ] Discount applies correctly to price breakdown
- [ ] Redirect works when inactive on 7+ night stay
- [ ] Tap target meets 44px requirement
- [ ] Active/inactive states are announced by screen reader
- [ ] No layout shift on toggle change
- [ ] Respects `prefers-reduced-motion`

---

## Next Tickets
- **DS-015**: Non-member Dosteller pricing prompt
- **DS-009**: Loyalty tokens & badges implementation