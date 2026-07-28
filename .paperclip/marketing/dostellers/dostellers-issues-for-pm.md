# Dostellers — Issue Pack for PM/Builder

**Source:** `.paperclip/marketing/dostellers/dostellers-iteration-v2.md` (10 gaps)  
**PM action:** Assign Paperclip IDs (`DOS-XXX`), estimate, and schedule into sprint.  
**Design deps:** DS-005 already covers tier comparison UX + dashboard hierarchy.

---

## Issue 1: Welcome Sequence Engine

**Priority:** P1 (onboarding is the first leak)  
**Depends on:** DOS-65 (membership models — already exists), auth system

**What:** Automated 7-day email/WhatsApp drip for new Dostellers.

- Day 0: Welcome + tier explanation → dashboard link (email + WhatsApp)
- Day 1: WhatsApp group auto-invite → house rules PDF (WhatsApp only)
- Day 2: "Your first event is on us" → free event offer (push/email)
- Day 3: Profile mini-quiz → interest/skills collection (dashboard)
- Day 5: Peer match → "Someone from [city] is here" (WhatsApp, if same city)
- Day 7: NPS check → "How's your first week?" (email)

**Schema changes:**
- `customer.onboardingStep` (enum: `welcome_sent | group_invited | event_offered | profile_quizzed | peer_matched | checkin_sent | complete`)
- `customer.onboardingStartedAt`, `customer.onboardingCompletedAt`

**Backend:** Cron job or webhook trigger on `membership.createdAt`. Each step
fires only after previous step's condition (if any).

**Frontend:** Multi-step profile quiz on `/dashboard/onboarding` (step 4).

---

## Issue 2: Broadcast Composer (Community Manager Dashboard)

**Priority:** P2  
**Depends on:** Admin panel scaffold

**What:** A simple broadcast tool in the admin panel for the on-site community
manager to send templated WhatsApp/email messages.

- Templates: "Week ahead", "Member spotlight", "Tier shout-out", "Event reminder"
- Audience filters: all members | active 30d | tier:Silver | tier:Gold | by property
- Preview before send
- Sent history log

**Constraint:** WhatsApp API integration is phase 2 — v1 generates a copy-paste
message + member list for manual broadcast. Or use existing WhatsApp Business API.

---

## Issue 3: Remote Worker Profile Flag & Workation Pricing

**Priority:** P2  
**Depends on:** Room model, pricing rules engine

**What:** A `customer.profile.isRemoteWorker` boolean + workation package pricing.

- Profile toggle: "I'm a remote worker" → unlocks remote worker perks section
- Workation package: 14+ night bundle (room + meals + laundry + desk reservation)
- Pricing rule: workation package is a flat rate, not a % discount
- On booking: if user is remote worker + 14+ nights → suggest workation package

**Schema changes:**
- `customer.profile.occupation` (string), `customer.profile.isRemoteWorker` (bool)
- `hostel.pricing.workationDailyRate`, `hostel.pricing.workationMinNights` (default 14)

---

## Issue 4: Member Status & Alumni Re-Engagement Cron

**Priority:** P2  
**Depends on:** Notification system, cron infrastructure

**What:** Member lifecycle state machine with automated re-engagement.

**States:** `active → dormant (90d no booking) → alumni (365d: returned)` or
`dormant → purged (365d: never returned)`

- D+60: WhatsApp soft nudge ("Haven't seen you")
- D+90: Email hard nudge ("Double points if you book this month")
- D+365 + return: Alumni badge + 500 bonus pts
- D+365 no return: `status: dormant`, downgrade paid tier to Bronze

**Schema changes:**
- `customer.membership.status` enum: `active | dormant | alumni`
- `customer.membership.lastActiveDate` (updated on booking/event/points action)

---

## Issue 5: Referral End-to-End

**Priority:** P2  
**Depends on:** Booking completion event, points system, Razorpay

**What:** Full referral flow — link gen, tracking, payout.

