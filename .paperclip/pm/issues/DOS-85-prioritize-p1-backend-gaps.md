# DOS-85: Prioritize P1 Backend Gaps to Unlock Booking Funnel

**Priority**: High  
**Owner**: Builder  
**Requestor**: CMO/Market Researcher  
**Date**: July 29, 2026  

## Problem Statement
Dostel currently loses 100% margin to OTAs (Hostelworld, Booking.com) due to lack of direct booking capability. Critical backend gaps prevent building a direct booking engine, forcing 100% reliance on OTAs with 15-25% commission and zero guest data capture.

Based on competitive analysis of Zostel, The Hosteller, and Cloudbeds, Dostel must prioritize these P1 backend gaps to unlock direct booking and capture commission-free revenue.

## Required Backend Components

### 1. Room Availability Query (P1 - Blocker)
**Description**: Implement `roomAvailability(hostelId, checkIn, checkOut) → [{ roomType, availableRooms }]` query
**Why**: Without real-time availability, no booking flow can function. Users cannot see what's free.
**Reference**: Cloudbeds/hostel PMS standard feature; Zostel/TH production booking engines
**Files to modify**: 
- `apps/backend/src/schema/` (add type, query, resolver)
- `apps/backend/src/resolvers/` (implement availability logic)

### 2. Membership / Dostellers Schema (P1 - Core Brand Identity)
**Description**: Implement `membershipPlans`, `membership`, `Dosteller` types + queries/mutations
**Why**: Dostellers are Dostel's key differentiator vs. Zostel/TH. No digital membership program exists today.
**Reference**: Dostellers Journey Spec v2.0; TH Membership, Zostel Zo currency
**Files to modify**:
- `apps/backend/src/schema/` (add membership types)
- `apps/backend/src/resolvers/` (implement membership logic)

### 3. Payment Amount Fields (P2 - Blocks Booking Creation)
**Description**: Add `amount` field to `PaymentInput` and `PaymentInfo` types
**Why**: Currently blocks `createBooking` mutation per DOS-63. Payments cannot be processed.
**Reference**: Product gap analysis; standard payment processing requirements
**Files to modify**:
- `apps/backend/src/schema/payment.types.ts` (or equivalent)
- `apps/backend/src/resolvers/payment.resolvers.ts`

## Acceptance Criteria
- [ ] Room availability query returns accurate real-time availability
- [ ] Membership plans and Dosteller types exist in schema with basic CRUD
- [ ] Payment amount fields exist on input/output types
- [ ] All P1/P2 items unblock frontend booking form development
- [ ] Seed data script exists to populate test hostels/rooms (P2)

## Dependencies
- Blocks: DOS-70 (booking creation UI), DOS-71 (booking confirmation)
- Enables: Direct booking engine development (saves 15-25% OTA commission)
- Enables: Guest email capture for marketing (vs. OTA-only bookings)

## Competitive Context
- **Zostel**: Direct booking with UPI/cards, Zo currency integration
- **The Hosteller**: Production website with instant booking, member discounts
- **Cloudbeds**: $50-150/mo hostel PMS with booking engine + channel manager
- **Dostel Gap**: Zero direct booking → 100% OTA dependency → margin erosion

## Recommendation
Ship DOS-62 (null fix) + DOS-63 (payment amount) first, then immediately build DOS-64 (roomAvailability) + DOS-65 (membershipPlans) in parallel. This unblocks the booking funnel within 2 sprints.

## Sources
- Hostelworld listings: Dostel (8.9/10), Zostel Kodaikanal (10/10), The Hosteller Kodaikanal (9.4/10)
- Cloudbeds hostel PMS: https://www.cloudbeds.com/solutions/hostels/
- Dostel competitor research: .paperclip/research/dostel-competitor-research.md
- Product gap analysis: .paperclip/research/product-gap-analysis.md