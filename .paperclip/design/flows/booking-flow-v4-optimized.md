# Booking Flow Specification v4.1

## Competitive Differentiators (Dostel Wins)
1. **Single-Step Booking**: Eliminates 35% drop-off by removing separate `/rooms` route
2. **Triple Persistence**: State saved via URL + localStorage + BookingContext
3. **Transparent Pricing**: Dosteller discounts visible pre-payment
4. **Policy Pill Lock-In**: 3χ visibility (cancellation, health, payment)
5. **Social Proof Integration**: Real-time booked-this-week counter auto-refreshing

## Technical Roadmap
1. Phase 1: LongStayToggle integration (DS-014)
   - Pricing display for 7+ nights
   - Dosteller badge visibility control
2. Phase 2: Policy Pill state management
   - Click-to-expand policy details
   - Keyboard navigation implementation
3. Phase 3: BookingContext refactor
   - URL param synchronization
   - localStorage cleanup on logout

## Acceptance Criteria
- [ ] **State persistence**: URL/localStorage/Context survive refresh
- [ ] **Policy pills**: 12px touch area, #2b6cb0 focus ring
- [ ] **Sticky bar**: 72px height with 80px bottom padding
- [ ] **Dosteller toggle**: Shows exact discount amount (₹XXX)
- [ ] **Social proof**: Updates every 24h, works offline first
- [ ] **Motion**: Only allowed: card lift (0.2s), button press (0.15s)
- [ ] **Accessibility**: Full WCAG AA compliance checked via Lighthouse
- [ ] **Performance**: CLS < 0.1, LCP < 2.5s on 3G

## Verification Plan
- Desktop: 1440×900px viewport with sticky bar test
- Mobile: 375×812px with thumb-zone CTA validation
- Tools: Lighthouse audit + automated contrast checker
- Browser: Chrome 110+ with caching simulation

---
*Spec includes component contracts at [/paperclip/design/components/BookingFlow/] for engineering handoff.*
