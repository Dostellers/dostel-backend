# DOS-71: Booking confirm → create RoomReservation

**Priority:** P2 · **Area:** `apps/backend` · **Assignee:** Builder  
**Depends on:** DOS-69 (payment amount), existing room model & `confirmBooking` mutation

---

## Why

When a booking is confirmed (`confirmBooking` mutation), the room's availability should be updated. Currently `confirmBooking` only changes the booking status — it doesn't create a `RoomReservation` on the Room document. This means:
- Same room can be double-booked
- `roomAvailability` query (DOS-64) won't see valid blocks
- No inventory tracking

## What

### 1. Update `confirmBooking` resolver

In `apps/backend/src/resolvers/bookingResolver.js`:

When `confirmBooking` is called:
1. Find the booking by ID
2. Find the Room matching booking.roomType + booking.hostel
3. Push a new `RoomReservation` subdocument to the room:
   ```js
   {
     startDate: booking.checkInDate,
     endDate: booking.checkOutDate,
     customer: booking.customer,
     bookingReference: booking.reference
   }
   ```
4. Save the room
5. Update booking status to 'Confirmed'
6. Return the updated booking

### 2. Handle edge cases

- If no room matches the room type + hostel, throw error
- If dates overlap with existing reservation, throw error (safety net — frontend should prevent via DOS-64)
- Revert booking to 'Draft' if room save fails (transaction-like behavior)

### 3. Sync `cancelBooking` / abandoned flow

Add to `abandonBooking` and `changeBookingStatus(to: 'Abandoned')`:
- Remove corresponding RoomReservation for this booking reference
- This frees up the room for other guests

### 4. Test script

After confirming a booking via GraphQL, verify the Room document:
```graphql
query {
  roomsByHostel(hostelId: "<hostel-id>") {
    id
    type
    reservations {
      startDate
      endDate
      bookingReference
    }
  }
}
```

Should show the new reservation.

## Acceptance criteria

- [ ] `confirmBooking` creates a RoomReservation on the matching Room
- [ ] Reservation has correct `startDate`, `endDate`, `customer`, `bookingReference`
- [ ] `abandonBooking` removes the RoomReservation (frees inventory)
- [ ] Error thrown if no room matches booking.roomType + booking.hostel
- [ ] Duplicate date conflict throws clear error
- [ ] Backend app boots without errors
