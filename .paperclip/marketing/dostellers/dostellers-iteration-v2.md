# Dostellers Program — v2 Iteration (Gaps & Refinements)

**Author:** Dostel Community Lead
**Status:** Draft
**Prerequisite:** `.paperclip/marketing/dostellers/dostellers-program-brief.md` (v1.0)

---

## Summary

v1.0 defined tiers, points, weekly rhythm. v2 fills 10 gaps that determine whether
Dostellers feels like a real community or just another loyalty card.

---

## Gap 1: First-Week Onboarding (undefined)

A new Bronze member signs up and gets... nothing until their next booking. This is
a leak.

**Fix — 7-day welcome sequence:**

| Day | Touchpoint | Channel | Trigger |
|-----|------------|---------|---------|
| 0 | "Welcome to Dostellers" — tier explained, link to dashboard | Email + WhatsApp | Sign-up complete |
| 1 | "Meet the house" — WhatsApp group invite + house rules PDF | WhatsApp | Auto-invite trigger |
| 2 | "Your first event is on us" — pick a free event this week | Push/Email | Event query, offer free event for new members |
| 3 | "What makes you tick?" — profile mini-quiz (interests, travel style, skills to share) | Dashboard | Profile completion < 50% |
| 5 | "Someone else is here from [their city]" — peer match | WhatsApp | Same-city detection |
| 7 | "First week check" — how's it going? + what's 1 thing we could improve? | Email | D+7 since sign-up |

**Issue for PM:** Welcome sequence engine — automated email/WhatsApp drip triggered
by `membership.createdAt`.

---

## Gap 2: Community Health & Anti-Decay

WhatsApp groups die in 2–4 weeks without oxygen. Dostellers needs a content rhythm
that keeps the group useful even when no one is on-property.

**Fix — Community manager content calendar:**

| Frequency | Content | Purpose |
|-----------|---------|---------|
| Daily | "Word of the day" — local Tamil phrase, mountain fact, or photo of the day | Low-effort daily touch |
| Weekly (Mon) | "Week ahead" — events this week at Vattakanal | Logistics + FOMO |
| Weekly (Wed) | "Member spotlight" — one Dosteller's story (can be short, 3 questions) | Peer recognition |
| Monthly (1st) | "Tier shout-out" — who reached new tier this month? Badge unlocks? | Gamification social proof |
| Monthly (15th) | "What's working?" — anonymous survey link about program | Feedback loop (see Gap 7) |
| Quarterly | Dostellers Meet announcement | Special event build-up |

**Rule:** All content is posted by the on-site community manager (or automated via
PMS webhook). No spam — max 1 post/day except event days.

**Issue for PM:** Community manager dashboard needs a "broadcast" composer with
templates for these post types.

---

## Gap 3: Remote Worker / Digital Nomad Segment

v1.0 mentions remote workers in audience but doesn't design for them specifically.
This is Dostel's highest-value long-stay segment.

**Fix — Remote Worker add-on (free, requires laptop emoji in sign-up):**

| Perk | Detail |
|------|--------|
| **Workspace guarantee** | Common area desk reservation during peak season |
| **Power backup hours** | Published inverter schedule (mountain power is unreliable) |
| **Meet other remote workers** | Weekly co-working session (Wed AM, 2h silent + 30min networking) |
| **Data/connectivity tips** | Local SIM guide, best spots for Zoom calls in Vattakanal |
| **Workation package** | 14+ night stay with meals, laundry, dedicated desk (priced, not a discount) |
| **Print/scan** | Basic office services at reception |

**No separate tier needed** — these attach to any Dosteller tier. The member selects
"remote worker" in profile → unlocks these perks.

**Issue for PM:** `member.profile.isRemoteWorker` flag + workation package pricing
rules (room + meals + desk as a bundle).

---

## Gap 4: Alumni & Re-Engagement Loop

v1.0 has a "60 days no visit" nudge but no structured alumni path.

**Fix — Alumni track (triggered when booking > 90 days old):**

| Phase | Timing | Action |
|-------|--------|--------|
| Soft nudge | D+60 | WhatsApp: "Haven't seen you in 60 days. Here's what's new." |
| Hard nudge | D+90 | Email: "Your Dosteller points are expiring (12mo inactivity). Book this month for double points." |
| Alumni badge | D+365 + return | "Welcome back, old friend" badge + 500 bonus pts on next booking |
| Dormant purge | D+365 (no return) | Downgrade to Bronze if paid tier, mark `status: dormant` |

**Issue for PM:** `member.status` enum: `active | dormant | alumni`. Cron triggers
for each phase.

---

## Gap 5: Referral Program Mechanics

v1.0 mentions referral (referrer gets 500 pts, friend gets 10% off) but no
mechanics.

**Fix — Double-sided referral, detailed:**

