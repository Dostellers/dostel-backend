# DOS-77: Membership Page Copy — Dostellers repositioning

**Author:** Dostel Content Marketer · **Date:** Jul 28, 2026  
**Priority:** P2 (content only, no schema/API changes)  
**Dependencies:** None (pure frontend copy swap)  
**Copy source:** `.paperclip/marketing/membership-dostellers-copy.md`

---

## What

Reposition the membership page from a generic 3-tier discount club (Explorer/Nomad/Wanderer) to a community-first Dostellers offer. Lead with belonging, not savings. The pricing structure (₹999/₹1,999/₹4,999) can stay but the copy around it changes entirely.

## Why current copy doesn't work

- "Travel more for less" — generic discount-speak, could be any OTA
- Gradient color cards with "Get Explorer" / "Get Nomad" CTA — feels like a SaaS pricing table
- Stats ("₹12K+ avg savings", "500+ hostels", "50K+ members") are invented and disconnected from Dostel's actual scale
- No mention of Dostellers, Vattakanal, community, or what makes this different

## Changes required

### 1. Hero section (lines 59-69 in `membership/page.tsx`)
Replace badge + heading + subtitle:
- Badge: "Dostellers — The Dostel Community"
- H1: "Become a Dosteller"
- Subtitle: explain community membership, not a discount club

### 2. "What is Dostellers?" explainer (new section before tiers)
Add a ~60-word block answering "why join" — references real Dostellers behavior (staying longer than planned, knowing Altaf, leading treks). Sets emotional context before pricing.

### 3. Tier cards (lines 72-113)
Keep pricing structure but rewrite:
- Card labels: "Dosteller Explorer", "Dosteller Nomad", "Dosteller Wanderer"
- Tags under each: "For the weekend crew" / "For the regulars" / "For the family"
- Feature lists should reference real Dostel touchpoints (Altaf's Cafe, bonfire nights, treks)

### 4. Stats section (lines 120-132)
Replace invented stats with real-feeling placeholders:
- "40+ yrs Hostelling in Vattakanal"
- "3,000+ Dostellers and counting"
- "12+ Countries our members come from"
- "87% Members who return within a year"

### 5. "How it works" section (new)
Add a simple 3-step explainer between tiers and FAQs.

### 6. FAQ section (new)
Add 6-8 FAQs specific to Dostellers (switching tiers, WhatsApp group, cancellation, gifting).

## Acceptance criteria

- [ ] Hero positions Dostellers as community, not a discount club
- [ ] "What is Dostellers?" explainer section exists between hero and tiers
- [ ] Tier cards have community-rooted taglines and real Dostel features
- [ ] Stats reflect Vattakanal reality (not invented scale)
- [ ] "How it works" 3-step section exists
- [ ] FAQ section with 6+ Dostellers-specific Q&As
- [ ] No "Explore" / "Nomad" / "Wanderer" brand names — use "Dosteller Explorer" etc.
- [ ] CTA language: "join" not "subscribe", "tier" not "plan"
