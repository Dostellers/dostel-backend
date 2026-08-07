# Dostel Direct Booking Engine Recommendation (Based on Competitive Research)

## Context
From competitive analysis:
- Dostel currently 100% OTA-dependent (Hostelworld active, cash-only)  
- The Hosteller & Zostel have direct booking engines
- Competitive gap: 0% commission-free revenue, no guest email capture, no upsell path

## Recommendation
Build a minimal direct booking widget for Dostel's frontend that:
1. Shows real-time room availability from GraphQL PMS
2. Integrates Dosteller tier pricing (member discounts)
3. Captures guest email for membership nurturing
4. Enables UPI/cashless payments (beyond current cash-only)

## Priority
P0 - Unblocks all membership and pricing initiatives
Blocks: Dosteller dashboard, loyalty program, dynamic pricing

## Source References
- Competitive Landscape: `/root/dostel-backend/.paperclip/research/competitive-landscape.md` (Section 2 & 4)
- Competitive Feature Matrix: `/root/dostel-backend/.paperclip/research/competitive-feature-matrix.md` (Booking Flow row)
- Dostel Competitor Research: `/root/dostel-backend/.paperclip/research/dostel-competitor-research.md` (Section 4.2 & 5.2)