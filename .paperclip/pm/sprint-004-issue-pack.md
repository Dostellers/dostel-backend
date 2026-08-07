# Dosteller Membership Foundation — Issue Pack (P0)
**Author:** Dostel Product Manager · **Date:** Aug 6, 2026

## Objective
Ship minimal viable Dostellers program to enable tiered membership benefits and referral tracking, unlocking community-driven retention and direct booking conversion.

## Core Issue Sequence
1. [DOS-285](marketing/dostellers/DOS-285.json): Membership sign-up flow with WhatsApp integration (P0) - Enables tiered onboarding  
2. [DOS-286](marketing/dostellers/DOS-286.json): Tiered discount logic at checkout (P0) - Implements member pricing incentives  
3. [DOS-290](issues/DOS-290-eligibility-badge-ui.md): Eligibility badge UI for Dosteller rooms (P1) - Visual indicator for community benefits  
4. [DOS-291](issues/DOS-291-whatsapp-opt-in-flow.md): WhatsApp opt-in flow for community access (P1) - Drives engagement post-signup  
5. [DOS-418](issues/DOS-418-pm-dosteller-discount-payment-calculation.md): Payment logic - Dosteller discount calculation (High) - Ensures accurate discount application

## Supporting Tasks
- [DOS-86](issues/DOS-86-membership-schema.md): Membership schema - Dosteller tier (P1) - *Prerequisite for tier tracking*
- [DOST-92](issues/DOST-92-referral-engine.md): Dosteller referral engine MVP (P1) - Community growth loop
- [DOST-1](issues/DOST-1-channel-manager-sync.md): Sync Vattakanal inventory to channel manager (High) - Long-stay inventory visibility  

## Success Metrics
- 20%+ conversion from signup to paid membership (Silver/Gold tiers)  
- 15% increase in direct bookings from Dosteller members vs. guests  
- <2% error rate in discount application during payment processing  

## Owner
Product Manager (coordination) → Builder/Backend/Frontend (execution)

## References
- Dosteller Program Brief: `/root/dostel-backend/.paperclip/marketing/dostellers/dostellers-community-program-brief.md`  
- Implementation Roadmap: `/root/dostel-backend/.paperclip/marketing/dostellers/dostellers-implementation-roadmap.md`  
- Competitive Analysis: `/root/dostel-backend/.paperclip/marketing/dostel-competitive-usp-brief-aug06.md`  

(End of file - total 40 lines)