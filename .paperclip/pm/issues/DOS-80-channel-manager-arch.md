# Channel Manager Architecture — OTA Sync Plan

**Issue:** DOS-71  
**Area:** Backend / PMS / Distribution  
**Status:** Architecture only  
**Source:** DOS-69 AsiaTech research  
**Prerequisite:** Atomic internal inventory reservation before any OTA connection goes live

## Decision summary

Dostel should not build three direct OTA adapters first. It should establish a provider-neutral inventory and synchronization core, then launch through a certified connectivity provider that already supports Hostelworld, Booking.com, and Airbnb. Direct adapters remain possible behind the same interface when commercial access and volume justify their certification cost.

The PMS is the source of truth for bookings and sellable inventory. OTA systems are projections of that inventory. Every accepted direct or OTA reservation must atomically consume nightly inventory before confirmation; every cancellation or modification must atomically release and reacquire inventory before outbound updates are queued.

## Current-state gap

The current models cannot safely power a channel manager:

- `Booking` stores a room type string and optional source metadata, but has no external-event idempotency key, cancellation state, assigned sellable unit, or inventory transaction.
- `Room` embeds date-range reservations on physical rooms. It has no room-type allotment, bed inventory, nightly availability, rate plan, or concurrency guard.
- Booking confirmation and room reservation are separate operations.
- Static room prices cannot express nightly, occupancy, restriction, or channel-specific rates.
- There is no durable job queue, reconciliation cursor, dead-letter state, or sync audit trail.

OTA activation must therefore follow the phased plan below; connecting an OTA to the existing embedded reservation array would increase rather than reduce double-booking risk.

## OTA access requirements

### Booking.com

Booking.com exposes Connectivity APIs for reservations and rates/availability, but access is for approved Connectivity Partners and requires provider onboarding. Its documentation expects partners to support reservation and rates/availability connections, load at least one year of rates and availability, handle unmapped rooms/rates, and keep integrations current. Interfaces include JSON plus OTA 2003B and B.XML formats; reservation traffic uses separate secure endpoints. The architecture must support provider authentication, XML translation, rate limits, acknowledgements, and reservation recovery/reconciliation.

### Airbnb

Airbnb API distribution is organized through approved software partners rather than an unrestricted self-service public API. Dostel should use an approved provider initially. Calendar-only iCalendar integration is an optional emergency fallback for availability blocking, not a channel manager: it does not provide reliable real-time rates, restrictions, guest/payment data, or transactional acknowledgement.

### Hostelworld

Hostelworld connectivity is commercially controlled and normally obtained through approved PMS/channel-manager relationships. Public implementation documentation and sandbox credentials are not sufficient to plan a direct integration. Before direct development, Dostel must obtain written confirmation of partner eligibility, supported inventory semantics for dorm beds/private rooms, certification steps, sandbox access, polling/webhook behavior, rate limits, and reservation acknowledgement deadlines.

### Commercial gate

No direct adapter enters implementation until Product/Operations records:

1. Signed provider or OTA agreement.
2. Sandbox credentials and certification checklist.
3. Supported properties, currencies, taxes, occupancy rules, and payment responsibilities.
4. Provider SLAs, rate limits, webhook security, and data-retention requirements.
5. Exact external room/rate identifiers for each Dostel property.

## Recommended architecture

```text
Direct booking / Admin / OTA webhook or poll
                  |
                  v
        Reservation application service
                  |
        atomic MongoDB transaction
          /                       \
 Booking + allocation       Nightly inventory
          \                       /
                  |
            Outbox event
                  |
                  v
        Durable sync job queue
                  |
          Channel adapter API
                  |
      Connectivity provider / OTA
                  |
      Ack, webhook, poll, reconcile
```

### Components

