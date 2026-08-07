## Issue: Flexible Booking API for Remote Workers & Dostellers

### Type: Feature
### Priority: High
### Apps: apps/backend, apps/frontend

### Description
Extend GraphQL booking API to support 24/7 self-service booking and Dosteller loyalty integration.

### Acceptance Criteria
1. **GraphQL Mutation: `createBookingFlexible`**
   - Accepts check-in/check-out timestamps (not just dates)
   - Supports timezone-aware booking for global remote workers
   - Returns booking confirmation with workspace access code

2. **Dosteller Loyalty Fields**
   - Add `dostellerTier` enum (Bronze/Silver/Gold) to User type
   - Include `loyaltyPoints` and `communityActivityAccess` in booking response
   - Auto-apply tier discounts in pricing calculation

3. **Frontend Integration**
   - Update booking form to use new mutation
   - Show Dosteller perks in booking confirmation
   - Add workspace access QR code to confirmation email

### Technical Notes
- Backend: Extend `src/schema/bookings.graphql` and resolver
- Frontend: Modify `apps/frontend/src/components/BookingForm.tsx`
- Database: Add `dosteller_tier`, `loyalty_points` columns to users table

### Dependencies
- Requires auth service to expose Dosteller tier
- Needs workspace access code generation service

### QA Checklist
- [ ] Booking works at 3 AM IST for US-based remote worker
- [ ] Dosteller Gold gets 15% discount auto-applied
- [ ] Workspace QR code valid for stay duration
- [ ] Email confirmation includes all perk details