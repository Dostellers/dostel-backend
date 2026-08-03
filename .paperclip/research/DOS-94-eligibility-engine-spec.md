# DOS-94: Community Program - Eligibility Engine

**Priority**: P0  
**Type**: Backend  
**Dependencies**: Booking system  

## Description
Detect and flag Dosteller eligibility (7+ consecutive nights OR 10 cumulative nights) at booking time.

## Requirements
- [ ] Automatic flagging on booking record
- [ ] Store eligibility status in customer model
- [ ] Trigger welcome flow on check-in
- [ ] Recalculate eligibility on each new booking/stay

## Technical Details

### Data Model Changes
Add to Customer model:
- `isDostellerEligible: Boolean` (default: false)
- `dostellerEligibilityReason: Enum<NONE, CONSECUTIVE_NIGHTS, CUMULATIVE_NIGHTS>` (default: NONE)
- `totalNightsStayed: Int` (default: 0)
- `currentStreakNights: Int` (default: 0)

### Eligibility Logic
A customer becomes Dosteller-eligible when:
1. **Consecutive nights**: Any single booking/stay ≥ 7 nights
### Eligibility Logic
A customer becomes Dosteller-eligible when:
1. **Consecutive nights**: Any single booking/stay ≥ 7 nights
2. **Cumulative nights**: Total nights across all stays ≥ 10 nights

### Implementation Steps
1. **Booking Service Update**:
   - When a booking is confirmed/created:
     - Calculate nights for this booking
     - Update customer's `totalNightsStayed` (+= nights)
     - If booking is consecutive to previous stay (check-in date ≤ previous check-out date + 1):
       - Increment `currentStreakNights` by nights
     - Else:
       - Reset `currentStreakNights` to nights
     - Set `isDostellerEligible` = true if:
       - `currentStreakNights` ≥ 7 OR `totalNightsStayed` ≥ 10
     - Set `dostellerEligibilityReason` accordingly

2. **GraphQL Schema Updates**:
   - Add `isDostellerEligible: Boolean!` to Customer type
   - Add `dostellerEligibilityReason: DostellerEligibilityReason!` to Customer type
   - Add enum: `DostellerEligibilityReason { NONE CONSECUTIVE_NIGHTS CUMULATIVE_NIGHTS }`

3. **API Endpoints**:
   - Ensure eligibility fields are included in customer profile queries
   - Update booking creation mutation to trigger eligibility calculation

4. **Check-in Flow Integration**:
   - When guest checks in:
     - If `isDostellerEligible` is true AND welcome flow not yet sent:
       - Trigger Dosteller welcome email/SMS
       - Mark welcome flow as sent for this eligibility period

### Acceptance Criteria
- [ ] For a 7-night consecutive stay: customer marked eligible after booking confirmation
- [ ] For stays totaling 10+ nights across multiple bookings: customer marked eligible after 10th night
- [ ] Eligibility status correctly persists and updates with subsequent bookings
- [ ] Welcome flow triggers exactly once upon first eligibility achievement
- [ ] GraphQL API returns correct eligibility fields for customer queries
- [ ] No performance degradation on booking creation (<100ms added latency)

### Testing Scenarios
1. **First stay**: 5 nights → Not eligible
2. **Second stay**: 3 nights (consecutive) → Total 8 nights, streak 8 → Eligible (consecutive)
3. **First stay**: 3 nights → Not eligible
4. **Second stay**: 4 nights (non-consecutive) → Total 7 nights → Not eligible (<10 cumulative)
5. **Third stay**: 3 nights (non-consecutive) → Total 10 nights → Eligible (cumulative)
6. **Gap stay**: 10 nights, then 2-night gap, then 1 night → Streak resets to 1, total 11 → Eligible (cumulative remains)
7. **Edge case**: Exactly 7 nights consecutive → Eligible
8. **Edge case**: Exactly 10 nights cumulative → Eligible

### Dependencies
- Booking service must be able to determine if stays are consecutive
- Customer model updates must be transactional with booking creation
- Frontend components will need to consume the new eligibility fields

### Files to Modify
- `apps/backend/src/customers/models/Customer.ts` (or equivalent)
- `apps/backend/src/bookings/services/bookingService.ts`
- `apps/backend/src/graphql/schema/customers.schema.graphql`
- `apps/backend/src/graphql/schema/common.enums.graphql` (for new enum)
- `apps/backend/src/events/checkin.handler.ts` (or check-in service)