# DO-I911: House-Culture Event Automation

**Summary**: Automate scheduling and execution of recurring cultural activities (dinners, skillshares, treks).

**Priority**: P1
**Owner**: Community Lead

**Why**: The current manual event scheduling via WhatsApp/email leads to low participation rates and inconsistent attendance. Automation will enable daily participation in house culture — critical for fostering community loyalty and ensuring guests experience the full weekly rhythm.

**Key Requirements**:
1. **Event Scheduler**:
   - Auto-create recurring events based on the weekly rhythm (Mon dinner, Tue skillshare, Wed trek, Thu board game, Fri bonfire, Sat volunteer, Sun rest).
   - Allow staff to override, add ad-hoc events, and set capacity per event.

2. **Guest RSVP Flow**:
   - Auto-send RSVP links to eligible members (e.g., via WhatsApp or email).
   - Allow members to RSVP/cancel via a simple button (no extra login).
   - Capture RSVPs in the event model for staff reporting.

3. **Attendance & Completion Tracking**:
   - Auto-mark an event as "completed" when the scheduled time passes (or staff logs completion).
   - Update member profile with "hours contributed" for volunteer/nature impacts.
   - Allow manual override for attendance tracking.

4. **Dashboard & Reporting**:
   - Staff can view upcoming events, RSVPs, attendance, and capacity via admin panel.
   - Members can view their upcoming events, past participation, and progress toward "cultural contribution" badges.
   - Exportable weekly report showing attendance rates and capacity utilization.

**Acceptance Criteria**:
- Events are auto-created each week according to the rhythm table.
- Staff can edit/override any event via the admin panel.
- Members receive an automatic RSVP reminder and can respond with one tap.
- Attendance is logged automatically; staff can override manually.
- A summary report (weekly attendance, capacity utilization) is exportable.

**Dependencies**:
- Event model (must support recurrence & capacity)
- Admin panel scaffold for event creation & overrides
- Notification system (for RSVP reminders)
- Member profile (to store contribution hours)

**Evidence**: Requires additions to `.paperclip/marketing/dostellers/` docs and the `events` schema in the backend.