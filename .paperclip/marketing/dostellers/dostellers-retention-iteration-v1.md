# Dostellers Retention & Re‑engagement Strategy – Iteration 1

**Goal:** Increase repeat bookings from Dosteller community members while preserving opt‑in, low‑pressure experience.

## 1. Post‑Stay Re‑engagement
- Send a neutral invitation 60‑90 days after checkout asking “Would you like to return for a new stay?”  
- No discounts or incentives; simply surface upcoming activities and community events.  
- Track open‑rate and click‑through to booking flow.

## 2. Alumni Communication Channel
- Create a low‑traffic “Dosteller Alumni” WhatsApp/Telegram group for past guests.  
- Use for occasional updates on new activities, skill‑share calls for proposals, and community news.  
- Membership in this channel is opt‑in only; guests can leave at any time.

## 3. Skillshare Facilitator Path (Non‑Monetary)
- Allow former Dostellers to propose leading a skill‑share session after completing 2 guest‑led sessions.  
- Recognize facilitators on the community page (name + session topic) – no badge or monetary reward.  
- Capture facilitator intent during post‑stay survey.

## 4. Feedback & Intent Survey
- Add 2 optional questions to the checkout survey: 
   1) “Would you consider returning within the next 3 months?”  
   2) “What type of activity would you like to see?”  
- Store responses linked to member profile for future targeting.

## 5. Retention Metrics (Pilot)
- **Repeat‑booking intent** – % of members who answer “yes” to returning intent.  
- **Alumni group participation** – # of unique members joining/active.  
- **Skillshare facilitation requests** – # of proposals received.  

## 6. Technical Requirements (PM/Builder)
| Priority | Item | Description |
|----------|------|-------------|
| **P0** | Post‑stay invitation template | Store template in content service; trigger via checkout webhook. |
| **P0** | Alumni channel management API | Endpoint for guests to join/leave; list members for staff view. |
| **P1** | Survey response storage | Extend member profile schema with two new boolean/string fields. |
| **P1** | Repeat‑booking intent metric dashboard | Add a KPI widget to the Community Dashboard showing % returning intent over time. |
| **P1** | Skillshare facilitator intent flag | Add a checkbox to the member profile to mark “Facilitator interest”. |

## 7. Suggested Paperclip Issues
| ID | Title | Priority |
|----|-------|----------|
| **DOS‑260** | Design post‑stay neutral invitation copy & template | P0 |
| **DOS‑261** | Implement alumni channel join/leave flow (API + staff view) | P0 |
| **DOS‑262** | Add repeat‑booking intent field to member profile & analytics dashboard | P1 |
| **DOS‑263** | Build checkout survey extension for return‑intent and activity preferences | P1 |
| **DOS‑264** | Create skill‑share facilitator interest flag and display in community UI | P1 |

*All issues are scoped for OmniRoute‑free execution and should be submitted as separate Paperclip tickets under the Dostel project.*