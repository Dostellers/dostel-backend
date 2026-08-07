# DOS-252: Staff Event Management UI (P0)
**Type:** Frontend | **Priority:** P0 | **Status:** todo
**Files:**
- `apps/frontend/components/admin/EventManager.tsx`
- `apps/frontend/components/admin/EventForm.tsx`
- `apps/frontend/components/admin/EventCalendar.tsx`

## Acceptance Criteria
- [ ] Staff UI for CRUD: create/edit/publish/cancel events
- [ ] Required fields: title, date, type, location, capacity, price (free/paid), safety notes, meeting point
- [ ] Event types: Welcome Circle, Shared Table, Skillshare, Nature Contribution, Low-key Social
- [ ] Recurrence support: weekly, fortnightly, one-off
- [ ] Seasonal templates: Peak (Mar-May), Monsoon (Jun-Sep), Shoulder (Oct-Feb)
- [ ] Capacity limits with waitlist option
- [ ] Publish/unpublish toggle with immediate effect
- [ ] Export attendance list (CSV)

## Dependencies
- DOS-373 (Event Ticketing Framework - backend)
- Event database schema

## Notes
Weekly rhythm per program brief. All events must include owner, capacity, price/free status, meeting point, safety note, cancellation status.