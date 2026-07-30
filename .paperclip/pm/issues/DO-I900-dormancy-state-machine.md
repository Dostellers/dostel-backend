# DO-I900: Dormancy → Alumni State Machine

**Summary**: Automate member lifecycle management to re-engage inactive Dostellers and retain alumni.

**Priority**: P1
**Owner**: Community Lead

**Description**: Members should transition between `active`, `dormant`, and `alumni` states based on activity thresholds. Proactive re-engagement campaigns should trigger at key points:
- 30-day inactivity: WhatsApp soft nudge
- 90-day inactivity: Email hard nudge with incentive
- 365-day dormancy: Alumni status + 500 bonus points
- 365-day non-return: Status reset to dormant (or permanent purge)

**Acceptance Criteria**:
1. Monitor `customer.membership.lastActiveDate` daily
2. Auto-update status on booking/event participation
3. Trigger campaigns via notification system
4. Update dashboard filters for status tracking

**Dependencies**:
- Notification system (PMS + admin webhooks)
- Updated `customer.membership.status` enum (active|dormant|alumni)

**Acceptance:** PM accepts implementation when dashboard state management and 90-day re-engagement workflow are deployed.
