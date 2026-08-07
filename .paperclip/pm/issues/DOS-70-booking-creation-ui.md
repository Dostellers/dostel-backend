# DOS-70: Frontend booking creation page

**Priority:** P1 · **Area:** `apps/frontend` · **Assignee:** Builder  
**Depends on:** DOS-68 (Apollo Client), DOS-69 (payment amount), DOS-64 (room availability)

---

## Why

Hostel detail page has "Book now" buttons that go nowhere. No booking funnel exists end-to-end. User can browse hostels and rooms but cannot actually reserve anything.

## What

### 1. New route: `apps/frontend/app/hostels/[slug]/book/page.tsx`

Create a booking form page with:

- **URL params**: `?roomType=dorm&checkIn=2026-07-30&checkOut=2026-08-02&guests=2`
- **Pre-filled**: shows selected room type, dates, guest count from URL params
- **Room availability**: calls DOS-64 `roomAvailability` query to verify selected room is still available
- **Customer section**: 
  - If logged in: show name + email (from `me` query)
  - If not logged in: show inline sign-up/login (simplified)
- **Price summary**: room price × nights, total
- **Submit**: calls `createBooking` mutation → redirects to confirmation page

### 2. "Book now" wiring

In `apps/frontend/app/hostels/[slug]/page.tsx`:
- Replace `<button>` "Book now" with `<Link>` to `/hostels/[slug]/book?roomType=X&guests=Y`
- Pass room type and capacity in URL params

### 3. Confirmation page (simple)

New route: `apps/frontend/app/bookings/[id]/page.tsx`
- Displays booking reference, dates, amount, status
- "Back to hostels" link

## Visual spec

Keep it simple — single column form, mobile-first. No multi-step wizard. Rough order:

1. **Dates summary** — read-only display of selected dates + nights
2. **Room summary** — read-only card with room name, image, price
3. **Guest details** — name, email, phone inputs
4. **Price breakdown** — room total, any discounts, grand total
5. **Book now button** — calls `createBooking`

Price breakdown styling follows the existing Design System tokens (see `DESIGN_SYSTEM.md`).

## Acceptance criteria

- [ ] `/hostels/[slug]/book` renders with room + dates from URL params
- [ ] "Book now" buttons on hostel detail page link to booking page
- [ ] `createBooking` mutation fires on submit
- [ ] Booking reference displays on confirmation page
- [ ] Non-logged-in users can book (guest checkout)
- [ ] Backend `createBooking` stores `source.name = "web-direct"` for direct bookings

## Notes

- Guest checkout means customer is created first if email is new
- For logged-in users: JWT from DOS-67 auth creates booking under their customer ID
- Payment is recorded as "Pending" — payment gateway integration is a separate issue