| Element | Detail |
|---------|--------|
| Referrer reward | 500 pts (₹500 off future booking) after friend's first stay completes |
| Referee reward | 10% off first booking + instant Bronze Dosteller upgrade to Silver for first stay |
| Referral link | `GET /dostellers/refer?code={uniqueCode}` — auto-tagged to new sign-up |
| Tracking | Referral code stored on `customer.referredBy`. Payout triggered by `booking.status = completed` on referee's first booking. |
| Limit | Max 10 referrals/month per member (fraud prevention) |
| Fraud protection | Same-IP/device detection on sign-up, manual review flag for referral clusters |

**Issue for PM:** Referral model, link generation, payout trigger, fraud check
flag in admin.

---

## Gap 6: Seasonal House Culture Programming

v1.0 weekly rhythm is static. Vattakanal has 3 distinct seasons — the program
should adapt.

| Season | Months | Vibe | Programming Shift |
|--------|--------|------|-------------------|
| Peak (Summer) | Mar–May | Full house, lots of backpackers | High-volume events (bonfire, live music every Fri). Community dinner every day. Volunteer mornings weekly. |
| Monsoon | Jun–Sep | Low occupancy, remote workers | Indoor focus (board games, movie marathons, cooking workshops, coding sessions). Co-work sessions 2x week. |
| Shoulder (Winter) | Oct–Feb | Mixed, families + groups | Trek-heavy (weather is best). Nature walks, photography walks. Festival celebrations (Diwali, Christmas, Pongal). |

**Issue for PM:** Events model needs a `season` tag + recurrence rules (not just
one-off events). Community manager uses a "season template" to bulk-create events.

---

## Gap 7: Event Feedback Loop

No measurement = no improvement. The program needs lightweight feedback.

**Fix — Post-event score (1 tap):**

After a Dosteller attends an event:
1. WhatsApp/Email: "How was [Event Name]? Tap to rate: 😊 😐 😞"
2. Collects to a dashboard: event attendance count, avg score, top-rated events
3. Community manager uses this data to double down on what works

**Metric targets:**
- Event attendance rate: > 60% of RSVPs show up
- Avg event score: > 4.0 / 5
- Monthly active Dostellers (30-day): > 40% of all members

**Issue for PM:** Post-event survey trigger (automated after event `endDate`).
Event feedback model: `{ eventId, memberId, score (1-3), createdAt }`.

---

## Gap 8: Community Code of Conduct

House rules (physical property) exist. Digital community rules don't. These prevent
the WhatsApp group from becoming toxic.

**Fix — Digital Code of Conduct (shown on sign-up + pinned in WhatsApp):**

1. Be respectful — disagree without attacking
2. No spam, no self-promotion (business links) without asking
3. Keep it safe — no sharing others' contact info without consent
4. Event RSVPs are commitments — no-show twice = event access suspended 30 days
5. Report issues to staff (WhatsApp the community manager directly)
6. Dostel reserves the right to remove members who violate these

**Issue for PM:** Code of conduct acceptance checkbox on membership sign-up
(beyond terms of service). `member.acceptedCodeOfConduct` boolean.

---

## Gap 9: Points & Rewards Usability

From the competitive UX analysis: points should feel like real money, not game
tokens.

**Fix — Points display refinements:**
- Dashboard shows "₹X in rewards" not "X points" (divide by 100 and show as ₹)
- Progress bar shows "₹X more until a free night"
- On booking checkout: "Use your ₹X in Dosteller rewards?" toggle
- Points = ₹ value is 1:1 mental model (100 pts = ₹100 off)

**Issue for PM:** Points display as ₹-equivalent on dashboard + checkout.
`Math.floor(points / 100)` as primary display.

---

## Gap 10: Program Health KPIs

No definition of success = no way to know if the program is working.

**Fix — Dostellers scorecard (monthly review by CMO + Community Lead):**

| KPI | Target | Why |
|-----|--------|-----|
| Active members (30-day booking or event) | > 40% of all members | Core engagement |
| Paid tier conversion rate | > 15% of Bronze → Silver/Gold | Revenue lift |
| Points redemption rate | > 30% of earned points redeemed | Rewards feel real |
| Referral conversion | > 5% of referrers get a payout | Viral loop works |
| Event attendance rate | > 60% | Events matter |
| Avg event score | > 4.0 / 5 | Events are good |
| NPS (quarterly survey) | > 50 | Members would recommend |
| Churn (12mo inactive) | < 40% of members | Retention is working |
| WhatsApp group sentiment (manual) | "Mostly positive" — no escalation in 30 days | Community is healthy |

**Issue for PM:** Analytics dashboard view for CMO/Community Lead — aggregates
these KPIs from PMS data. No real-time needed; monthly snapshot is fine.

---

## Next

This doc identifies 10 gaps but does not rewrite v1.0. Issues for PM/Builder are
extracted in `dostellers-issues-for-pm.md`.
