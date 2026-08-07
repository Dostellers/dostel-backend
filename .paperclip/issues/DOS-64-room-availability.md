# DOS-64: roomAvailability GraphQL query

**Priority**: P0 (blocking direct booking)

**Summary**: Implement GraphQL query to expose room availability for real-time inventory.

**Current Schema (in `apps/backend/src/schema/roomTypeDefs.js`)**:
```graphql
type RoomAvailability {
  roomType: String!
  totalRooms: Int!
  availableRooms: Int!
  pricePerNight: Float!
  roomId: ID!
}

type Query {
  roomAvailability(hostelId: ID!, checkIn: Date!, checkOut: Date!): [RoomAvailability!]!
}
```

**Note**: Resolver returns room-level data (totalRooms/availableRooms) which is sufficient for direct booking (DOM-392) as it treats a room as a bookable unit (not per-bed). Bed-level granularity is not required for MVP.

**Dependencies**: DOS-65 (membership schema), DOS-69 (payment amounts)

**Acceptance Criteria**:
- [ ] GraphQL resolver implemented in `apps/backend/src/resolvers/roomResolver.js` (line 119-129)
- [ ] Type definitions exist in `apps/backend/src/schema/roomTypeDefs.js` (line 63-69, 156)
- [ ] Returns accurate room counts per room type for given date range
- [ ] Handles invalid hostelId gracefully (returns [])
- [ ] Add unit tests for resolver logic (no reservations, overlapping, maintenance status)

**Owner**: Backend Engineer

**Links**: Related to DOS-392 direct booking widget