1. **Reservation application service** — the only component allowed to confirm, modify, or cancel a booking. It validates mappings and atomically changes booking, allocation, nightly inventory, and outbox records.
2. **Inventory ledger** — materialized nightly availability per hostel, sellable room type, and date. Physical room/bed assignment may happen at booking time or check-in, but the sold inventory category must be explicit.
3. **Rate service** — resolves a base rate plan into nightly price and restrictions. Channel overrides are projections, not independent sources of truth.
4. **Transactional outbox** — records every committed inventory/rate/booking change in the same MongoDB transaction. Workers never infer changes by scanning mutable collections.
5. **Durable job queue** — claims outbox events, coalesces rate/availability changes, applies retries, and stores dead letters. Start with Mongo-backed jobs to avoid new infrastructure; move to Redis/BullMQ only after throughput warrants it.
6. **Channel adapters** — provider-neutral interface with one implementation per connectivity provider or direct OTA. Adapters translate canonical Dostel records into external payloads and normalize inbound events.
7. **Webhook ingress and pollers** — webhook endpoints verify signatures and persist raw events before returning success. Pollers fetch reservations where webhooks are unavailable or as recovery.
8. **Reconciler** — periodically compares provider reservations/mappings and the next 365 days of availability/rates against local projections; discrepancies create repair jobs and alerts.
9. **Admin controls** — connection health, mappings, last successful sync, failed jobs, pause/resume, manual retry, and explicit full-resync action.

## Canonical data model

Names are conceptual; implementation should follow existing Mongoose conventions.

### `InventoryType`

Represents a sellable category rather than a physical room.

- `hostelId`
- `code`, `name`
- `mode`: `private_room` or `bed`
- `capacityPerUnit`
- `totalUnits`
- `physicalRoomIds`
- `active`
- unique index on `(hostelId, code)`

Dorm beds must be inventory units. A six-bed dorm with six independently sold beds has six units; a private room has one unit regardless of guest capacity.

### `InventoryDay`

- `hostelId`, `inventoryTypeId`, `date`
- `total`, `held`, `sold`, `blocked`
- `version`
- unique index on `(inventoryTypeId, date)`

Availability is `total - held - sold - blocked`. Reservation writes use a Mongo transaction plus conditional updates requiring sufficient availability. `version` supports optimistic concurrency and audit diagnosis.

### `BookingAllocation`

- `bookingId`, `inventoryTypeId`
- `startDate`, `endDate`, `quantity`
- `physicalRoomIds` when assigned
- `status`: `held`, `confirmed`, `released`
- unique active allocation per booking

### `RatePlan`

- `hostelId`, `inventoryTypeId`
- `code`, `name`, `currency`
- `pricingMode`, `baseAmount`
- cancellation/meal/occupancy policy references
- default restrictions: minimum stay, maximum stay, closed to arrival/departure
- `active`

### `RateDay`

- `ratePlanId`, `date`
- `amount`
- restriction overrides
- `version`
- unique index on `(ratePlanId, date)`

### `ChannelConnection`

- `hostelId`, `provider`, `externalPropertyId`
- encrypted credential reference, never plaintext credentials
- `status`: `pending`, `active`, `paused`, `error`, `revoked`
- sync horizon and timezone
- last inbound/outbound/reconciliation timestamps
- health/error summary

### `ChannelMapping`

- `connectionId`
- `inventoryTypeId`, `ratePlanId`
- `externalRoomTypeId`, `externalRatePlanId`
- occupancy/tax/markup configuration
- `active`, `validatedAt`
- unique indexes preventing duplicate external mappings

### Booking additions

- explicit `Cancelled` status
- `source.channelConnectionId`
- `source.externalReservationId`
- `source.externalRevision`
- `source.importedAt`
- unique sparse index on `(source.channelConnectionId, source.externalReservationId)`
- normalized cancellation/modification metadata

### `SyncEvent` and `SyncJob`

`SyncEvent` is immutable and contains aggregate type/id, event type, local version, correlation ID, and committed payload reference. `SyncJob` contains connection, operation, deduplication key, status, attempt count, next attempt, lease owner/expiry, response summary, and terminal error. Raw payloads must be encrypted or redacted and expire under a defined retention policy.

## Adapter contract

Each adapter implements:

- `testConnection(connection)`
- `fetchCatalog(connection)`
- `pushAvailability(connection, dateRange, inventory[])`
- `pushRates(connection, dateRange, rates[])`
- `fetchReservations(connection, cursor)`
- `acknowledgeReservation(connection, externalReservationId)`
- `normalizeInboundReservation(payload)`
- `getRemoteSnapshot(connection, dateRange)`

