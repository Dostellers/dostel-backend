# Dostel Marketing Requirements: Pricing Rules Engine

## Overview
Based on competitive research showing Dostel has the lowest base rate (₹327/night) but lacks competitive booking engines, this brief documents pricing requirements to convert price advantage into bookings while enhancing Dosteller value proposition.

## Competitive Pricing Context

### Current Market Position (From Price Benchmark)
- **Dostel Vattakanal**: ₹327/night (base dorm) - **lowest of three**
- **Zostel Kodaikanal**: ~₹417/night (€4.63 × 90)
- **The Hosteller Kodaikanal**: ~₹540/night (€6.00 × 90)

### Key Observations
1. Dostel has price advantage but no dynamic pricing engine
2. Competitors offset higher prices with booking flexibility and membership perks
3. Dostel's Dosteller program (long-stay perks) is not prominently displayed or bookable
4. OTA platforms show static rates; chains offer "Stay 3N, Pay 2N" style discounts

## Marketing-Driven Pricing Requirements

### 1. **Extended-Stay Incentives** (Priority: High)
**Why**: Convert Dostel's nightly price advantage into longer bookings while showcasing Dosteller value
- **Requirement**: Length-of-stay discounts visible in booking engine
- **Implementation**: 
  - 10% off stays ≥7 nights
  - 15% off stays ≥14 nights  
  - 20% off stays ≥21 nights
- **Marketing Impact**: Enable messaging "Stay longer, save more – and unlock Dosteller perks"

### 2. **Dosteller Tier Pricing** (Priority: High)  
**Why**: Create tangible upgrade path for long-term guests and increase LTV
- **Requirement**: Member-exclusive rates visible after login/signup
- **Implementation**:
  - Dosteller members get additional 5% discount on top of LOS rates
  - Automatic Dosteller qualification after 7 nights stay
  - Tiered benefits visible in pricing (1 month = cafe discount, 3 months = workshop access)
- **Marketing Impact**: Support "Become a Dosteller. Save more the longer you stay" campaigns

### 3. **Bundled Activity Packages** (Priority: Medium)
**Why**: Increase revenue per booking while showcasing community programming
- **Requirement**: Pre-bookable activity bundles with pricing discounts
- **Implementation**:
  - "Community Access Pack": 3 skill-shares + 2 treks (15% discount)
  - "Workation Bundle": Dedicated workspace + weekly activities (10% discount)
  - "Eco Immersion": Volunteer projects + restoration workshops (package pricing)
- **Marketing Impact**: Enable upsell messaging "Add experiences and save"

### 4. **Dynamic Rate Transparency** (Priority: Medium)
**Why**: Reduce booking abandonment by showing total cost upfront vs. OTAs
- **Requirement**: Clear breakdown of rates, taxes, and fees in booking flow
- **Implementation**:
  - Display base rate + applicable discounts + taxes
  - Show "You save ₹X with Dosteller status" badges
  - Total price visible before payment step
- **Marketing Impact**: Support "Transparent pricing with no surprises" messaging

## Acceptance Criteria for Product

### Core Functionality
- [ ] Pricing engine applies automatic duration-based discounts
- [ ] Dosteller member rates display after authentication
- [ ] Activity bundle pricing shows savings vs. a la carte
- [ ] Total price (base + discounts + taxes) visible throughout booking

### Integration Points
- [ ] GraphQL mutation `updateRatePlan` supports rule-based pricing
- [ ] Frontend calendar/product cards surface discounted rates
- [ ] Post-booking confirmation shows earned Dosteller progress
- [ ] Admin interface allows rule configuration (no code changes for % updates)

### Analytics & Tracking
- [ ] Track conversion lift from pricing displays
- [ ] Monitor uptake of Dosteller tier vs. standard bookings
- [ ] Measure revenue per booking increase from bundles
- [ ] Attribute longer stays to specific pricing incentives

## Marketing Dependencies & Timing

### Content Needs
- Update booking page copy to highlight "Save up to 20% on extended stays"
- Create Dosteller tier comparison chart (standard vs. member pricing)
- Develop email sequence: "Your Dosteller savings unlocked"
- Design in-app notifications for pricing benefits achievement

### Launch Coordination
- Align with Dosteller Dashboard launch (shows points/membership progress)
- Coordinate with Experiences Bundle release for cross-selling
- Time with seasonal rate adjustments (monsoon/winter pricing)

## Success Metrics
- Increase in average stay duration (target: +2 nights)
- Percentage of bookings showing Dosteller savings (target: 40%)
- Upsell rate on activity bundles (target: 25% of extended stays)
- Reduction in booking abandonment at price display step

---
*Author: Dostel CMO* | *Based on competitive pricing benchmark and Dosteller program insights*