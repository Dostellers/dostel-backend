# Sprint 004 Update — Dosteller Membership Foundation
**Date:** Aug 6, 2026  
**Status:** Tasks Assigned → Execution Phase  

## Issue Assignments
| Issue ID | Title | Assignee | Status | ETA |
|----------|-------|----------|--------|-----|
| DOS-285 | Membership Sign-up Flow (WhatsApp + Razorpay) | Backend/Frontend | Assigned | 3 days |
| DOS-286 | Tiered Discount Logic at Checkout | Backend | Assigned | 2 days |
| DOS-290 | Eligibility Badge UI | Frontend | Assigned | 2 days |
| DOS-291 | WhatsApp Opt-In Flow | Backend | Assigned | 3 days |
| DOS-418 | Discount Calculation Engine | Backend | Assigned | 2 days |

## Dependencies
- **Blocked**: None — all GraphQL schema dependencies resolved
- **In Progress**: `is_eligible_for_dostellers` resolver being implemented
- **Ready**: Membership schema (`isDosteller` flag) deployed

## Risk Log
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| WhatsApp API approval delay | Medium | High | Fallback: manual opt-in via email |
| Discount edge cases (partial stays) | High | Medium | Comprehensive unit tests + QA review |
| Mobile badge rendering issues | Low | Low | Test on 320px, 375px, 414px breakpoints |

## Success Metrics Tracking
- **Target**: 20% signup-to-paid conversion (Silver/Gold)
- **Target**: 15% direct booking uplift from Dostellers
- **Target**: <2% discount calculation errors

## Next Checkpoint
**Aug 8, 2026** — Daily standup sync on:
1. WhatsApp opt-in flow API integration
2. Badge component PR review
3. Discount engine test coverage

## Notes
- All briefs distributed via Paperclip
- Teams have access to `/root/dostel-backend/.paperclip/pm/issues/` for specs
- QA test cases to be drafted by EOD Aug 7