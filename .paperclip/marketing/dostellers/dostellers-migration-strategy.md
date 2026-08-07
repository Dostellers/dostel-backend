# Dostellers Migration Strategy – Research Brief

**Purpose:** Guide low-friction transition from cash/OTA bookings to full Dostellers community participation  
**Audience:** CMO, PM, Builder, Community Operations  
**Scope:** Design of eligibility signaling, opt‑in flow, and early‑engagement hooks

## 1. Current Landscape
- **Competitors:** Zostel (Zo token), The Hosteller (points tier) – use monetary incentives  
- **Dostellers Positioning:** Community‑first, no points/badges, ecological restoration ethos  

## 2. Adoption Funnel

| Phase | Trigger | Action | Minimal Viable Gate |
|-------|---------|--------|---------------------|
| **Awareness** | Search results show “Eligible for Dostellers” badge | Show badge + brief tooltip | No data capture beyond eligibility flag |
| **Eligibility Confirmation** | Guest clicks badge | Simple 1‑click WhatsApp opt‑in + code acceptance | Store consent flag on booking |
| **Network Effect Activation** | Guest joins community | Prompt to RSVP first weekly activity | Auto‑suggest one activity based on stay length |
| **Retention Loop** | 7‑night or 10‑night threshold reached | Send “Welcome to Dostellers” message + next‑activity preview | No push‑notifications without explicit opt‑in |

## 3. Technical Requirements (Community‑Side)

| Priority | Item | Description |
|----------|------|-------------|
| **P0** | Eligibility flag generation | Compute 7‑night stay or 10‑cumulative‑night flag; expose via GraphQL |
| **P0** | Opt‑in endpoint | WhatsApp link generation + consent capture; write to `dosteller_consent` field |
| **P1** | Activity recommendation engine | Simple rule‑based match (e.g., “Welcome Circle” for first 2 days) |
| **P1** | Consent audit trail | Immutable log of consent changes for compliance |

## 4. Messaging Framework

- **Badge copy:** “Join the Dostellers community – unlock weekly activities & early‑access to skill‑shares.”  
- **Opt‑in prompt:** “Add yourself to the Dostellers WhatsApp group to receive weekly activity invites.”  
- **First‑activity suggestion:** “Your first welcome circle starts tomorrow at 5 pm – RSVP to secure a spot.”  

## 5. Dependencies
- PMS GraphQL field `is_eligible_for_dostellers` (needs night‑count calculation)  
- Booking confirmation webhook to fire when eligibility flag flips on  
- Integration with existing `guest_consent` schema (add `dosteller_opt_in` flag)  

## 6. Success Metrics (Pilot)
- % of eligible guests who view the badge  
- Opt‑in conversion rate (badge view → WhatsApp join)  
- Attendance at first suggested activity  

*References:* competitive analysis (`/root/dostel-backend/.paperclip/research/competitive-feature-matrix.md`), USP Backlog Rank 1 (`/root/dostel-backend/.paperclip/research/usp-backlog.md`).

---

**Suggested Paperclip Issue Pack**  
| ID | Title | Priority |
|----|-------|----------|
| **DOS‑280** | Implement eligibility flag & GraphQL field | P0 |
| **DOS‑281** | Build opt‑in consent capture endpoint | P0 |
| **DOS‑282** | Design badge copy & UI mockup | P1 |
| **DOS‑283** | Create activity recommendation rules | P1 |
| **DOS‑284** | Add consent audit‑log field | P1 |

This brief reads as a self‑contained research artifact and can be dropped into `/root/dostel-backend/.paperclip/marketing/dostellers/` for CMO/PM review.