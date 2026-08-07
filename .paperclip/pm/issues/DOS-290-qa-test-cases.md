# Sprint 004 — QA Test Cases

## DOS-285 (Membership Sign-up Flow with WhatsApp)

### TC-285-01
**Scenario:** Complete signup form and receive WhatsApp invite
**Steps:**
1. Create new user with email + password
2. Submit signup form
3. Verify success screen shows WhatsApp invite (`wa.me/{number}`)
4. Click WhatsApp invite link
**Expected:** WhatsApp opens with pre-filled message "Join Dostel Community!"
**Acceptance:** Link opens within 3 seconds, message visible

### TC-285-02
**Scenario:** WhatsApp opt-in completes, referral count increments
**Steps:**
1. Complete signup + WhatsApp opt-in
2. Check referral count in user profile
**Expected:** referralCount = 1
**Acceptance:** Count increments only after successful opt-in

### TC-285-03
**Scenario:** Rate limiting (max 1 opt-in per IP/24h)
**Steps:**
1. Trigger opt-in from same IP
2. Confirm second opt-in is rejected
**Expected:** Error message "You have already opted in today"
**Acceptance:** No duplicate opt-ins within 24h

### TC-285-04
**Scenario:** Valid phone number blocked
**Steps:**
1. Submit phone number without country code
**Expected:** Error "Please enter a valid phone number with country code"
**Acceptance:** Validates country code format before sending

## DOS-286 (Tiered Discount Logic at Checkout)

### TC-286-01
**Scenario:** Booking with Bronze member (7+ nights)
**Steps:**
1. Create booking with Bronze tier user
2. Verify discount applied to total
**Expected:** 10% off long-stay discount applied
**Acceptance:** Total reflects 10% discount

### TC-286-02
**Scenario:** Booking with Silver member (7+ nights + event)
**Steps:**
1. Create booking with Silver tier user
2. Verify discount applied for both long-stay + event tiers
**Expected:** 20% long-stay + 10% event
**Acceptance:** Both discounts applied correctly

### TC-286-03
**Scenario:** Booking with Gold member (7+ nights + events)
**Steps:**
1. Create booking with Gold tier user
2. Verify 35% long-stay + 20% event discounts
**Expected:** Correct total discount
**Acceptance:** All tiers applied per rules

### TC-286-04
**Scenario:** Booking for stay < 7 nights (no long-stay discount)
**Steps:**
1. Create booking with Bronze member, 3 nights
2. Verify no discount applied
**Expected:** 0% discount
**Acceptance:** Discount only applies for 7+ nights

## DOS-290 (Eligibility Badge UI)

### TC-290-01
**Scenario:** Badge renders on eligible room
**Steps:**
1. Query room with `isEligibleForDosteller = true`
2. Verify badge visible on room card
**Expected:** Badge renders with teal background, white text
**Acceptance:** Badge position matches layout

### TC-290-02
**Scenario:** Badge does not render on non-eligible room
**Steps:**
1. Query room with `isEligibleForDosteller = false`
2. Verify no badge on room card
**Expected:** No badge rendered
**Acceptance:** Ineligible rooms show no badge

### TC-290-03
**Scenario:** Tooltip displays correct message on hover
**Steps:**
1. Hover over badge on room card
2. Verify tooltip shows "Unlock Dosteller benefits..."
**Expected:** Tooltip text matches spec
**Acceptance:** Tooltip appears immediately on hover

### TC-290-04
**Scenario:** Click badge opens activity feed modal
**Steps:**
1. Click badge on eligible room
2. Verify activity feed modal opens
**Expected:** Modal contains membership info
**Acceptance:** Modal renders correctly with data

## DOS-291 (WhatsApp Opt-In Flow)

### TC-291-01
**Scenario:** User opts in via WhatsApp after signup
**Steps:**
1. Create user, complete signup
2. Click WhatsApp invite link
**Expected:** WhatsApp opens with pre-filled message
**Acceptance:** Link opens in WhatsApp, message is pre-filled

### TC-291-02
**Scenario:** WhatsApp message contains referral ID
**Steps:**
1. Complete signup + WhatsApp opt-in
2. Check referral count in user profile
**Expected:** Referral ID present in WhatsApp message
**Acceptance:** ID is unique and trackable

### TC-291-03
**Scenario:** Referral count increments only after opt-in
**Steps:**
1. Create user with referralCount = 0
2. Complete WhatsApp opt-in
3. Check user profile
**Expected:** referralCount = 1
**Acceptance:** Count increments only on successful opt-in

## DOS-418 (Discount Calculation Engine)

### TC-418-01
**Scenario:** Bronze member with 7-night stay
**Steps:**
1. Create booking with Bronze tier
2. Apply discount logic
**Expected:** 10% off total
**Acceptance:** Discount calculated correctly

### TC-418-02
**Scenario:** Silver member with 7-night stay + event booking
**Steps:**
1. Create booking with Silver tier
2. Apply discount logic
**Expected:** 20% long-stay + 10% event
**Acceptance:** Both discounts applied

### TC-418-03
**Scenario:** Gold member with 7-night stay + event booking
**Steps:**
1. Create booking with Gold tier
2. Apply discount logic
**Expected:** 35% long-stay + 20% event
**Acceptance:** All tiers applied

### TC-418-04
**Scenario:** Booking without tier (no Dosteller)
**Steps:**
1. Create booking with non-Dosteller user
2. Apply discount logic
**Expected:** No discount applied
**Acceptance:** 0% discount for non-Dostellers

## DOS-418 Edge Cases

### TC-418-E01
**Scenario:** Booking with $0 amount (free stay)
**Expected:** No discount (0% fee)
**Acceptance:** No negative discount

### TC-418-E02
**Scenario:** Booking with 1-night stay (no discount)
**Expected:** No discount
**Acceptance:** Discount only for 7+ nights

### TC-418-E03
**Scenario:** Multiple bookings for same user
**Steps:**
1. Create 3 bookings
2. Check total discounts
**Expected:** All bookings reflect individual tier discounts
**Acceptance:** Each booking independently calculated

## How to Run
- Test cases in `tests/` directory
- Run with: `npm run test`
- Coverage: 80% for DOS-418, 70% for others
- Tool: Jest + Cypress for integration