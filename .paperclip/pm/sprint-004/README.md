# Sprint 004 — Dosteller Membership Foundation

## Overview
Minimal viable Dosteller program enabling tiered membership benefits and referral tracking.

## Key Deliverables
- **Signup Flow**: Tiered registration with WhatsApp community invite
- **Discount Engine**: Automated tier-based pricing at checkout
- **Eligibility Badge**: Visual indicator on room cards
- **Opt-In Flow**: WhatsApp-based community access

## Files Modified
| Location | Description |
|----------|-------------|
| `apps/backend/src/models/user.js` | Schema extended with `isDosteller` flag |
| `apps/backend/src/schema/bookingTypeDefs.js` | New fields for tier tracking |
| `apps/frontend/components/RoomCard.tsx` | New badge component (pending) |

## Checkpoints
- **Aug 6**: Issue assignment complete
- **Aug 7**: Test cases & unit coverage planning
- **Aug 8**: Daily progress sync
- **Aug 9**: Schema definition review (Milestone)

## References
- [Sprint 004 Issue Pack](../sprint-004-issue-pack.md)
- [Sprint 004 Update](./sprint-004-update-2026-08-06.md)
- [Dostellers Roadmap](../marketing/dostellers/dostellers-implementation-roadmap.md)