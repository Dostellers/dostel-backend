# Dostellers × Afforestation.org — Membership Reward Proposal

**Status:** Concept for PM and operations review  
**Scope:** Vattakanal pilot; no implementation commitment

## Recommendation

Add a **personal impact record**, not a new membership tier or cash-like loyalty currency. Once the Afforestation.org integration and funding model are confirmed, eligible Dostellers can see verified trees associated with their completed stays and selected community contributions.

This supports Dostel’s ecological restoration and community roots without turning volunteering into unpaid work or making unverifiable environmental claims.

## Pilot reward rule

Start with one transparent rule:

- **One verified tree after each completed eligible long stay (7+ nights).**
- Optional pilot extension: one additional tree after participation in a staff-approved nature contribution event.
- Cap the extension at one additional tree per completed stay during the pilot.

Do not reward referrals, social sharing, reviews, or booking confirmation in this community pilot. Those incentives could encourage spam, review bias, cancellation abuse, or claims before a stay occurs.

## Member experience

1. Booking becomes eligible when the stay is completed.
2. Dostel submits or records the planting request only after partner confirmation.
3. The member profile shows `Trees associated with your stays` and a verified count.
4. Where supplied by the partner, show project name, planting date, certificate, or traceability link.
5. If fulfilment is pending, show `Planting confirmation pending` rather than incrementing the verified total.
6. Members may opt out of public display; participation never affects their booking or core Dostellers access.

## Messaging guardrails

Use:
- “Your completed Dostel stay supported one verified tree through Afforestation.org.”
- “See the trees associated with your stays.”
- “Verified by Afforestation.org” only when partner evidence exists.

Avoid:
- “Your tree” unless individual ownership is contractually accurate.
- Carbon-neutral or carbon-offset claims without a documented methodology.
- Survival guarantees, exact planting location, or local Vattakanal planting unless partner data confirms them.
- Promising GrowCoins until Afforestation.org approves the business reward configuration and commercial terms.

## Product requirements for PM/Builder

### P0 — Partner and funding gate

- Confirm who funds each tree, fulfilment cost, refunds/cancellations, data retention, and reconciliation.
- Confirm whether Dostel receives a planting ID, status, project metadata, certificate, and member-safe traceability URL.
- Confirm whether member email/phone must be shared; default to no personal-data sharing.

### P1 — Impact ledger

Store one immutable record per reward:

- `customerId`
- `bookingId`
- `triggerType` (`completed_long_stay` or `approved_contribution`)
- `partner`
- `partnerReference`
- `status` (`pending`, `verified`, `failed`, `reversed`)
- `treeCount`
- `projectName`
- `evidenceUrl`
- `createdAt`, `verifiedAt`

Use idempotency keyed by booking and trigger type. Failed requests must be retryable without duplicate planting.

### P1 — Member profile

- Show verified total separately from pending total.
- Show a chronological impact history.
- Provide private/public visibility control.
- Do not display CO₂ totals unless the partner provides methodology and approved values.

### P1 — Admin reconciliation

- Filter pending, verified, failed, and reversed rewards.
- Retry failed requests and manually attach partner evidence.
- Export monthly counts for reconciliation.
- Never silently delete reversed or failed records.

## Pilot measurement

Over 8–12 weeks, track:

- Eligible completed stays
- Planting fulfilment rate and median confirmation time
- Cost per verified tree
- Percentage of members viewing their impact record
- Nature-event participation rate
- Support complaints or claim corrections

Expansion to milestones, badges, GrowCoins, or referrals requires pilot evidence and PM/operations approval.

## Assumptions

- The Dostel–Afforestation.org partnership exists, but API access, pricing, personal profiles, and final data contract are not confirmed in workspace documentation.
- Afforestation.org publicly offers business automation, impact dashboards, widgets, badges, certificates, personalised impact, and GrowCoin business rewards.
- Afforestation.org publicly states GrowCoin can be configured for purchases, signups, referrals, or custom actions; the exact Dostel reward setup requires partner approval.

## Public sources

- Afforestation.org business offering: https://afforestation.org/for-business
- GrowCoin overview and redemption model: https://afforestation.org/growcoin
- GrowCoin for Business partnership flow: https://afforestation.org/for-business/growcoin
- Grow App impact-tracking concept: https://afforestation.org/grow-app
