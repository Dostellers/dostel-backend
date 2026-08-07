# DOS-64: roomAvailability GraphQL query

**Priority**: P0 (blocking direct booking)

**Summary**: Implement GraphQL query to expose room availability for real-time inventory.

**Schema**:
```graphql
type RoomAvailability {
  roomType: RoomType!
  totalCapacity: Int!
  bookedBeds: Int!
  availableBeds: Int!
}

type Query {
  roomAvailability(hostelId: ID!, checkIn: Date!, checkOut: Date!): [RoomAvailability!]!
}
```

**Dependencies**: DOS-65 (membership schema), DOS-69 (payment amounts)

**Acceptance Criteria**:
- [ ] GraphQL resolver implemented in `apps/backend/src/graphql/resolvers/roomAvailability.ts`
- [ ] Type definitions added to schema
- [ ] Integration with inventory service returns accurate bed counts
- [ ] Tests pass for various room types and dates

**Owner**: Backend Engineer

**Links**: Related to DOS-392 direct booking widget