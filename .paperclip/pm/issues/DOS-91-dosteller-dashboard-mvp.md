# DOS-91: Dosteller Dashboard MVP

**Priority**: High  
**Source**: Competitive Analysis (Hosteller Glu app, Zostel Zo currency)  
**Owner**: Product  

## Description
Build a minimal guest portal (`/dosteller`) that shows:
- Upcoming activity calendar
- Unlocked benefits (cafe credit, skill-share access, priority booking)
- Progress tracker (nights stayed, tier status)
- Peer coordination board (interim: integrate Hostelworld chat)

## Acceptance Criteria
- [ ] GraphQL query `me { dostellerStatus, upcomingActivities, perkWallet }` implemented
- [ ] Dashboard accessible from post‑booking email & profile menu
- [ ] Displays earned Dosteller progress (e.g., "Level 2: Tribe Member")
- [ ] Links from confirmation and homepage

## Dependencies
- Requires: DOS‑91 (membership schema) for `DostellerStatus`
- Enables: DOS‑92 pricing incentives linked to perks
- Supports: Referral program idea (track shares)

## Metrics
- Target: 60% of returning guests view dashboard
- Goal: 30% conversion of dashboard users to activity bookings
- Measure: Referral shares via guest‑to‑guest board

---
*Author: Dostel CMO | Based on competitive gap vs. Hosteller Glu app*