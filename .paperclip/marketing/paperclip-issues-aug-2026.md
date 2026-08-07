# Paperclip Issues: Dostel Marketing Sprint (Aug 2026)

## Updated: Dosteller Program Issues
**Status**: SUBMITTED to Paperclip (see `/.paperclip/marketing/issue-pack-dostellers-2026-08-03.md`)

| Issue | ID | Priority | Status | Description |
|-------|----|----------|--------|-------------|
| Pricing Engine Tier Discount Logic | [DOS-485](/DOS/issues/DOS-485) | high | backlog | Tiered discounts for Bronze/Silver/Gold members |
| Community Program Eligibility Engine | [DOS-486](/DOS/issues/DOS-486) | high | backlog | Auto-detect 7+ night eligibility |
| Long-Stay Offer Display Component | [DOS-487](/DOS/issues/DOS-487) | high | backlog | Show Dosteller pricing in booking flow |
| Event Management System | [DOS-488](/DOS/issues/DOS-488) | high | backlog | Staff CRUD for community events |
| Staff Community Dashboard | [DOS-489](/DOS/issues/DOS-489) | high | backlog | Member search & management tools |
| Points Engine & Redemption | [DOS-490](/DOS/issues/DOS-490) | medium | backlog | Tiered points earning & redemption |

---

## Issue 1: Digitize Dostellers Community Hub
**Priority**: P0 (blocks unique differentiation)
**Type**: Feature
**Owner**: PM / Frontend Lead

**Context**: Dostel's only moat vs Zostel/TH is the "Dostellers" long-stay community with ecological restoration narrative. Currently not digitized at all.

**Acceptance Criteria**:
- [ ] `/dosteller` page on guest site (mobile-first PWA)
- [ ] Show: upcoming skill-shares, points balance, local discounts, peer directory
- [ ] Integrate with GraphQL: `me { dostellerStatus, upcomingActivities, pointsBalance }`
- [ ] Link from post-booking confirmation email/SMS

**Dependencies**: DOS-485, DOS-486, DOS-490

**Estimated Effort**: 1-2 sprints

**Related**: See submitted issues [DOS-485-DOS-490](/DOS/issues/DOS-485)

---

## Issue 2: Direct Booking Engine with UPI Split Payments
**Priority**: P0 (revenue impact)
**Type**: Feature
**Owner**: PM / Backend Lead

**Context**: 100% OTA dependency = ~12.5% commission loss. Zostel & TH have direct booking. Cash-only limits conversions.

**Acceptance Criteria**:
- [ ] Room availability query (P1 blocker in current PMS)
- [ ] Calendar widget with real-time rates on frontend
- [ ] UPI/card payment integration (Razorpay/PhonePe)
- [ ] Split payment: 25% deposit → balance on arrival
- [ ] Auto-sync bookings to PMS + channel manager (later phase)

**Dependencies**: roomAvailability query, payment schema, webhook handlers

**Estimated Effort**: 2-3 sprints

**Revenue Impact**: ~₹187,500/year saved (est. 300 bookings × ₹1,500 avg)

---

## Issue 3: Hostelworld Listing Overhaul (Cleanliness + Community Narrative)
**Priority**: P1 (conversion improvement)
**Type**: Marketing / Content
**Owner**: CMO / Ops

**Context**: 6/10 cleanliness score hurts conversion. Community narrative absent. Zostel leads with events/quests.

**Acceptance Criteria**:
- [ ] Cleanliness score: 6 → 8+ (photos of made beds, tidy common areas)
- [ ] Dostellers featured in first 3 lines of description
- [ ] Add "Meet the Dostellers" section: skill-share calendar, local discounts
- [ ] 3+ verified testimonials mentioning community/vibe
- [ ] Enable online payment (currently cash-only)

**Dependencies**: Ops team for photos, staff training for cleanliness

**Timeline**: 7 days (align with Marketing sprint)

---

## Issue 4: PMS Parity Check vs Cloudbeds
**Priority**: P1 (build-vs-buy decision)
**Type**: Research / Decision
**Owner**: PM / CTO

**Context**: Custom PMS has gaps (availability, Dostellers, payments). Cloudbeds: ~$50-150/mo with all-in-one.

**Acceptance Criteria**:
- [ ] Cost estimate to close P1 gaps in custom PMS (dev hours × rate)
- [ ] If >$5k dev cost, recommend hybrid: Cloudbeds for ops + custom Dostellers layer
- [ ] Decision documented in ADR

**Dependencies**: Engineering capacity estimate

**Timeline**: 1 week