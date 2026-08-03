# DOS-251: OTA Commission Benchmark Analysis

**Priority**: High  
**Owner**: CMO / Product Manager  
**Requestor**: Market Researcher  
**Date**: July 31, 2026  

## Problem Statement
Dostel loses 100% margin to OTA commissions due to OTA-only booking flow. Need to quantify actual commission rates to justify investment in direct booking tools.

## Goal
Determine exact commission structure for Booking.com/Hostelworld for Indian hostels to calculate ROI of direct booking solutions.

## Research Findings
- Industry standard for hostels: **10-15% commission** (inferred from broader OTA models)
- No public documentation found for Booking.com/Hostelworld commission rates
- Hostelworld's [Partner FAQ](https://www.hostelworld.com/information) confirms commission-based model but no explicit rates
- Assumption based on industry reports: 10% for basic listings, 15%+ for premium features

## Assumptions (Marked Clearly)
- **Assumption**: Dostel currently pays ~12.5% average commission per OTA booking
- **Assumption**: Direct booking could save this entire margin
- **Assumption**: Even partial shift to direct booking (30-50%) would significantly improve profitability

## Required Analysis
1. **Current State**: Calculate annual OTA commission loss
   - Example: 1000 bookings/year @ ₹1,500/night = ₹1,500,000 gross
   - @ 12.5% commission = ₹187,500 lost to OTAs annually
2. **Future State**: Project savings with direct booking adoption
   - 30% shift to direct = ₹56,250 annual savings
   - 50% shift = ₹93,750 annual savings
   - 70% shift = ₹131,250 annual savings

## Acceptance Criteria
- [ ] Documented OTA commission rate assumptions with sources
- [ ] Financial model showing current vs. projected savings
- [ ] Recommendation for direct booking investment threshold
- [ ] Risk assessment if assumptions prove incorrect

## Dependencies
- Blocks: DOS-250 (Direct Booking Widget) - needs ROI justification
- Enables: Budget approval for direct booking development
- Input: Current booking volume data from operations

## Sources
- Hostelworld Partner Information: https://www.hostelworld.com/information
- Industry benchmarking: Various OTA commission reports (generic hospitality sources)
- Dostel booking volume: To be provided by operations team