# DOS-391: Verified Hill-Stay Card Measurement Workflow

## Type: PM/Backend

## Priority: High

## Source
- Competitive-gap-analysis.md – rows 13-15 (gap analysis)
- Hostelworld Kodaikanal market research – no verified claims observed
- The Hosteller property detail: undated amenity claims (thehosteller.com/hostels/the-hosteller-kasol-parvati-valley/)
- Competitive landscape analysis: cloudbeds.com/hostels/

## Problem
Competitors (Zostel, The Hosteller) present static amenity claims. Dostel can differentiate with timestamped proof of hill-stay reliability.

## Opportunity
Implement 5 verification touchpoints:
1. Wi-Fi speed test (timestamped, location-tagged)
2. Power backup verification (uptime duration + battery level)
3. Carrier signal strength (location-based mapping)
4. Weather resilience (rain/snow impact logging)
5. Physical access verification (gatekeeper check-in)

## Acceptance Criteria
- [ ] IoT sensor integration for automated measurements
- [ ] Dosteller check-in UI for manual verification
- [ ] Public verification badge display on property pages
- [ ] API endpoint for PMS to fetch verification tokens
- [ ] Tamper-proof proof (blockchain or cryptographic hash)

## Technical Requirements
- Edge devices for connectivity testing at Vattakanal location
- GPS/location tagging for measurement context
- Time-series database for historical trending
- API: `GET /api/verification/:propertyId?dateRange=`

## Assumptions
- Hardware sensors can be provisioned at Vattakanal within 60 days
- Dosteller community will perform 70% of manual checks
- Verification badges increase booking conversion by 15% (industry benchmark)

## Revenue Impact
- Reduces cleanliness review concerns (currently 6.0/10)
- Enables higher pricing for "Verified" tier
- Builds trust for long-stay/colive bookings

## Status
ready