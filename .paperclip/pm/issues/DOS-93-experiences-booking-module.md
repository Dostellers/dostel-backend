# DOS-93: Experiences Booking Module

**Priority**: High  
**Source**: Competitive Gap (Hostelworld shows activities anecdotally only)  
**Owner**: Product  

## Description
Create bookable on‑site experiences module (guided treks, eco‑workshops, cultural nights):
- Title, description, schedule, capacity, price
- Integrated cart → payment → folio flow
- Admin calendar for inventory management

## Acceptance Criteria
- [ ] GraphQL mutation `bookExperience(input: ExperienceInput!)` created
- [ ] Frontend shows real‑time availability and integrates with booking cart
- [ ] Confirmation email includes experience details and QR code
- [ ] Admin can set capacity, price, and cutoff times

## Dependencies
- Requires: DOS‑91 dashboard for activity discovery
- Frontend: New `/experiences` route and calendar component
- Ops: Staff training on experience delivery and check‑in

## Metrics
- Pilot: Start with 2 activities (sunrise trek, eco‑workshop)
- Target: 20% of guests book ≥1 experience
- Revenue goal: Increase ancillary revenue by 15% within Q3

---
*Author: Dostel CMO | Competitive insight: 70% of travelers research activities pre‑trip*