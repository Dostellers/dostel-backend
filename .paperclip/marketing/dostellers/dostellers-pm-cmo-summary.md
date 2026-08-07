# Dostel Dostellers Community Program: PM/CMO Summary

## Overview
Long-stay community program designed for travelers staying 7+ nights, inspired by Bob & Tanya 1985 ecological community ethos. Built for OmniRoute-free implementation with 8 core components:

1. **Membership Model**
- 7+ night threshold or 10 cumulative nights
- Benefits: Weekly benefits without monetary incentives

2. **Event System**
- 7 activity categories with staff-assigned compliance checks
- RSVP capacity limits and waitlist management

3. **Retention Strategy**
- Post-stay neutral invitation at 60-90 days
- Skillshare facilitator recognition system

## Technical Requirements
### P0
- Membership eligibility engine in booking flow
- Event management CRUD with owner field
- Guest RSVP privacy framework

### P1
- Skillshare facilitator flag in member profile
- Real-time RSVP count dashboard
- Post-stay surveys integrated with analytics

## Dependent Components
- Optional: Check existing fields `stay_type.nights`, `guest.categories`
- Required: PMS `is_dosteller` flag for eligible guests
- Future dependency: Payment rule engine for USP integration

Documentation package complete in `/root/dostel-backend/.paperclip/marketing/dostellers/`
Variables marked with [ASSumption] tag where extrapolation required