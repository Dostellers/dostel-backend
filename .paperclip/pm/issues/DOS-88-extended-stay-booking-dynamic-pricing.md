# DOS-88: Build Extended-Stay Booking Flow with Dynamic Pricing

**Priority**: Medium  
**Owner**: Product Manager  
**Requestor**: Market Researcher  
**Date**: July 29, 2026  

## Problem
Dostel's workation/colive pages are stubs with no booking capability, while competitors like The Hosteller offer 4-8 week workation packages and 3+ month colive options. This creates a gap in capturing long-stay remote workers and corporate groups.

## Competitive Context
- **The Hosteller**: Dedicated Workation (4-8 weeks) and Colive (3+ months) products with separate pricing
- **Zostel**: Corporate group bookings with discounts and community events
- **Cloudbeds/Mews**: Dynamic pricing engines with seasonal adjustments
- **Dostel**: No long-stay booking flow, no dynamic pricing, no corporate rates

## Requirements

### 1. Extended-Stay Booking Logic
- Duration-based pricing tiers (weekly, monthly, 3+ months)
- Automatic long-stay discounts
- Flexible check-in/check-out dates
- Room type selection (dorm, couple room, suite)
- Deposit and payment schedule for long stays

### 2. Dynamic Pricing
- Seasonal rate adjustments (peak summer, monsoon, holidays)
- Occupancy-based pricing
- Member discounts for Dostellers
- Corporate/group rate codes

### 3. Corporate/Group Booking
- Inquiry form for 10+ guests
- Custom quote workflow
- Company billing/invoicing
- Group activity packages

### 4. Dostellers Integration
- Member-only extended stay rates
- Automatic Dosteller qualification after X nights
- Benefits unlock based on stay duration
- Community event access during stay

## Acceptance Criteria
- [ ] Extended-stay booking supports 7+ night reservations
- [ ] Pricing automatically applies duration discounts
- [ ] Seasonal rate rules can be configured in admin
- [ ] Corporate inquiry form captures group requirements
- [ ] Dosteller member rates integrate with booking flow
- [ ] Payment schedule supports deposits + installments

## Dependencies
- Requires: DOS-64 (room availability query)
- Requires: DOS-65 (Dostellers membership schema)
- Requires: DOS-70 (booking creation UI)
- Enables: Workation/colive product launch

## Sources
- The Hosteller Workations: https://www.thehosteller.com/workations/
- The Hosteller Colive: https://www.thehosteller.com/colive/
- Cloudbeds hostel PMS: https://www.cloudbeds.com/solutions/hostels/
- Competitive analysis: .paperclip/research/hostel-coliving-ota-competitive-analysis-part2.md