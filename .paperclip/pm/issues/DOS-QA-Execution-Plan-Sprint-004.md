# QA Execution Plan – Sprint 004
**Date:** Aug 7, 2026
**Target Version:** Dosteller Membership Foundation
**Prepared by:** Product Manager

## Test Suite Scope
| Issue ID | Component | Priority | Complexity | Est. Time |
|----------|-----------|----------|------------|-----------|
| DOS-285 | Signup + WhatsApp | P1 | High | 4 hrs |
| DOS-290 | Eligibility Badge UI | P1 | Medium | 3 hrs |
| DOS-418 | Discount Engine | P0 | High | 5 hrs |
| DOS-286 | Tiered Discount Logic | P1 | Medium | 2 hrs |
| DOS-291 | WhatsApp Opt-In Flow | P1 | Medium | 2 hrs |
| DOS-285 | Edge Cases | P2 | Low | 1 hr |
| DOS-418 | Edge Cases | P2 | Medium | 2 hrs |

## Execution Order (Recommended)
1. **DOS-418 (Discount Engine)** – P0 Critical path for checkout
2. **DOS-290 (Badge UI)** – P1 Visual component, easy to verify
3. **DOS-285 (Signup Flow)** – P1 User entry point
4. **DOS-291 (Opt-in Tracking)** – P1 Referral engine support
5. **DOS-286 (Tiered Discounts)** – P1 Checkout validation
6. **Edge Cases** – P2 Cleanup and robustness

## QA Environment
- **Frontend:** http://65.109.113.80:3001
- **GraphQL:** http://65.109.113.80:4000/graphql
- **Admin Panel:** http://65.109.113.80:3003/admin
- **Test Accounts:** See `.paperclip/pm/issues/DOS-290-qa-test-cases.md`

## Dependencies
- [ ] GraphQL `is_eligible_for_dostellers` field deployed
- [ ] WhatsApp Business API sandbox credentials available
- [ ] Razorpay test credentials provided

## Reporting
- Failures: Tag `#DOS-bug` in Paperclip with reproduction steps
- Blockers: Alert PM immediately (daily sync at 10am)
- Pass Criteria: All P1 tests pass + 80% P2 coverage

## Daily Checkpoints
| Date | Focus Areas | Deliverables |
|------|-------------|--------------|
| Aug 8 | 418 + 290 | Test results summary |
| Aug 9 | 285 + 291 | Bug report log |
| Aug 10 | 286 + Edge Cases | Final coverage report |