The application service consumes canonical objects only. Provider XML, JSON, signatures, pagination, and error codes remain inside the adapter.

## Sync strategy

### Inbound reservations

1. Verify webhook authenticity where available, persist the raw event, and return the provider-required response quickly. Otherwise poll using a durable cursor.
2. Deduplicate on connection plus external reservation ID and revision/event ID.
3. Validate property, room, rate, dates, quantity, currency, and customer data.
4. In one transaction, create/update the booking, consume or move nightly inventory, create allocation, and append outbox events.
5. Acknowledge only after durable local commit when the provider protocol permits.
6. Queue immediate availability updates for every affected channel, including the source channel.

Unknown mappings never silently create inventory. They enter a quarantine queue, alert Operations, and are retried after mapping correction. If an externally confirmed booking exceeds local inventory, preserve the reservation as `needs_attention`, close affected inventory across channels, and escalate for manual resolution; never discard it.

### Outbound availability and rates

- Booking, cancellation, block, inventory, and rate transactions append outbox events.
- Workers coalesce events by connection, inventory/rate plan, and date range; the newest local version wins.
- Availability is sent before optional rate changes when an event closes inventory.
- Every outbound payload carries a deduplication key derived from connection, operation, entity/date range, and local version.
- Success records the external acknowledgement and synced version. Stale queued versions become superseded rather than being sent.
- A connection can be paused without stopping local booking operations; while paused, jobs accumulate and a full snapshot sync is required before resume.

### Polling, webhooks, and reconciliation

- Prefer authenticated webhooks for low-latency notifications.
- Poll reservations every 1–5 minutes where required, with provider-specific cursors and overlap windows to prevent boundary loss.
- Reconcile reservations at least hourly and the rolling 365-day rate/availability horizon nightly.
- Trigger targeted reconciliation after timeouts, ambiguous responses, credential recovery, mapping changes, worker outages, or manual overrides.

## Conflict policy

1. The first transaction that consumes available local inventory wins.
2. Provider event revisions must increase; stale modifications are ignored but audited.
3. Cancellation is idempotent and releases inventory once.
4. Date/room changes are implemented as an atomic release-and-acquire transaction, not two independent writes.
5. Local inventory is authoritative for outbound values; externally accepted reservations are authoritative facts that must be represented and manually resolved if they expose oversell.
6. No automatic guest relocation, cancellation, or price change occurs during conflict handling.
7. Use the hostel's IANA timezone for stay dates; store instants in UTC and inventory dates as timezone-derived date keys.

## Retry and failure handling

| Failure | Response |
|---|---|
| Timeout or connection reset | Retry with same idempotency key; reconcile before retry if provider result is ambiguous |
| HTTP 429 / provider throttle | Honor `Retry-After`, reduce adapter concurrency, exponential backoff with jitter |
| Provider 5xx | Exponential retry, then dead letter and alert |
| Invalid credentials | Pause connection immediately; alert Operations; retain jobs |
| Mapping/schema validation error | Quarantine; do not retry until configuration or adapter changes |
| Unknown inbound room/rate | Persist reservation as needs-attention, close risky inventory, alert |
| Local insufficient inventory | Record oversell incident, preserve external booking, close affected dates, manual resolution |
| Queue worker crash | Lease expires and another worker safely retries |
| Prolonged outage | Full reservation and 365-day inventory/rate reconciliation before declaring healthy |

Suggested retry schedule: immediate, 30 seconds, 2 minutes, 10 minutes, 30 minutes, then hourly up to 24 hours. Provider deadlines override this default. Critical reservation import/acknowledgement failures page Operations; routine rate-sync failures alert after three attempts.

## Security and observability

- Store credentials in a secrets manager or encrypted-at-rest credential store; models contain only references.
- Verify webhook signature, timestamp, replay window, content type, and request size before parsing.
- Redact credentials, payment card data, and guest PII from logs and job error summaries.
- Use correlation IDs across webhook/poll, booking transaction, outbox event, job, and provider response.
- Metrics: inbound lag, outbound lag, queue depth, success/error rate by provider and operation, reconciliation drift, quarantined events, oversells, and connection health.
- Audit every mapping, rate, inventory, retry, pause, and manual repair action with actor and before/after values.

