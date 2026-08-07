# DOST-97: In-App Communication Layer (Guest Hub)

**Priority**: P2  
**Owner**: Builder (Full Stack)  
**Requestor**: Product Manager (Guest Experience)  

## Why  
OTA messaging (Glu, Hostelworld) is fragmented. Dostel currently relies on WhatsApp/email, which creates no-shows and poor engagement. A real-time guest portal improves retention and reduces operational overhead.

## Scope (MVP Guest Hub)
1. **Announcements Feed**  
   - House rules, event updates, weather alerts  
   - Admin-posted, timestamped, read-receipts  
2. **Peer Coordination**  
   - Group chat for shared activities  
   - "Looking for trekking buddy" board  
3. **Notifications**  
   - Booking confirmations, payment reminders  
   - Activity reminders (24hr before)  

## Files
- `apps/frontend/app/hub/page.tsx` (new)
- `apps/frontend/components/AnnouncementFeed.tsx` (new)
- `apps/frontend/components/PeerBoard.tsx` (new)
- `apps/backend/src/schema/notification.types.ts` (new)
- `apps/backend/src/resolvers/notification.resolvers.ts` (new)

## Acceptance Criteria
- [ ] Announcements visible on hub with read receipts
- [ ] Peer board allows opt-in messaging (no PII exposure)
- [ ] Booking notifications trigger on payment completion
- [ ] Admin can post without code changes (future)

## Dependencies
- **DOS-86** (membership schema) — for user context
- **DOST-92** (referral engine) — for notification triggers

## Source
- `.paperclip/marketing/Dostel-Growth-Requirements-Brief-for-Product.md` (Competitive Research Gap #4)