# Issue Pack: Dostel Growth - Booking, Pricing, Community (Aug 3, 2026)

## Context
Consolidating PM/Growth requirements into small, shippable vertical slices for Builder/QA.

---

## Backlog Grooming Notes (PM)

| Issue ID | Title | Priority | Status |
|----------|-------|----------|--------|
| DOS-91 | Dosteller Dashboard MVP | P1 | ready |
| DOS-92 | Booking Flow - Long-Stay Pricing Display | P1 | ready |
| DOS-93 | Event Management CRUD | P1 | ready |
| DOS-94 | Community Program - Eligibility Engine | P0 | ready |
| DOS-95 | Room Availability Query - Tier Pricing | P0 | ready |
| DOS-96 | Admin - Export Dostellers Contact List | P2 | ready |
| DOS-97 | Mobile Bottom Nav - Dashboard Tab | P0 | needs design |
| DOS-98 | Search Results - Dosteller Pricing Badge | P1 | ready |
| DOS-99 | Points Bar Enhancement (₹ equivalent) | P1 | ready |
| DOS-100 | Pricing Engine - Tier Discount Logic | P0 | ready |

---

## Priority Issues Ready for Builder

### DOS-91: Dosteller Dashboard MVP **(P1)**
- **File**: `apps/frontend/app/dostellers/dashboard/page.tsx`
- **AC**: Points bar, tier badge, quick actions grid (2x2 mobile, 4x desktop), upcoming stays links to `/dashboard/bookings/[id]`
- **Deps**: Auth context, MemberHeader, PointsBar

### DOS-92: Booking Flow - Long-Stay Pricing Display **(P1)**
- **File**: `apps/frontend/components/LongStayToggle.tsx`
- **AC**: For 7+ nights, show Dosteller discount; non-members see "Unlock Dosteller pricing" link
- **Deps**: Dosteller context, pricing service

### DOS-93: Event Management CRUD **(P1)**
- **Backend API**: `apps/backend/src/events/`
- **Frontend**: `apps/admin/components/events/`
- **AC**: Create/edit/publish/cancel events; capacity, price (member/free), safety notes; RSVP tracking
- **Deps**: Community dashboard, booking system

### DOS-94: Community Eligibility Engine **(P0)**
- **File**: `apps/backend/src/bookings/services/eligibility.ts`
- **AC**: Auto-flag Dosteller eligibility (7+ consecutive OR 10 cumulative nights) at booking time
- **Deps**: Booking service

### DOS-95: Room Availability Query - Tier Pricing **(P0)**
- **File**: `apps/backend/src/rooms/queries/availability.ts`
- **AC**: Include Dosteller discounts in GraphQL response for logged-in users
- **Deps**: DOS-64, auth middleware

---

## Issues Needing Design Input

### DOS-97: Mobile Bottom Nav - Dashboard Tab
- **Status**: Needs design decision on icon positioning
- **Owner**: PM to coordinate with Design team

---

## Next Action for Builder
- Start with **DOS-94** (backend eligibility engine) as it unblocks other features
- Follow with **DOS-95** (room availability) and **DOS-92** (booking flow UI)