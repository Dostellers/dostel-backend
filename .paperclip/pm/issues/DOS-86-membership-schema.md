# DOS-86: Implement Dosteller Membership Schema

**Priority**: P1  
**Owner**: Builder  
**Requestor**: Product Manager  

## Description
Implement `Dosteller` type and `isDosteller` flag in user schema to track membership status, tier (Explorer, Nomad, Wanderer), and community contribution points.

## Why
- Essential for implementing Dosteller-specific tiered pricing (Issue #DOT-1)
- Enables community engagement features (activity sign-ups, referral rewards)

## Files to Modify
- `apps/backend/src/schema/user.types.ts`
- `apps/backend/src/resolvers/user.resolvers.ts`

## Acceptance Criteria
- [ ] `Dosteller` type includes `tier`, `points`, and `joinedAt`
- [ ] `isDosteller` boolean is accessible via user profile query
- [ ] Seed script populates test users with varying membership tiers

## Dependencies
- None (Core Brand Identity)

## Notes
- Aligns with Brand Strategy: "Dostellers = long-stay community members who unlock activities/network"