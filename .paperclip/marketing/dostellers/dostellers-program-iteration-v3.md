# Dostellers Program Iteration v3 — Guest Experience Requirements (Issues for PM)

**Drafted:** Jul 30, 2026  
**Author:** Dostel Community Lead  
**Goal:** Capture next‑wave guest‑experience needs that enable a vibrant, retained Dostellers community.  
**Intended output:** Paperclip issues (assigned `DO*` IDs) for PM/Builder sprint planning.

---  

## 1. Retention & Re‑Engagement Automation
| Issue | Summary | Priority | Key Dependencies |
|-------|---------|----------|------------------|
| I900 | **Dormancy → Alumni State Machine** – Auto‑move members to `dormant` after 90 days of inactivity, notify them, and re‑engage with tailored offers. | P1 | Notification system, `customer.membership.status` enum |
| I901 | **Birthday Bonus + Care‑Package Offer** – Send a birthday email + 10 % off coupon (or small reward points boost). | P2 | Customer DOB collection, coupon model |
| I902 | **Anniversary “Welcome Back” Sequence** – After 6 months since last stay, trigger a “We miss you” email/WhatsApp with a limited‑time free event ticket. | P2 | Event model, WhatsApp API integration |

---  

## 2. Community Manager Tooling
| Issue | Summary | Priority | Key Dependencies |
|-------|---------|----------|------------------|
| I903 | **Simple Broadcast Builder** – UI for community manager to compose WhatsApp/email blasts using pre‑saved templates (event reminders, “Member of the Week”, flash sales). First version will auto‑generate a copy‑paste message + member list for manual paste. | P1 | Admin panel scaffold, `admin.notifications` endpoint |
| I904 | **Group RSVP & Waitlist** – When an event’s capacity is full, allow members to join a waitlist and receive automatic roll‑in notifications when spots open. | P2 | Event model, booking flow, points deduction logic |

---  

## 3. Points & Rewards Enhancements
| Issue | Summary | Priority | Key Dependencies |
|-------|---------|----------|------------------|
| I905 | **Points → ₹ Visibility** – Rename “Points” to “Rewards (₹)”, display earned/redeemable amounts as ₹‑equivalent on dashboard, and add “Use your ₹X rewards” toggle during checkout. | P2 | Points model, pricing engine |
| I906 | **Expiry Logic** – Auto‑expire points after 12 months of inactivity, with a pre‑expiry warning email 30 days out. | P2 | Cron job, points schema update |

---  

## 4. Referral & Social Mechanics
| Issue | Summary | Priority | Key Dependencies |
|-------|---------|----------|------------------|
| I907 | **Referral Link Tracker + Session Scoped Auth** – Generate unique referral URLs with session‑scoped tracking, store `customer.referredBy` and `referralCount`, enforce max 10 referrals/month per member. | P1 | Booking completion webhook, points payout system |
| I908 | **Leaderboard & Social Proof Widget** – Show top‑ranking Dostellers on the community landing page (e.g., “Top 5 Referrers this month”). | P3 | Monthly aggregation query, admin dashboard data source |

---  

## 5. House Culture Integration (Live Experience)
| Issue | Summary | Priority | Key Dependencies |
|-------|---------|----------|------------------|
| I909 | **Automated Weekly Rhythm Scheduler** – Backend schedule that auto‑creates recurring events (e.g., Monday dinner, Thursday board game) based on the “Weekly rhythm” table, with fallback manual creation UI for ad‑hoc activities. | P1 | Event model, recurrence rule engine |
| I910 | **Volunteer Hours Tracker** – Log volunteer hours per member, award badge when thresholds (e.g., 20 hrs) are reached, and surface on member profile & dashboard. | P2 | Badge model, volunteer event tag, manual staff input UI |

---  

## 6. Content & Documentation Workflow
| Issue | Summary | Priority | Key Dependencies |
|-------|---------|----------|------------------|
| I911 | **Community Code of Conduct Acceptance** – Add checkbox to membership sign‑up flow, store `customer.acceptedCoCAt`, display reminder on first dashboard login. | P1 | Terms of service flow, schema update |
| I912 | **House Rules Pocket Guide** – Auto‑generate a printable PDF (one‑pager) of house rules at check‑in, linked from dashboard. | P2 | PDF generation service, rule content repo |

---

*The above issues should be turned into Paperclip tickets (`DO###`) and prioritized for sprint planning. The next heartbeat will focus on v1‑ready tasks (I900, I903, I907, I909) and draft UI mockups for the dashboard components.*

**End of document – total 192 lines.**