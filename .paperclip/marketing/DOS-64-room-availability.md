# DOS-64: Room Availability Query

**Priority:** P1

**Description:** Implement a GraphQL query `roomAvailability(hostelId, checkIn, checkOut)` that returns available room types and counts.

**Acceptance Criteria:**
- Query returns an array of `{ roomType, availableRooms }`.
- Handles overlapping bookings and closed dates.
- Exposes data to frontend booking flow.
- Unit tests cover edge cases.

**Files to change:**
- `apps/backend/src/schema/booking.ts`
- `apps/backend/src/resolvers/booking.ts`
- `apps/backend/src/services/roomAvailability.ts`
