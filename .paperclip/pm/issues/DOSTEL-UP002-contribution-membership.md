# DOSTEL-UP002: Contribution Membership
**Priority:** P1
**Owner:** Product Manager
**Requestor:** Competitive Analyst

## Description
Build the Dosteller membership system as a core differentiator. Verified Dostellers earn portable credit and reputation for hosting skill shares, helping guests, and creating local guides. This pairs community hostel soul with enterprise-grade digital craft — not by cloning Zostel's network size.

## Competitive Gap
- Zostel: Gamified $Zo currency, quests, points (~https://www.zostel.com/)
- The Hosteller: Flat-rate membership with booking discounts (~https://www.thehosteller.com/membership/)
- Cloudbeds: No community loyalty product; generic CRM guest marketing (~https://www.cloudbeds.com/)
- OTA Operators: Simple referral programs

## USP Framing (CMO)
**"Travel with locals, stay with friends"** — peer-driven community vs transactional OTA loyalty. Dosteller credit is portable across properties and fuels trust.

## Key Features
1. `Dosteller` type with `tier`, `points`, `joinedAt`
2. Tiered structure: Explorer → Nomad → Wanderer
3. Contribution tracking: hosted skill shares, helped guests, created local guides
4. Transferable credit redeemable for stays, activities, or workspace access

## Acceptance Criteria
- [ ] `isDosteller` flag accessible via user profile query
- [ ] Tier progression is visible and gamified
- [ ] Contribution actions (skill share, guest help, local guide) earn credit
- [ ] Dosteller credit is portable across all Dostel properties

## Metrics
- 50% increase in user signup completion (membership incentive)
- 30% increase in community event RSVPs from Dostellers

## Dependencies
- DOS-65 (membershipPlans + Dosteller schema)

## Sources
- Zostel: https://www.zostel.com/
- The Hosteller: https://www.thehosteller.com/membership/
- Cloudbeds: https://www.cloudbeds.com/
- Product gap baseline: ./product-gap-analysis.md