# DOS-506: Your names for people — private nicknames for fellow travellers

## Priority: P1
## Type: Product / Full-stack
## Parent: DOS-500 (Guest Graph)

### Source
- Founder direction, Aug 7 2026: "a traveller can give nick name to their fellow
  traveller when they meet them"
- Complements DOS-505 (crossings) — nicknames are how crossings stay memorable

### Problem
Nobody remembers hostel friends by legal name. They remember "Guitar Guy",
"Chai Didi", "the German girl from the rooftop". Six months later the memory of
the person outlives every way of finding them. Meanwhile our systems know exactly
who was in that room — they just file people under names no traveller thinks in.

### Mechanic
- After a shared stay (a crossing exists), either guest can attach a **private
  label** to the other: "Guitar Guy · Vattakanal, March".
- The label is visible ONLY to its author — it is your memory, not their profile.
  The labelled person never sees it and is never notified.
- Your labels become your recall index: search "guitar" → the crossing, the
  hostel, the month — and, if you both consented (DOS-505), the reconnect path.
- Labels surface in reunion notifications: "Guitar Guy (Vattakanal, March) checks
  into Gokarna tomorrow."

### Inclusivity & abuse guard-rails
- Private-only display cannot hurt its subject socially, but store nothing we
  would be ashamed to be subpoenaed for: profanity/slur filter at write time,
  and labels are purged when either side severs the crossing or leaves the graph.
- Labels never train anything, never aggregate, never appear in analytics.
- One label per person per author, editable; author-side delete always available.

### Acceptance Criteria
- [ ] Label CRUD bound to an existing crossing (no crossing → no label)
- [ ] Author-only visibility enforced at the API layer, not the UI layer
- [ ] Write-time content filter + purge on severance/graph exit
- [ ] Recall search across own labels in dashboard
- [ ] Labels render in DOS-505 notifications for the author only
