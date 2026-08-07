# DS-014: LongStayToggle Integration in Booking Flow

**Assignee**: UI Engineer  
**Priority**: P1  
**Depends on**: DS-011 (Dashboard components), Booking Flow spec v5.0, Dostellers Journey spec v2.1  
**Estimate**: 1 heartbeat

---

## Deliverables

### 1. LongStayToggle Component
**File**: `apps/frontend/components/LongStayToggle.tsx`

```tsx
interface LongStayToggleProps {
  onToggle: (active: boolean) => void;
  active: boolean;
  dostellerDiscount?: number;  // e.g. 40
  weeklyPrice?: number;
  monthlyPrice?: number;
  isDosteller: boolean;
}
```

**Visual**:
- Desktop: horizontal toggle below dates in detail page
- Mobile: checkbox with label "Dosteller pricing?" in booking flow
- Toggle states:
  - Off: "Unlock Dosteller pricing" (gray disabled style) when inactive
  - On: switch with discount percentage badge ("40% off") when active
- Contextual messaging:
  - When active: shows exact weekly/monthly pricing with discounts
  - When inactive: shows "Unlock exclusive Dosteller pricing and discounts for stays of 7+ nights"

**Behavior**:
- Toggles `isDosteller` state in BookingContext
- When inactive on 7+ night stay, shows "Unlock Dosteller pricing" CTA that redirects to `/dostellers`
- When active, shows weekly/monthly discounted prices
- Respects `prefers-reduced-motion` (no animation on reduce motion)
- Updates sticky bar price in real-time when toggled
- Shows exact discount amounts in price breakdown

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

#### c. Search Results Integration (`HostelCard.tsx`)
Add Dosteller badge for eligible stays:
```tsx
{isDosteller && nights >= 7 && (
  <span className="badge badge-success">
    Dosteller: up to 40% off
  </span>
)}
```

### 2. Acceptance Criteria

| Category | Requirement |
|---|---|
| **Functional** | - Toggle controls `isDosteller` state in BookingContext<br>- Discount appears correctly in price breakdown<br>- Redirects to `/dostellers` when inactive on eligible stay<br>- Updates sticky bar price in real-time<br>- Shows exact weekly/monthly pricing when active |
| **Mobile** | - Toggle touch target >= 44px<br>- Fits in available space without overflow<br>- Clear label for accessibility<br>- Works with native date inputs |
| **Accessibility** | - Button has ARIA label<br>- Toggle role="switch"<br>- Focus visible with 2px Sky-500 ring<br>- Screen reader announces state changes<br>- ARIA-live region for price updates |
| **Visual** | - Uses Dostel tokens only<br>- Active state uses forest-500<br>- Inactive uses stone-400<br>- Discount badge uses sky-500 background<br>- All text WCAG AA compliant (4.5:1 contrast) |
| **Performance** | - No layout shift when toggling<br>- Animation respects reduced motion setting<br>- Updates in <100ms<br>- Smooth on low-end devices |

---

## Verification Checklist

- [ ] Toggle renders correctly in day/night mode (forest theme)
- [ ] Discount applies correctly to price breakdown
- [ ] Redirect works when inactive on 7+ night stay
- [ ] Tap target meets 44px requirement on mobile/desktop
- [ ] Active/inactive states are announced by screen reader
- [ ] No layout shift on toggle change
- [ ] Respects `prefers-reduced-motion`
- [ ] Price updates reflect in sticky bar immediately
- [ ] Social proof badge shows booking momentum for Dostellers
- [ ] Non-member sees "Unlock Dosteller pricing" prompt on detail page
- [ ] Points accumulation visible in dashboard after stay

---

## Integration with Dostellers Journey

When a user toggles LongStayToggle:
1. If not a Dosteller, shows prompt to join Dostellers
2. If Dosteller, applies discount to stay
3. Points are awarded after checkout (10 points per ₹100 spent)
4. Dashboard shows updated points balance
5. Badges update based on stay count

---

## Next Tickets

- **DS-015**: Non-member Dosteller pricing prompt integration
- **DS-009**: Loyalty tokens & badges implementation
- **DS-002/DS-003**: Booking flow refinement (parent ticket)
- **DS-005**: Dostellers journey refinement (parent ticket)

## References

- Booking Flow spec: `.paperclip/design/flows/booking-flow.md`
- Dostellers Journey spec: `.paperclip/design/flows/dostellers-journey.md`
- Competitive analysis: `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md`
- Design tokens: `.paperclip/design/system/design-tokens.md`
- Brand guidelines: `DESIGN_SYSTEM.md`