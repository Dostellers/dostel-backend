# Hotel Tech Vendor Teardown → Dostellers Value-Adds

**Date:** 2026-08-07
**Source:** Boutique Hotels of California "new vendor members" announcement (ASI, Axelrod, Harlow, StayLoop, Waterheaterman, Zaplar)
**Purpose:** Extract what applies to a single-property hill hostel and turn it into a tracked build sequence.

---

## 1. What the six vendors actually are

| Vendor | What it is | Category |
|---|---|---|
| **ASI** (Anand Systems) | Cloud PMS since 1999, 7,000+ properties, channel manager to 30+ OTAs | Legacy infrastructure |
| **Axelrod** (YC S26) | "Operating layer" above existing PMS/channel/accounting — coordinates arrivals, rooms, rates, maintenance, owner reporting | AI-native orchestration |
| **Harlow** | Staff wearable badge: touch, speak, AI routes the note to the right department. Computer-use agents drive existing PMS screens. Guest Q&A in 42 languages | AI-native capture |
| **StayLoop** | "Capture. Rebook. Grow." — guest data capture → direct rebooking | Retention marketing |
| **Zaplar** (YC S26) | Full-stack replacement: PMS + POS + booking engine + messaging, run by agents | AI-native replacement |
| **Waterheaterman** | Water heaters. Actual plumbing. | Trade services |

## 2. The convergent bet

Five of the six are fighting over the same prize from different angles: **the guest graph** — the memory of who the guest is, which a PMS records as a row and then discards.

- Harlow captures it the moment staff hear it.
- StayLoop captures it at the WiFi login.
- Axelrod coordinates around it without replacing anything.
- Zaplar rebuilds the stack to hold it natively.

Dostellers is already a guest-graph product — it started from membership and community rather than bolting memory onto a booking system. The gap is that our version currently lives in briefs and WhatsApp groups rather than in `apps/backend/src/models/`.

**The value-add is not copying features. It is making the guest graph a system of record.**

## 3. What maps to a single hill property

| Vendor idea | Dostel translation | Issue |
|---|---|---|
| StayLoop — capture → rebook | Captive-portal WiFi login that signs OTA arrivals into Dostellers | DOS-501 |
| Harlow — staff capture, minus hardware | Staff WhatsApp voice note → structured guest facts on the customer record | DOS-502 |
| Waterheaterman — reliability *is* the product | Measured, published power/hot-water/WiFi record instead of marketing copy | DOS-503 |
| Harlow/Zaplar — agentic front desk | WhatsApp concierge grounded in the guest graph + events | DOS-504 |
| Axelrod — coordinate, don't replace | Architectural constraint on all four: no PMS rebuild | (constraint) |

## 4. Explicitly out of scope

- **Zaplar-style full-stack replacement.** They solve multi-property fragmentation for hotel groups. We have one property. Rebuilding PMS + POS + booking engine consumes a year and produces nothing a guest can feel.
- **Harlow-style wearables.** Hardware, procurement, charging, breakage — for a team small enough to shout across the courtyard.
- **ASI-depth channel manager.** Buy, don't build.
- **A vendor marketplace.** That is BHC's business model as an association, not ours as a property.

## 5. Sequence and rationale

1. **DOS-501 — WiFi capture.** Smallest build, compounding return, directly attacks OTA commission. Every guest connects within 90 seconds of arriving.
2. **DOS-502 — Guest memory graph.** Turns the community promise into a system instead of relying on turnover-prone staff memory.
3. **DOS-503 — Published reliability data.** Marketing already wrote the claim; making it verifiable turns copy into a moat.
4. **DOS-504 — WhatsApp concierge.** Sequenced last so it answers *from* the guest graph rather than a flat FAQ.

## 6. Sources

- Axelrod — https://axelrod.live/
- Harlow — https://www.tryharlow.com/
- Zaplar — https://zaplar.com/ , https://www.ycombinator.com/companies/zaplar
- Anand Systems (ASI) — https://anandsystems.com/
- Boutique Hotels of California — https://boutiquehotelsofcalifornia.com/
- Capture→rebook loop mechanics — https://stayfi.com/vrm-insider/2025/07/11/how-to-build-a-guest-loyalty-funnel-using-wifi-data-operational-automation/

## 7. Related existing work

- `.paperclip/marketing/dostellers/dostellers-iteration-v2.md` — 10 community gaps (referral, alumni, feedback loop)
- `.paperclip/marketing/reliability-card-workweek-copy.md` — reliability claim, currently unbacked
- `.paperclip/marketing/verified-hill-stay-reliability-messaging.md` — Verified Hill Stay positioning
- DOS-250 — eligibility & consent engine (DOS-501 and DOS-502 both depend on its consent primitives)
- DOS-392 — direct booking widget (DOS-501 feeds it demand)
