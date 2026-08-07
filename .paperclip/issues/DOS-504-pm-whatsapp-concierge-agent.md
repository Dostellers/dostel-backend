# DOS-504: WhatsApp concierge agent grounded in the guest graph

## Priority: P2 (sequenced after DOS-502)
## Type: Backend / AI
## Parent: DOS-500

### Source
- Harlow — guest Q&A in 42 languages, answered on arrival
- Zaplar — unified messaging with optional automated agent mode (https://zaplar.com/)
- `.paperclip/pm/hotel-tech-teardown-2026-08-07.md`

### Problem
"What time is breakfast." "Is there hot water at 6am." "How do I get up from Kodaikanal bus stand." "Is the trek on tomorrow." A two-to-three person hill team answering these by hand all day is the real operating cost of the property, and it is the work that crowds out the community programming Dostellers actually depends on.

### Opportunity
Both Harlow and Zaplar automate exactly this. Our differentiator over theirs: the answers come from the community and the guest's own history, not a corporate knowledge base. The same agent handles event RSVPs, closing the loop with the community events work in `.paperclip/marketing/dostellers/dostellers-iteration-v2.md`.

Sequenced deliberately after DOS-502 so it answers *from* the guest graph rather than a flat FAQ.

### Acceptance Criteria
- [ ] WhatsApp agent answers property FAQs grounded in a maintained knowledge base — no free-form invention about facilities, prices, or availability
- [ ] Answers are personalised from the guest's `guestFacts` and booking (e.g. dietary needs reflected in meal answers)
- [ ] Handles event RSVP, cancellation, and the 1-tap post-event rating from the v2 community program
- [ ] Escalates to a human on: payments, complaints, safety, medical, anything about another guest, and any question it cannot ground — with the full thread handed over, not a summary
- [ ] Never quotes a price or confirms availability without reading live backend state
- [ ] Guest can reach a human at any point with a single message; the escape hatch is stated up front
- [ ] Agent identifies itself as automated on first contact in every conversation
- [ ] All agent replies logged and reviewable in admin, with a staff thumbs-down that pulls the answer into a review queue
- [ ] Multilingual: at minimum English, Hindi, Tamil

### Technical Notes
- Build on the WhatsApp Business API surface from DOS-291 / DOS-502 — one integration, not three
- Grounding sources: FAQ model (`apps/backend/src/models/faqs.js`), live booking/room state via existing resolvers, `guestFacts` from DOS-502, event calendar
- Retrieval-grounded generation with refusal-on-no-context; do not let the model answer from parametric knowledge about our property
- Rate-limit and cost-cap per conversation

### Dependencies
- DOS-502 (guest memory graph) — the personalisation substrate; without it this is just an FAQ bot
- DOS-291 (WhatsApp opt-in flow) — consent to message the guest at all
- DOS-503 — reliability data makes "is there hot water at 6am" answerable with a real number

### Risk
An agent that confidently invents a facility we do not have does more brand damage than a slow human reply. Ship with a narrow grounded scope and expand, rather than launching broad and constraining afterwards.

### Metrics
- Share of inbound guest messages resolved without staff involvement: > 50%
- Escalation accuracy: < 5% of escalation-worthy messages handled by the agent instead
- Guest satisfaction on agent-handled threads: no worse than staff-handled baseline
- Staff hours returned per week: > 10

### Status
todo
