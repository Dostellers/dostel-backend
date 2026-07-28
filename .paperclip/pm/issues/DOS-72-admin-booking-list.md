# DOS-72: Admin booking list + status management

**Priority:** P2 · **Area:** `apps/admin` · **Assignee:** Builder  
**Depends on:** Various backend resolver fixes (optional — can use mock data first)

---

## Why

`apps/admin` is a skeleton with one page of "Coming soon" cards. Operations team needs to see and manage bookings. Without this, there's no way to confirm/cancel/complete bookings from the admin side.

## What

### 1. Install Apollo Client in admin app

```bash
cd apps/admin && npm install @apollo/client graphql lucide-react
```

Note: `lucide-react` is already in deps.

### 2. Admin booking list page

Replace `apps/admin/app/page.tsx` content with:

**Booking table** showing:
- Booking reference
- Customer name (populated)
- Hostel name (populated)
- Check-in / Check-out dates
- Total amount
- Status (Draft / Confirmed / Completed / Abandoned)
- Actions: Confirm / Complete / Abandon

**Filter/search bar**:
- By status dropdown
- By date range
- By customer name search

### 3. Status management actions

For each booking row, add dropdown or buttons:
- **Draft → Confirm** — calls `confirmBooking(id)` mutation
- **Confirmed → Complete** — calls `completeBooking(id)` mutation
- **Draft/Confirmed → Abandon** — calls `abandonBooking(id)` mutation
- Flash success/failure toast after each mutation

### 4. Design

Use a clean admin layout:
- Sidebar nav (static for now — Hostels, Rooms, Bookings, Guests)
- Main content area
- Table with sortable columns
- Status badges colored: Draft=gray, Confirmed=green, Completed=blue, Abandoned=red

### 5. Not in scope

- Admin auth (assume public dev for now — add auth middleware later)
- Pagination (keep simple list for v1, < 100 bookings)
- Customer management page (separate issue)
- Hostel/Room management forms (separate issue)

## Acceptance criteria

- [ ] Admin app boots on `localhost:3002`
- [ ] Booking table renders with all bookings from GraphQL
- [ ] Status filter works (shows only selected status)
- [ ] Confirm/Complete/Abandon buttons trigger correct mutation
- [ ] UI updates after mutation without full page reload
- [ ] Apollo Client network tab shows queries/mutations
