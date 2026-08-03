# DOS-252: Implement Cloudbeds as Inventory Authority Layer

**Priority**: Medium  
**Owner**: Product Manager / Builder  
**Requestor**: Market Researcher  
**Date**: Aug 1, 2026

## Problem
Dostel currently has disconnected inventory approaches (embedded room reservations + InventoryType/Day models). Rebuilding full PMS parity is waste ofers 300+ OTA sync, PCI Level 1 payments, auto-chargeback evidence, 90% less reconciliation.

## Goal
Adopt Cloudbeds as inventory authority (source of truth for availability, rates, payments). Build Dosteller-specific workflows (approval, reputation, events) on top via API/webhooks.

## Requirements
1. **Inventory Sync**: Connect Dostel hostel/room data to Cloudbeds via API; treat Cloudbeds as source of truth for availability/pricing.
2. **Payment Processing**: Use Cloudbeds Payments for PCI Level 1, tokenization, auto-reconciliation.
3. **OTA/Channel Sync**: Leverage Cloudbeds Channel Manager for 300+ OTAs; disable Dostel's duplicate OTA integration.
4. **Dosteller Workflow Layer**: 
   - Membership approval/audit via custom roles/permissions in Cloudbeds or via webhook.
   - Event proposals → staff approval → RSVP/waitlist → contribution credit via custom metadata.
   - Contribution-aware folio: separate cash/deposit from earned credits in guest ledger.
5. **Fallback**: Maintain ability to override Cloudbeds inventory for Dosteller-specific blocks (skill-share, Workweek).

## Competitive Benchmark
- Cloudbeds PMS: https://www.cloudbeds.com/property-management-system/
- Cloudbeds Payments: https://www.cloudbeds.com/hospitality-platform/payments/
- Cloudbeds Channel Manager: https://www.cloudbeds.com/channel-manager/

## Citation
- USP Backlog #14: Cloudbeds-as-inventory-authority layer (Impact H × Effort M)
- Product gap analysis: missing authoritative inventory, payment schema, OTA sync

## Acceptance Criteria
- [ ] Room availability/pricing in Dostel UI reflects Cloudbeds real-time data.
- [ ] Payments processed via Cloudbeds generate PCI-compliant tokens.
- [ ] OTA bookings flow through Cloudbeds Channel Manager (zero manual sync).
- [ ] Dosteller event proposal creates Cloudbeds custom field/metadata; staff approval triggers RSVP workflow.
- [ ] Contribution credits visible in guest folio separate from cash transactions.
- [ ] Staff can block inventory for Dosteller packages (Workweek, skill-share) via Cloudbeds inventory adjustments.

## Dependencies
- Blocks: Cloudbeds account setup + API credentials.
- Enables: USPs #2 (membership), #3 (hybrid inventory), #4 (Stay Pass), #8 (contribution folio), #9 (host ops workflow).