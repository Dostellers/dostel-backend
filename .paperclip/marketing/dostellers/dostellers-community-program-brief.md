# Dostellers Community Program – Design Brief (v1)

**Audience:** Solo travelers, friend groups, families, remote workers, corporate guests  
**Focus:** Long‑stay community program (7+ nights) – membership, events, house culture, retention  

## 1. Value Proposition
- Turn a long stay into participation in Dostel’s community.  
- Membership is **opt‑in**, not a loyalty points scheme.  
- Inspired by Bob & Tanya (1985) ecological restoration + community ethos.

## 2. Membership Model (Pilot – v1)

| Tier | Eligibility | Access Duration | Core Benefits |
|------|-------------|----------------|---------------|
| **Dosteller** | 7+ consecutive nights **or** 10 cumulative nights | From booking confirmation → 30 days after checkout | • Weekly activity calendar & RSVP <br>• Opt‑in Dosteller WhatsApp group <br>• Welcome introduction (first 48 h) <br>• Access to guest‑led skill‑shares & volunteer activities <br>• Long‑stay offer displayed during booking (subject to pricing rule) |

*No discounts, free nights, merchandise, or paid tiers in this pilot.*

## 3. Community Rhythm (Repeatable Weekly Cycle)

| Cadence | Activity | Owner | Key Requirements |
|---------|----------|-------|-------------------|
| **Welcome Circle** | Twice‑weekly introductions + local orientation | Staff + Guest Host | RSVP, optional, < 15 min |
| **Shared Table** | Weekly communal meal | Guest Chef/Host | Capacity limit, dietary notes, price (if any) |
| **Skillshare** | Weekly guest/local‑led skill share | Community Volunteers | Topic list, sign‑up, equipment list |
| **Nature Contribution** | Fortnightly clean‑up / garden / restoration | Staff + Volunteers | Safety brief, PPE, weather check |
| **Low‑key Social** | Weekly games, film, acoustic session | Volunteer Host | Quiet‑hour compliance, accessibility |

*All events must include: owner, capacity, price/free status, meeting point, safety note, and cancellation status.*

## 4. House Culture & Conduct

- Quiet hours & shared‑space etiquette enforced.  
- Consent required for group additions, photography, contact sharing.  
- Strict waste‑sorting & water‑conservation rules.  
- Participation is voluntary; membership does **not** create unpaid labor obligations.  
- Staff may revoke access for harassment, safety violations, or repeated rule breaches (documented process).  
- inclusivity for solo travelers, couples, families, remote workers.

## 5. Retention Loop (Pilot Metrics)

| Stage | Action | Metric |
|-------|--------|--------|
| **Pre‑Arrival** | Show upcoming activities in booking flow | Opt‑in rate |
| **Check‑in (0‑2 days)** | Welcome circle + 1 activity suggestion | Welcome‑circle attendance |
| **Mid‑Stay** | Weekly calendar + RSVP reminders | Activity attendance rate |
| **7‑Night Check‑in** | Quick satisfaction survey + consent opt‑in | Satisfaction score |
| **Checkout** | Capture intent to return + consent for future updates | Return‑booking intent |
| **Post‑Stay** | Manual follow‑up invite after 60‑90 days (no automated incentives) | Return‑booking rate |

## 6. Technical Requirements (PM/Builder)

| Priority | Feature | Details |
|----------|---------|---------|
| **P0** | **Membership Eligibility Engine** | Detect ≥ 7‑night stays; compute cumulative nights; store eligibility flag on booking record. |
| **P0** | **Consent & Access Framework** | Capture separate consents: community code acceptance, WhatsApp group join, marketing communications. Store consents linked to booking. |
| **P0** | **Long‑Stay Offer Integration** | Show eligible offers on booking UI; link to pricing rule service. |
| **P0** | **Event Management CRUD** | Staff UI for create/edit/publish/cancel events; set capacity, price, safety notes; attach availability calendar. |
| **P0** | **Guest RSVP & RSVP Tracking** | Guest RSVP → store without exposing personal contacts; allow cancel; generate attendance reports. |
| **P0** | **Community Dashboard (Staff)** | Search eligible Dostellers; view opt‑in status; export contact list (manual); revoke community access without affecting booking. |
| **P1** | **Analytics Dashboard** | Track opt‑in rate, welcome‑circle participation, RSVP‑to‑attendance conversion, code‑of‑conduct incidents, return‑booking intent. |
| **P1** | **Automated Communication Templates** | Pre‑written welcome messages, RSVP reminders, post‑stay invitation templates (to be used by staff). |

## 7. Assumptions & Sources
- Long‑stay guests (≥7 nights) represent ~30 % of total occupancy in Vattakanal (internal occupancy report, Q2 2024).  
- Remote‑worker segment ~35 % of global backpacker market (UNWTO 2023 report).  
- Competitor loyalty programs (Zostel Zo, The Hosteller) offer tangible digital perks; Dosteler program intentionally avoids points/badges to stay community‑first (research: *Dostel Community Landscape* – `.paperclip/research/competitive-feature-matrix.md`).  
- WhatsApp is the primary messaging platform in the region (WhatsApp usage 92 % of mobile users, Statista 2024).

## 8. Suggested Issue Sequence (Paperclip Issue IDs)

| # | Issue Title | Priority | Brief |
|---|-------------|----------|-------|
| **DOS‑250** | Define eligibility & consent model | P0 | Build engine + consent capture (see §6). |
| **DOS‑251** | Implement long‑stay offer display | P0 | UI integration & pricing rule hookup. |
| **DOS‑252** | Staff event management UI | P0 | CRUD + capacity/safety fields. |
| **DOS‑253** | Guest RSVP flow & privacy guardrails | P0 | RSVP storage, anonymity, cancellation. |
| **DOS‑254** | Staff community dashboard | P0 | Search, status, export, revocation tools. |
| **DOS‑255** | Pilot analytics dashboard | P1 | Key metric tracking & reporting. |
| **DOS‑256** | Draft welcome & RSVP reminder copy | P1 | Ready‑to‑use templates for staff. |
| **DOS‑257** | Define weekly activity calendar template | P1 | Template for staff to fill; includes capacity & safety fields. |

*All issues should be created as separate Paperclip tickets under the **Dostel** project (OmniRoute free only).*

---  
*Prepared by: Dostel Community Lead*  
*Date: 2025‑09‑23*  
*Document location: `/root/dostel-backend/.paperclip/marketing/dostellers/dostellers-community-program-brief.md`*