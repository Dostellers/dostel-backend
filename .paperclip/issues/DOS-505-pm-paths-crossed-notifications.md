# DOS-505: Paths crossed — notify guests when someone they stayed with is nearby

## Priority: P1
## Type: Product / Full-stack
## Parent: DOS-500 (Guest Graph)

### Source
- Founder direction, Aug 7 2026: "a place where a person gets notified if they
  have shared room or hostel" — togetherness as the core Dosteller vibe
- Builds on `Customer` as system of record (DOS-500) + booking history

### Problem
The best thing that happens in a hostel is meeting someone; the worst thing the
industry does is let that connection die at checkout. Two people who shared Dorm 4
in Vattakanal in March have no way to know they are both in Gokarna tonight. The
network already holds the data that could reunite them — bookings with overlapping
room/date ranges — and does nothing with it.

### Mechanic
- A **crossing** is computed, never stored as a social edge until both sides act:
  two guests whose stays overlapped (same room ≥1 night, or same hostel ≥2 nights).
- When a guest checks in, the graph looks for crossings among current and
  arriving-this-week guests across the network.
- Notification (WhatsApp/in-app): "Someone you shared a dorm with at Vattakanal in
  March checks into Gokarna tomorrow. Want them to know you're around?"
- Identity is revealed **only on double opt-in**: both sides say yes before either
  sees a name. Decline is silent — the other person never knows a crossing existed.

### Privacy (non-negotiable, DPDP Act 2023)
- Crossings computation is on by default ONLY for guests who opted into the guest
  graph at booking; off means no computation, not just no notification.
- No third party ever sees a crossing. Staff cannot browse crossings.
- Either side can sever a crossing permanently; severance is silent.
- Room-level overlap data retained max 24 months.

### Acceptance Criteria
- [ ] Crossing computation over booking history (same-room and same-hostel tiers)
- [ ] Double-opt-in reveal flow; silent decline; permanent severance
- [ ] Notification via existing WhatsApp rails (DOS-504), respecting quiet hours
- [ ] Graph opt-out ⇒ guest excluded from computation entirely
- [ ] Metrics: crossings found/night, reveal-consent rate, reunions (both check in
      after mutual reveal)

### Explicitly out of scope
- Any feed, map, or list of "people near you" — this is reunion, not discovery
- Matching by interests/demographics — only shared nights count
