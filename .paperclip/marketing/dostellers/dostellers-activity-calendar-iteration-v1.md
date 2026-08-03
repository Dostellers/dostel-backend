# Dostellers Activity Calendar & Staff Management – Iteration 1

**Goal:** Enable Community Lead to seed, publish, and manage weekly activity calendar with clear staff-owner fields; support RSVP tracking and safety compliance checks.

## 1. Weekly Calendar Template
| Day | Activity | Staff Owner | Capacity | Meeting Point | Safety Notes | Publish Status |
|-----|----------|-------------|----------|---------------|--------------|----------------|
| Mon | Welcome Circle | Anjali | 20 | Garden Lawn | No loud noise | Published |
| Tue | Skillshare: Herbal Medicine | Raj | 12 | Herb Garden | Shoes mandatory | Draft |
| Wed | Shared Table Dinner | Priya | 10 | Kitchen Hall | Fire exit clear | Draft |
| Thu | Nature Contribution | Anjali | 8 | Forest Trail | Carry water | Draft |
| Fri | Low‑key Social | Raj | — | Dorm Common | Music allowed | Draft |
| Sat | Extended Trek | Priya | 6 | Main Gate | Guide mandatory | Draft |
| Sun | Rest Day | — | — | — | — | Draft |

## 2. Staff Workflow (Proposed UX)
1. **Template Load:** Staff open calendar template pre‑populated with recurring activities (Welcome Circle, Shared Table, etc.)
2. **Edit Fields:** Set capacity, meeting point, safety notes for each day
3. **Assign Owners:** Select from known staff roster (linked to Dostel PMS staff directory)
4. **Publish:** Hit "Publish Calendar" → sends live to guest RSVP app immediately (no auto‑email blast)
5. **Update:** Can edit individual events until start time; guests notified in-app
6. **Compliance Check:** System warns if any activity lacks safety notes or owner assigned before publish

## 3. RSVP & Capacity Management
#### Guest View
- Calendar displayed with color‑coded slots (Green = Open, Yellow = Limited, Red = Full)
- RSVP buttons directly on calendar cards
- Real‑time availability shown in 2‑minute intervals

#### Staff View
- Live dashboard showing current RSVP counts vs capacity
- Ability to manually add/remove guests (with log trail)
- Waitlist management toggle (auto‑notify when spot opens)
- Export CSV button for onsite check‑in sheets

## 4. Safety Compliance Tracking  
- Each activity must include "safety notes" field before publishing  
- Trek activities auto‑trigger dependency check for local guide assignment  
- Weather dependency flag automatically disables RSVP buttons for flagged events  

## 5. Reporting  
Weekly summary email auto‑generated for Dostel ops lead containing:  
- Top 3 activities by RSVP  
- Activities that hit capacity limits  
- New activity proposals submitted by community members  

## 6. Technical Requirements (PM/Builder)  
| Priority | Item | Description |
|----------|------|-------------|
| **P0** | Calendar Template Service | CRUD endpoints for calendar templates with recurring activity presets |
| **P1** | Staff Owner Field UI | Dropdown select showing staff names pulled from PMS staff directory |
| **P1** | Real‑time RSVP Count API | WebSocket or polling endpoint returning live capacity status |
| **P1** | Compliance Gate Check | Pre‑publish validation ensuring required fields filled (owner, safety notes) |
| **P2** | Weather Dependency Toggle | Flag field that disables RSVP when weather conditions are poor |

## 7. Suggested Paperclip Issues  
| ID | Title | Priority |  
|----|-------|----------|  
| **DOS‑270** | Implement calendar template with recurring activity presets | P0 |
| **DOS‑271** | Integrate staff owner dropdown from PMS directory | P1 |
| **DOS‑272** | Create real‑time RSVP count API & dashboard widget | P1 |
| **DOS‑273** | Add pre‑publish compliance gate for safety/owner fields | P1 |
| **DOS‑274** | Build weekly reporting email generator | P2 |