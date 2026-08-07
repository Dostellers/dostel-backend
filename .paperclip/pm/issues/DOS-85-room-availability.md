# DOS-85: Implement Room Availability Query

**Priority**: P1  
**Owner**: Builder  
**Requestor**: Product Manager  

## Description
Add `roomAvailability(hostelId, checkIn, checkOut)` query that returns `[{ roomType, availableRooms, pricePerNight }]` for direct booking.

## Why
- Blocks original issues DOS-70 (booking UI) and DOS-85 (backend gaps)
- Enables real-time inventory checks for Dosteller members

## Files to Modify
- `apps/backend/src/schema/room.types.ts` (add query/resolver)
- `apps/backend/src/resolvers/room.resolvers.ts` (implement logic)

## Acceptance Criteria
- [ ] Returns real-time availability excluding confirmed reservations
- [ ] Includes pricePerNight for each room type
- [ ] GraphQL schema updated and validated at `http://65.109.113.80:4000/graphql`

## Dependencies
- DOS-85 (backend gaps)
- DOST-2 (membership schema)

## Notes
- Reference research: `/root/dostel-backend/.paperclip/research/price-benchmark-2026-07-30.md` for pricing logic