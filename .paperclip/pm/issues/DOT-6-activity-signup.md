# DOT-6: Implement Activity Sign-Up Flow

**Priority**: P2  
**Owner**: Frontend Engineer  
**Requestor**: Product Manager  

## Description
Enable Dostellers to sign up for community activities via dashboard with automatic attendance tracking.

## Why
- Quantifies community ROI (referencing `dostellers-implementation-issues.md`)
- Drives engagement metrics for long-stay retention

## Files to Modify
- `apps/frontend/components/ActivityList.tsx` (new)
- Use existing `activities` collection from backend

## Acceptance Criteria
- [ ] Only logged-in Dostellers see "Enroll" button
- [ ] Attendance recorded in `activities_attendance` collection
- [ ] Success toast: "You're enrolled! See you there!"

## Dependencies
- DOST-2 (membership check)
- Seed data for activities

## Notes
- Aligns with Issue #10 in `dostellers-implementation-issues.md`
- Reference `DO-I907-referral-tracker.md` for attendance pattern