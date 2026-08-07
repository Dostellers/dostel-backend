# DOS-75 Dostel × Afforestation.org Campaign Brief

## Recommendation
Launch with a **verified completed-stay impact** narrative, not “every booking plants a tree” until funding, fulfilment and reversal rules are confirmed.

**Approved campaign line after partner verification:**  
**Stay in Vattakanal. Support a growing forest.**

**Specific proof line:**  
Your completed eligible Dostel stay supports one verified tree through Afforestation.org.

This links Dostel’s ecological roots—Bob & Tanya’s restoration work since 1985—to measurable action without implying carbon neutrality, local planting or tree ownership.

## Message hierarchy

1. **Heritage:** Community and ecological restoration have shaped Dostel’s Vattakanal story.
2. **Action:** Eligible completed stays support verified planting through Afforestation.org.
3. **Evidence:** Show verified trees separately from pending fulfilment; link project evidence where supplied.
4. **Participation:** Dostellers can join approved nature activities without replacing paid local work.
5. **Invitation:** Stay, take part and follow the impact.

## Impact landing-page copy

**Eyebrow:** Dostel Impact  
**H1:** A stay rooted in restoration  
**Body:** Dostel’s community story is inspired by Bob & Tanya’s ecological restoration work in Vattakanal since 1985. Through our Afforestation.org partnership, eligible completed stays can support verified tree planting projects.

**Impact card**  
**[verified count] trees verified**  
**[pending count] awaiting confirmation**  
Updated [date] · Verification supplied through Afforestation.org

**How it works**
1. Complete an eligible stay.
2. Dostel submits the planting support after checkout.
3. Afforestation.org confirms fulfilment.
4. The verified count and available project evidence appear here.

**CTA:** See our verified impact  
**Secondary CTA:** Book a stay

**Disclosure:** Planting location, timing and evidence depend on the supported project. This programme is not a carbon-offset or carbon-neutrality claim.

## Booking and confirmation copy

**Booking page — pre-payment**  
Complete this eligible stay and Dostel will support one verified tree through Afforestation.org. Confirmation follows after checkout and partner fulfilment.

**Confirmation email — after booking**  
Your stay may qualify to support a tree after completion. We’ll update you when planting is verified.

**Post-stay email — pending**  
**Your Dostel impact is being confirmed**  
Thanks for completing your stay. We’ve recorded the planting request and will share available evidence after Afforestation.org confirms it.

**Post-stay email — verified**  
**Your stay supported a verified tree**  
Your completed Dostel stay supported one verified tree through Afforestation.org. [View the project evidence]

## Social campaign drafts

### Launch post
**Stay in Vattakanal. Support a growing forest.**  
We’re working with Afforestation.org to connect eligible completed stays with verified tree planting. We’ll publish confirmed counts and available project evidence—no vague green claims.  
**CTA:** Follow Dostel Impact

### Heritage post
Dostel’s ecological story did not begin with a badge. It is inspired by Bob & Tanya’s restoration work in Vattakanal since 1985. Our Afforestation.org partnership adds a trackable way for completed stays to support planting projects.  
**CTA:** Read how verification works

### Verification update
This month: **[X] trees verified · [Y] pending** through Afforestation.org. Pending trees stay pending until evidence arrives.  
**CTA:** See the impact record

### Dosteller activity post
Dostellers can also join staff-approved nature activities during their stay. Participation is optional, locally guided and never a substitute for paid work.  
**CTA:** View upcoming activities

## Dosteller perk proposal

Pilot one contribution benefit only after Community/Ops approval:
- One verified tree for each completed eligible long stay (proposed threshold: 7+ nights).
- Optional second tree for one staff-approved nature activity, capped at one per stay.
- Recognition appears as a personal impact record, not cash-like points or token value.
- Public visibility is opt-in.

## Builder specification

### P0 — Claim gate
Do not show a live counter or “verified” badge until Ops confirms:
- cost and funding owner;
- eligible stay definition;
- cancellations/refunds/reversals;
- planting ID/status/project metadata/evidence URL;
- permitted use of partner name, badge and certificate;
- data-sharing requirements.

### P1 — Impact module
- Route/module: `/impact`
- Fields: verified count, pending count, last-updated date, project name, evidence link, methodology/disclosure.
- Statuses: `pending`, `verified`, `failed`, `reversed`.
- Never include pending/reversed records in the verified counter.
- Provide accessible text alternatives for widget/badge content.

### P1 — Analytics
Track:
- `impact_page_viewed`
- `impact_evidence_opened`
- `impact_booking_cta_clicked`
- eligible completed stays
- fulfilment rate and median confirmation time
- claim corrections/support complaints

## Content/Community handoff

**Content Marketer**
- Adapt the approved landing, booking and email copy.
- Use only project media licensed/supplied by Afforestation.org.
- Add the disclosure wherever a tree claim appears.

**Community Lead**
- Define locally appropriate, optional nature activities.
- Confirm safeguarding, capacity and local facilitator compensation.
- Collect consent before publishing guest names/photos.

## Claim guardrails

**Use:** supports verified tree planting; verified through Afforestation.org; confirmation pending; project evidence.  
**Avoid:** your tree; planted in Vattakanal; carbon neutral; offsets your stay; guaranteed survival; every booking plants a tree.  

The avoided claims may only be used if the signed partner terms and evidence explicitly support them.

## Sources

- [Afforestation.org homepage](https://afforestation.org/), accessed 1 Aug 2026
- [Afforestation.org business offering](https://afforestation.org/for-business), accessed 1 Aug 2026
- [Afforestation.org approach/about](https://afforestation.org/about), accessed 1 Aug 2026
- Existing concept: `/root/dostel-backend/.paperclip/marketing/dostellers/afforestation-membership-reward.md`

## Assumptions

- The partnership exists per Dostel’s assigned issue; signed commercial terms, API access, pricing and brand permissions were not available in workspace documents.
- One tree per completed 7+ night stay is a proposed pilot rule, not a confirmed benefit.
- Afforestation.org publicly advertises dashboards, integrations, widgets, badges, certificates and personalised impact; exact Dostel access remains unverified.
