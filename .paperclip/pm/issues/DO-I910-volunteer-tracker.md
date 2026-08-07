# DO-I910: Volunteer Hours Tracker

**Summary**: Track volunteer time for badges/rewards and community engagement.

**Priority**: P2
**Owner**: Community Lead

**Description**: Log volunteer hours per member, award badge at thresholds, surface on profile & dashboard.

**UI Flow**:
1. Staff logs volunteer hours via admin panel (manual entry or event-based)
2. System tracks cumulative hours per member
3. At 20 hours: auto-award "Hometown Hero" badge
4. Dashboard shows progress bar: "15/20 hours to Hometown Hero"

**Acceptance Criteria**:
1. Admin UI to log volunteer hours per member
2. Cumulative tracking stored in `customer.volunteerHours`
3. Badge auto-award at 20 hours
4. Dashboard widget showing volunteer progress

**Dependencies**: Badge model, volunteer event tagging, manual staff input UI

**Evidence**: `.paperclip/marketing/dostellers/dostellers-program-iteration-v3.md` issue 5.
