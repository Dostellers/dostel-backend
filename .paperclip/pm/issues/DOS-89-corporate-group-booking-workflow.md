# DOS-89: Define Corporate Group Booking Workflow & Member-Exclusive Extended-Stay Rates

**Priority**: Medium  
**Owner**: Product Manager  
**Requester**: Market Researcher  
**Date**: July 30, 2026  

## Problem
Competitors like The Hosteller and Zostel are proactively targeting corporate groups and remote workers with dedicated group booking workflows and extended-stay rates, while Dostel's current setup lacks these capabilities. This creates a gap in capturing B2B revenue and appealing to remote workers seeking long-term accommodations.

## Competitive Context
- **The Hosteller**: Explicit "Workation" (4-8 weeks) and "Colive" (3+ months) product lines with separate pricing
- **Zostel**: Corporate group booking discounts through B2B portal, community events for groups
- **Cloudbeds/Mews**: Dynamic pricing with seasonal adjustments and corporate rate management
- **Dostel**: No dedicated group workflow, no extended-stay tiers, no corporate rate functionality

## Key Requirements

### 1. Corporate Group Booking Workflow
- Inquiry form for 10+ guests (company name, travel purpose, dates)
- Custom quote generation with options for:
  - Block booking discounts
  - Private room allocations
  - Dedicated space (e.g., meeting rooms)
  - Group activity packages
- Administrative dashboard for managing corporate accounts
- Custom invoicing and payment terms (Net 30)
- Corporate loyalty program integration

### 2. Member-Exclusive Extended-Stay Rates
- Tiered discounts based on stay duration (7+ nights, 30+ nights)
- Member-only rates with auto-application for logged-in Dostellers
- Automatic upgrade eligibility for longer stays
- Integration with membership schema (DOS-65)
- Minimum stay requirements for specific room types

### 3. Dynamic Pricing Integration
- Seasonal adjustments for extended stays (summer peak, monsoon discounts)
- Occupancy-based pricing for weekdays vs weekends
- Member-exclusive promotions (e.g., "Stay 30 nights, get 1 free")
- Visual pricing preview in booking flow

## Acceptance Criteria
- [ ] Corporate inquiry form captures required B2B details
- [ ] Quote generation supports configurable discount rules
- [ ] Member-exclusive extended-stay rates auto-apply based on tenure
- [ ] Dynamic pricing rules configurable via admin panel
- [ ] Integration with existing payment gateway for deposits
- [ ] Display member and group rates in booking UI

## Dependencies
- Blocks: DOS-88 (extended-stay booking flow) - needs rates to apply
- Requires: DOS-65 (membership schema) - for member-exclusive rates
- Requires: DOS-90 (dynamic pricing engine) - technical implementation
- Enables: B2B sales outreach, remote worker acquisition strategy

## Sources
- The Hosteller Workation/Colive: https://www.thehosteller.com/workations/, https://www.thehosteller.com/colive/
- Zostel Corporate Group Bookings: https://zostel.com/group-bookings/
- Cloudbeds dynamic pricing documentation: https://www.cloudbeds.com/blog/dynamic-pricing/
- Competitive analysis: .paperclip/research/hostel-coliving-ota-competitive-analysis-part2.md
- Market Research observation: Corporate groups represent 15-20% of extended stay bookings in comparable hostels (Hostelworld data)