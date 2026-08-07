# DOS-65: Membership / Dostellers Schema

**Priority:** P1

**Description:** Implement GraphQL schema and resolvers for Dosteller membership plans and membership status, including tiers, points, and benefits.

**Acceptance Criteria:**
- Schema defines types: `MembershipPlan`, `Dosteller`, `Membership` (linking customer to plan).
- Queries: `membershipPlans: [MembershipPlan!]!`, `me { membership { tier points benefits } }`.
- Mutation: `joinMembership(input: JoinMembershipInput!): Membership`.
- Fields: `tier` (Bronze/Silver/Gold), `points` (Int), `benefits` ([String!]!).
- Resolvers connect to database (using Prisma or direct DB access).
- Includes authentication middleware to protect `me` query.

**Files to change:**
- `apps/backend/src/schema/membership.ts`
- `apps/backend/src/resolvers/membership.ts`
- `apps/backend/src/services/membershipService.ts` (optional, for business logic)
- `apps/backend/src/middleware/auth.ts` (if not already present, add check for `me` resolver)

**Dependencies:**
- Requires seed data (DOS-66) for initial membership plans.
- Backend must have a `Customer` type (already present per product-gap-analysis.md).