## Delivery phases

### Phase 0 — inventory integrity

- Add explicit sellable inventory types and nightly inventory.
- Make confirm/modify/cancel atomic and idempotent.
- Add cancellation and inventory-release lifecycle.
- Migrate embedded reservations and verify no overlapping/negative inventory.

Exit: concurrent booking tests prove inventory never becomes negative.

### Phase 1 — provider-neutral sync foundation

- Add rate plans, connections, mappings, transactional outbox, Mongo job queue, adapter contract, admin health/mapping views, metrics, and reconciliation.
- Build a fake adapter and contract test suite.

Exit: simulated inbound/outbound traffic survives duplicates, reordering, timeouts, restarts, and mapping failures.

### Phase 2 — one connectivity provider pilot

- Select a certified provider covering the required channels.
- Connect one non-production/test property, then one Dostel property with conservative allotment.
- Run shadow comparison before enabling outbound updates.

Exit: seven days with no unexplained drift and documented incident runbook.

### Phase 3 — additional channels or direct adapters

- Enable Hostelworld, Booking.com, and Airbnb incrementally through the provider.
- Consider a direct adapter only after commercial approval and a cost/reliability review.

## Build-versus-buy recommendation

Use a certified aggregator first. Booking.com requires Connectivity Partner onboarding, Airbnb distributes API access through software partners, and Hostelworld access requires a commercial connectivity relationship. Building and certifying three direct adapters would delay inventory safety while creating permanent protocol and compliance maintenance. The provider-neutral core protects Dostel from lock-in: adapters can later move from aggregator to direct connectivity without changing reservation or inventory semantics.

Provider selection should score hostel/bed inventory support, India coverage, all three target channels, webhook latency, reservation modification/cancellation fidelity, rates/restrictions support, sandbox quality, SLA, pricing, data portability, and reconciliation APIs.

## Verification plan

- Unit tests for date boundaries, timezone transitions, dorm-bed quantities, restrictions, and adapter normalization.
- Transaction tests for simultaneous direct and OTA bookings against the last unit.
- Property tests proving `held + sold + blocked <= total` for every inventory day.
- Contract tests per adapter using recorded/redacted fixtures.
- Failure tests for duplicate/out-of-order events, stale revisions, worker death, ambiguous timeout, 429, invalid credentials, unknown mapping, and provider outage.
- End-to-end fake-provider tests covering create, modify, cancel, outbound fan-out, retry, and reconciliation repair.
- Migration dry run with before/after occupancy totals and rollback instructions.

## Operational runbook minimum

Before launch, Operations must be able to identify a failed connection, pause it, inspect mappings, retry or quarantine a job, trigger targeted/full reconciliation, see all impacted dates/bookings, and record manual resolution. Emergency procedure: pause outbound sync, close affected OTA inventory in the provider extranet, reconcile, repair mappings/inventory, run a full snapshot, then resume.

## Open commercial questions

- Which certified provider supports Hostelworld plus Airbnb and Booking.com with bed-level hostel inventory in India?
- Does each OTA treat Dostel dorm inventory as beds, rooms, or occupancy-based rate products?
- Who owns guest payment collection, taxes, commissions, refunds, and virtual-card handling per channel?
- What reservation acknowledgement and outage SLAs are contractual?
- Is a full year or longer availability horizon required by the selected provider?

These are launch gates, not reasons to postpone Phase 0 and Phase 1.

## Sources

- Booking.com Connectivity APIs overview: https://developers.booking.com/connectivity/docs
- Airbnb software partner directory: https://www.airbnb.com/software-partners
- Internal AsiaTech research: `.paperclip/pm/issues/DOS-69-asiatech-research.md`
- Internal OTA competitive analysis: `.paperclip/research/hostel-coliving-ota-competitive-analysis.md`
- Current booking model: `apps/backend/src/models/booking.js`
- Current room model: `apps/backend/src/models/room.js`
