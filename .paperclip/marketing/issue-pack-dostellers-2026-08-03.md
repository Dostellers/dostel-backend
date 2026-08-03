# Issue Pack: Dostellers Program - Pricing Engine & Community Features

## Context
Consolidating technical requirements from multiple briefs into actionable issues for Product team.

## Issues

### DOS-258: Pricing Engine - Dosteller Tier Discount Logic
**Priority**: P0
**Type**: Backend/Pricing

**Description**: Implement rule-based pricing engine that applies correct discounts based on Dosteller tier and stay duration (7+ nights).

**Requirements**:
- Bronze: 10% off long-stay (7+ nights)
- Silver: 20% off long-stay, 10% off events
- Gold: 35% off long-stay, 20% off events
- Integration with existing room availability query (DOS-64)
- Max 50% discount threshold (per points system)

**Dependencies**: DOS-64, DOS-65

---

### DOS-259: Community Program - Eligibility Engine
**Priority**: P0
**Type**: Backend

**Description**: Detect and flag Dosteller eligibility (7+ consecutive nights OR 10 cumulative nights) at booking time.

**Requirements**:
- Automatic flagging on booking record
- Store eligibility status in customer model
- Trigger welcome flow on check-in

**Dependencies**: Booking system

---

### DOS-260: Long-Stay Offer Display Component
**Priority**: P0
**Type**: Frontend

**Description**: Show Dosteller pricing offers in booking flow for eligible guests.

**Requirements**:
- Display on hostel detail page for 7+ night stays
- Show discount percentage and savings
- Link to `/dostellers` for non-members
- Real-time price updates on date change

**Dependencies**: DOS-258, auth context

---

### DOS-261: Event Management System
**Priority**: P0
**Type**: Full-stack

**Description**: Staff CRUD for community events with capacity, pricing, and safety fields.

**Requirements**:
- Create/edit/publish/cancel events
- Set capacity, price (member/free), meeting point
- Safety notes field
- RSVP tracking (anonymous)

**Dependencies**: Community dashboard

---

### DOS-262: Staff Community Dashboard
**Priority**: P0
**Type**: Frontend/Backend

**Description**: Search and manage Dosteller members.

**Requirements**:
- Search by name/email/phone
- View opt-in status and tier
- Export contact list (manual)
- Revoke community access

**Dependencies**: Member model

---

### DOS-263: Points Engine & Redemption
**Priority**: P1
**Type**: Backend

**Description**: Implement points earning and redemption system aligned with Dosteller tiers.

**Requirements**:
- Tiered earning: 5/10/15 pts per ₹100 spent
- Redemption: 100 pts = ₹100 off (max 50%)
- Integration with booking flow
- Points expiry (12 months inactivity)

---

## Status Brief
Submitted to Paperclip:

| Issue | ID | Priority | Status |
|-------|----|----------|--------|
| Pricing Engine - Dosteller Tier Discount Logic | [DOS-485](/DOS/issues/DOS-485) | high | backlog |
| Community Program - Eligibility Engine | [DOS-486](/DOS/issues/DOS-486) | high | backlog |
| Long-Stay Offer Display Component | [DOS-487](/DOS/issues/DOS-487) | high | backlog |
| Event Management System | [DOS-488](/DOS/issues/DOS-488) | high | backlog |
| Staff Community Dashboard | [DOS-489](/DOS/issues/DOS-489) | high | backlog |
| Points Engine & Redemption | [DOS-490](/DOS/issues/DOS-490) | medium | backlog |

**Total Issues**: 6 submitted (DOS-485 through DOS-490)

Sources:
- `.paperclip/marketing/dostellers/dostellers-program-brief.md`
- `.paperclip/marketing/Dostel-Growth-Requirements-Brief-for-Product.md`
- `.paperclip/research/dostellers-implementation-issues.md`