- `GET /dostellers/refer` generates unique referral link (`/signup?ref=CODE`)
- Link stored on `customer.referredBy` at sign-up
- Referrer gets 500 pts after referee's first booking goes to `completed`
- Referee gets 10% off first booking + Bronze→Silver upgrade for first stay
- Fraud: same-IP/device detection flag in admin console
- Limit: max 10 referrals/month per member

**Schema changes:**
- `customer.referredBy` (ref to customer._id)
- `customer.referralCode` (unique, generated)
- `customer.referralCount`, `customer.monthlyReferralCount` (resets monthly)

---

## Issue 6: Seasonal Event Templates

**Priority:** P3  
**Depends on:** Event model (existing in schema)

**What:** Events can be tagged with a season + recurrence rule. Community manager
applies a season template to bulk-create events for the next 3 months.

- Season enum: `peak | monsoon | shoulder`
- Recurrence: `weekly | biweekly | monthly | one-off`
- Template: pre-defined schedule per season (e.g., Monsoon = movie nights Tue/Thu,
  co-work Wed AM)
- Admin UI: "Apply [Season] template" → creates events for selected date range

**Example — Monsoon template:**
| Day | Event | Recurrence |
|-----|-------|------------|
| Tue | Board game night | Weekly |
| Wed | Co-work session (10am-12pm) | Weekly |
| Thu | Movie night | Weekly |
| Sat | Cooking workshop | Biweekly |

---

## Issue 7: Post-Event Feedback Survey

**Priority:** P3  
**Depends on:** Event model, notification system

**What:** Automated 1-tap satisfaction survey after event attendance.

- Trigger: 2 hours after event `endDate` (or next morning if event ends >9pm)
- Channel: WhatsApp (primary) or email
- UX: "How was [Event Name]? 😊 😐 😞" — single tap
- Storage: `eventFeedback { eventId, memberId, score (1-3), createdAt }`
- Dashboard: event attendance count, avg score, top-rated events this month

**No frontend page needed** — all via WhatsApp/email inline.

---

## Issue 8: Code of Conduct Acceptance

**Priority:** P1 (legal-adjacent, ship with v1)  
**Depends on:** Membership sign-up flow

**What:** Add Code of Conduct checkbox to membership sign-up (separate from terms
of service).

- Checkbox text: "I agree to the Dostellers Community Code of Conduct"
- Link to full CoC (expandable inline or modal)
- Stored: `customer.acceptedCodeOfConduct` boolean + `acceptedCoCAt` timestamp
- Display CoC on dashboard once (first visit after sign-up) as a reminder

**Existing CoC content** in `.paperclip/marketing/dostellers/dostellers-iteration-v2.md` (Gap 8).

---

## Issue 9: Points Display as ₹-Equivalent

**Priority:** P2  
**Depends on:** DOS-65 (points model)

**What:** Show points as rupee value everywhere, not abstract points.

- Dashboard: "You have ₹320 in rewards" instead of "320 points"
- Progress bar: "₹X more until a free night" (target: 500 pts = ₹500 = free dorm)
- Checkout: "Use your ₹X in Dosteller rewards?" toggle — applies discount up to 50%
- Formula: `displayRupees = Math.floor(points)` (100 pts = ₹100, naturally)

**UX note:** Points are still stored and earned as whole numbers (100 pts per ₹100
spent). Only the display divides by 1 (1:1 ratio). No change to earn/redemption
math — just rename the label.

---

## Issue 10: Dostellers Analytics Dashboard (CMO View)

**Priority:** P3 (post-v1)  
**Depends on:** Points, bookings, events, referral data all in the system

**What:** A single-page analytics view in admin for CMO/Community Lead.

**KPIs to display (monthly snapshot):**
- Active members (30-day booking or event) vs total members
- Paid tier conversion rate (Bronze → Silver/Gold)
- Points earned vs redeemed (redemption rate)
- Referral conversion rate (referrers who got payout)
- Event attendance rate (attended / RSVPed)
- Average event score
- Churn rate (12-month inactive / total members)

**No real-time needed.** A simple aggregation query + display table/chart.
Exportable as CSV.

---
