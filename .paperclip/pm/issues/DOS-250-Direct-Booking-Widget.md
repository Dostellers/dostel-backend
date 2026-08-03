# DOS-250: Direct Booking Widget MVP

**Priority**: High  
**Owner**: Product Manager  
**Requestor**: Market Researcher  
**Date**: July 31, 2026  

## Problem
Dostel loses 100% margin to OTA commissions due to OTA-only booking flow. Competitors (Zostel, The Hosteller) offer seamless direct booking with local payment options.

## Goal
Build an embedded widget using `roomAvailability` GraphQL resolver + UPI/phone payment to capture commission-free reservations.

## Requirements
1. **Live Availability**: Integrate with `roomAvailability` to show real-time bed/suite counts.
2. **Payment Integration**: UPI/phone-based payments (no card dependency; assume 25% hold, balance reminder).
3. **Minimal UI**: Date picker, room type selector, guest details, confirmation screen.
4. **Mobile-Optimized**: PWA-first, low-data mode for Vattakanal connectivity.

## Competitive Benchmark
- Zostel: App-native booking flow with instant confirmation.  
- Cloudbeds: Embedded booking engine with mobile-first checkout.  

## Citation
- Zostel: https://www.zostel.com/
- Cloudbeds: https://www.cloudbeds.com/booking-engine/