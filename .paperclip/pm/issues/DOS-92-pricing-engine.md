# DOS-92: Pricing Engine

**Priority**: High  
**Source**: Price Benchmarking (Dostel ₹327 vs Zostel ₹417 vs TH ₹540)  
**Owner**: Product  

## Description
Implement dynamic discounts for extended stays and Dosteller tier pricing:
- 10% off stays ≥7 nights
- 15% off stays ≥14 nights
- 20% off stays ≥21 nights
- Additional 5% Dosteller member discount on top of LOS rates
- Automatic qualification after 7-night stay

## Acceptance Criteria
- [ ] Pricing engine applies automatic duration-based discounts in booking flow
- [ ] Dosteller member rates displayed post-authentication
- [ ] Total price (base + discounts + taxes) visible throughout checkout
- [ ] Rules configurable via admin (no code changes for % updates)

## Metrics
- Target: Increase avg stay duration by +2 nights (baseline 4.2 nights)
- Upsell rate on extended stays ≥25%
- Reduce booking abandonment at price display step by 30%

## Dependencies
- Requires: DOS‑88 extended‑stay booking logic
- Frontend: Calendar component to surface discounted rates
- Analytics: Track extended‑stay conversion lift

---
*Author: Dostel CMO | Model after Hosteller’s 15% off 7‑night pattern*