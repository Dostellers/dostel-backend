# DOS-500: Guest Graph — make guest memory a system of record

## Priority: P1
## Type: Epic / Product

### Source
- Vendor teardown: `.paperclip/pm/hotel-tech-teardown-2026-08-07.md`
- Boutique Hotels of California vendor cohort (Axelrod, Harlow, StayLoop, Zaplar)

### Problem
Five of six hotel-tech vendors in the BHC cohort are converging on the same prize from different angles: the guest graph — the memory of who a guest is, which the PMS records as a row and then discards. Harlow captures it when staff hear it, StayLoop at the WiFi login, Axelrod coordinates around it, Zaplar rebuilds the stack to hold it.

Dostellers is already a guest-graph product by design. But that graph currently lives in marketing briefs and WhatsApp groups, not in `apps/backend/src/models/`. Staff memory walks out when staff leave. OTA arrivals stay anonymous after we have already paid the commission.

### Opportunity
Make the guest graph a system of record, using the four highest-leverage translations of the vendor cohort's ideas to a single hill property:

- **DOS-501** — WiFi captive-portal capture (StayLoop's capture→rebook loop)
- **DOS-502** — Staff-captured guest memory (Harlow's insight, without the hardware)
- **DOS-503** — Verifiable reliability record (the Waterheaterman lesson: reliability is the product)
- **DOS-504** — WhatsApp concierge grounded in the graph (Harlow/Zaplar agentic front desk)

### Architectural constraint (non-negotiable)
Follow Axelrod's discipline: **coordinate, do not replace.** No PMS rebuild, no POS, no booking-engine rewrite. Every child issue sits on top of the existing GraphQL backend, the existing admin app, and the OTAs/WhatsApp already in use.

### Explicitly out of scope
- Zaplar-style full-stack replacement (they solve multi-property fragmentation; we have one property)
- Harlow-style staff wearables (hardware overhead for a 2–3 person team)
- ASI-depth channel manager (buy, don't build)
- A vendor marketplace (that is an association's business model, not a property's)

### Acceptance Criteria
- [ ] All four child issues delivered or explicitly deprioritised with rationale
- [ ] `Customer` is the single system of record for guest identity, consent, facts, and acquisition source
- [ ] No child issue introduces a replacement for an existing PMS/OTA/payment system
- [ ] Guest-facing privacy controls exist for every field the graph stores (DPDP Act 2023)

### Metrics
- Share of stays with a linked Dosteller identity: > 70% (from ~OTA-anonymous baseline today)
- Direct (non-OTA) repeat booking rate: +15pp within two seasons
- Guest facts captured per occupied bed-night: > 0.3

### Children
- DOS-501 WiFi captive-portal capture
- DOS-502 Guest memory graph
- DOS-503 Verifiable reliability telemetry
- DOS-504 WhatsApp concierge agent

### Status
todo
