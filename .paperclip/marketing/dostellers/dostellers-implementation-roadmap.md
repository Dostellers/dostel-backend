# Dostellers Implementation Roadmap

**Purpose:** Sequence of rollout phases connecting migration strategy to full program launch  
**Audience:** PM, Builder, Community Lead, Ops  
**Timeline:** 8-week pilot to full implementation

## Phase 0: Foundation (Weeks 1-2)
*Goal: Build core eligibility and consent infrastructure*

| Component | Owner | Deliverable | Dependencies |
|-----------|-------|-------------|--------------|
| Eligibility flag in GraphQL | Backend | `is_eligible_for_dostellers` field | PMS night-stay data |
| Consent capture endpoint | API | `/api/v1/dostellers/opt-in` | WhatsApp opt-in flow |
| Badge UI mockup | Frontend | Eligibility badge component | Booking search results |
| Migration strategy doc | Community Lead | Finalized funnel & messaging | Competitive analysis |

## Phase 1: Awareness & Opt-In (Weeks 3-4)
*Goal: Signal eligibility and capture initial opt-ins*

| Component | Owner | Deliverable | Success Metric |
|-----------|-------|-------------|----------------|
| Eligibility badge in search | Frontend | Visible badge on room cards | Badge view rate |
| Opt-in flow in booking | Frontend/Backend | 2-click WhatsApp join | Opt-in conversion |
| Consent storage | Database | `dosteller_opt_in` flag | Data integrity |
| Welcome message automation | Ops | Template for first contact | Response rate |

## Phase 2: Network Activation (Weeks 5-6)
*Goal: Convert opt-ins to active participants*

| Component | Owner | Deliverable | Success Metric |
|-----------|-------|-------------|----------------|
| Activity recommendation | Backend | Rule-based suggestions | Click-through rate |
| First-activity prompt | Frontend | In-app/WA notification | RSVP to first event |
| Staff calendar template | Community Lead | Pre-built weekly schedule | Staff adoption |
| RSVP privacy framework | Backend | Anonymous attendance tracking | Privacy compliance |

## Phase 3: Retention & Growth (Weeks 7-8)
*Goal: Establish feedback loops and scale*

| Component | Owner | Deliverable | Success Metric |
|-----------|-------|-------------|----------------|
| Post-stay survey | Backend | 2-question intent check | Survey completion |
| Alumni channel | Ops | Low-traffic WA group | Member retention |
| Skillshare facilitator path | Community Lead | Recognition system | Facilitator sign-ups |
| Analytics dashboard | Analytics | Opt-in → attendance → return intent | Cohort tracking |

## Phase 4: Full Integration (Ongoing)
*Goal: Embed Dostellers in core guest journey*

| Enhancement | Owner | Description |
|-------------|-------|-------------|
| Dynamic eligibility | Backend | Real-time cumulative night calculation |
| Personalized activity feed | Frontend | Based on past participation |
| Host referral system | Community Lead | Guest-hosted skill-share recognition |
| Cross-property benefits | Product | Eligibility stays at any Dostel property |
| Impact reporting | Ops | Monthly community contribution metrics |

## Key Dependencies & Risks

### Technical Dependencies
1. PMS must expose `stay_duration` and `guest_id` via GraphQL
2. Booking flow must allow custom UI injection (eligibility badge)
3. WhatsApp Business API access for automated messages
4. Consent management system must support granular opt-in fields

### Risk Mitigation
- **Low opt-in rate:** A/B test badge placement and messaging
- **Technical delays:** Build manual eligibility check as fallback
- **Privacy concerns:** Implement strict data minimization from day one
- **Staff adoption:** Create simple one-page workflow guides

## Success Criteria (Pilot)
- 30%+ of eligible guests view eligibility badge
- 15%+ opt-in conversion from badge view
- 50%+ of opt-ins attend at least one activity
- 20%+ retention rate (return intent at checkout)
- Zero privacy/compliance incidents

## Next Steps
1. Review and approve migration strategy (`dostellers-migration-strategy.md`)
2. Finalize technical specs in `dostellers-issues-for-pm.md`
3. Create Paperclip tickets for DOS-280 through DOS-284
4. Begin Phase 0 development sprint

*This roadmap reads as a standalone planning document that can be added to `/root/dostel-backend/.paperclip/marketing/dostellers/` for team alignment.*