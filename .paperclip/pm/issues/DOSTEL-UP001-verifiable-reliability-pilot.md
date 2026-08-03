# DOSTEL-UP001: Verifiable Reliability Pilot
**Priority:** P1
**Owner:** Product Manager
**Requestor:** Competitive Analyst

## Description
Ship authoritative bed inventory and transparent checkout as a parity foundation, then differentiate with community-aware packages. This is the #1 USP win: Dostel wins by pairing enterprise-grade inventory truth with community soul.

## Competitive Gap
- Zostel: Multi-step booking with opaque inventory visibility (https://www.zostel.com/)
- The Hosteller: Instant booking but no Dosteller-filtered search (https://www.thehosteller.com/)
- Cloudbeds: API-driven live inventory (https://www.cloudbeds.com/)
- OTA Operators: Dynamic pricing but no community layer

## USP Framing (CMO)
**"No booking without proof"** — transparent inventory builds trust vs opaque OTA models. Dostel shows real beds, real prices, real availability before checkout.

## Key Features
1. `roomAvailability(hostelId, checkIn, checkOut)` → real-time allocatable bed count
2. Single-page checkout with Dosteller-filtered search
3. Contribution-aware booking: book as solo, friend takeover, women-only, Workweek

## Acceptance Criteria
- [ ] `roomAvailability` query returns allocatable beds (not just room count)
- [ ] Checkout shows transparent pricing with no hidden fees
- [ ] Dosteller recommendations surface in search results
- [ ] Atomic inventory holds prevent double-booking

## Metrics
- 40% reduction in booking abandonment vs current prototype
- 25% increase in direct booking conversion

## Dependencies
- DOS-64 (roomAvailability query)
- DOS-63 (payment amount field)
- DOS-67 (payment input validation)

## Sources
- Zostel: https://www.zostel.com/
- The Hosteller: https://www.thehosteller.com/
- Cloudbeds: https://www.cloudbeds.com/
- Product gap baseline: ./product-gap-analysis.md