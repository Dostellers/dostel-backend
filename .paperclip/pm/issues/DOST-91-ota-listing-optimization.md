# DOST-91: OTA Listing Optimization (Hostelworld)

**Priority:** Medium (Admin Ops)  
**Owner:** CMO → Builder  
**Requestor:** Product Manager (Admin Ops)  

## Summary
Improve Dostel’s visibility and conversion on Hostelworld by updating the property listing with accurate information, fresh content, and verified payment methods.

---

## Why This Matters
- **Problem:** Dostel is listed on Hostelworld but has outdated photos from 2020 and marks payment as “cash only”, which reduces trust and booking conversions compared to competitors like Zostel and The Hosteller (per `ota-listing-audit-2026-07-30.md`).
- **Impact:** Fixing this could increase booking conversion rate by 8–12% and reduce reliance on high-commission channels.
- **Competitive Context:**  
  - Zostel displays updated dorm photos, accepts UPI/cards, and links directly to their referral program.  
  - The Hosteller emphasizes community-driven copy and real-time booking features.

---

## Action Plan

### Phase 1: Verification (CMO-Assisted)
- [ ] Confirm current payment methods: cash, UPI, or credit cards (coordinate with CRO or front desk manager).
- [ ] Review Hostelworld Manager dashboard access status (check if credentials are active).
- [ ] Validate cleanliness score: verify if public 6/10 rating still reflects current operations.

### Phase 2: Content Update (Builder-Led)
- [ ] Upload at least **10 fresh, high-quality photos**, including:
  - All **room types** (dorm beds, couple rooms, suites)
  - Common areas (shared kitchen, lounge, garden terrace)
  - Community spaces/events (skill shares, bonfires, group dinners)
  - Bathrooms and eco-friendly features
- [ ] Ensure photo captions include alt-text optimized for SEO (e.g., `"Dorm bed at Dostel Vattakanal – clean and cozy accommodation"`).
- [ ] Rewrite property description using the verified positioning template:
  > Stay in Vattakanal near Kodaikanal with a backpacker and long-stay community. Choose from dorms, couple rooms, and suites, meet fellow travelers, and discover activities and networks through the Dostellers community.

### Phase 3: Technical Alignment
- [ ] Update payment section in listing to reflect verified methods (no longer “cash only” if UPI/cards are accepted).
- [ ] Add Dosteller community mention without implying unconfirmed discounts:
  > As a Dosteller, you gain access to exclusive skill shares, guided treks, and peer-to-peer networking opportunities.
- [ ] Sync availability data via DOST-1 (channel manager integration) once live.

### Phase 4: Tracking (Post-Launch)
- [ ] Enable monthly tracking metrics in Paperpoint:
  - Listing views
  - Booking conversion rate
  - Review sentiment score
  - Cleanliness category rating trend

---

## Acceptance Criteria
- [ ] At least 10 new photos uploaded and approved by Hostelworld
- [ ] Property description rewritten using community-first language from `ota-listing-audit-2026-07-30.md`
- [ ] Payment methods updated to reflect actual capabilities
- [ ] Dosteller community mentioned clearly (no speculative discounts)
- [ ] Monthly tracking metrics enabled in Paperpoint or internal analytics system

---

## Dependencies
- **None required before starting**, though pairing with DOST-1 (channel manager sync) post-launch will ensure consistent inventory updates.

## Sources
- Audit Brief: `.paperclip/research/ota-listing-audit-2026-07-30.md`
- Competitive Analysis: `.paperclip/research/competitive-feature-matrix.md`
- Product Gap Analysis: `.paperclip/research/product-gap-analysis.md`
- Hostelworld Listing: https://www.hostelworld.com/hostels/p/302851/dostel-vattakanal/

---

## Notes for Builder / CMO
- Coordinate with local ops (Anna/Prakash) for photo shoot scheduling
- Use existing brand assets under `apps/frontend/public/dostellers/` for interim visuals
- Do not promise specific Dosteller discounts until DOST-86 (membership schema) + DOST-92 (referral engine) are launched
