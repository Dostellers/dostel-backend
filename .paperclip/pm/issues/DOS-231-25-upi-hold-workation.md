# DOS-231: 25% UPI Hold + Balance Reminders for Workations

**Priority**: High  
**Owner**: Product Manager  
**Requestor**: Market Researcher  
**Date**: Aug 1, 2026

## Problem
The Hosteller requires full upfront payment for 7–28 night workations. Dostel can differentiate with a flexible payment model that keeps guest data and reduces booking friction for remote workers.

## Goal
Build a payment flow capturing 25% UPI hold at booking, sending automated balance reminders, and logging transaction state in the inventory authority layer.

## Requirements
1. **25% Hold at Booking**: UPI payment for 25% of workation total at reservation.
2. **Balance Reminders**: Automated email/SMS reminders at T-7, T-3, T-1 days before check-in.
3. **Transaction Logging**: All payments recorded in inventory authority (Cloudbeds-as-authority layer) with PCI Level 1 compliance.
4. **Reconciliation**: Auto-reconcile holds vs. final payments; flag discrepancies for staff review.
5. **Fallback**: Cash/on-arrival option if UPI fails.

## Competitive Benchmark
- The Hosteller: Full upfront payment required for workations (https://www.thehosteller.com/workations/)
- Zostel: $Zo partial payment up to 50% (https://www.zostel.com/)
- Cloudbeds: PCI Level 1, tokenization, auto-reconciliation (https://www.cloudbeds.com/hospitality-platform/payments/)

## Citation
- The Hosteller workations: https://www.thehosteller.com/workations/
- Cloudbeds payments: https://www.cloudbeds.com/hospitality-platform/payments/

## Acceptance Criteria
- [ ] 25% UPI hold processes at booking.
- [ ] Balance reminders fire at T-7, T-3, T-1.
- [ ] Transaction state visible in inventory authority dashboard.
- [ ] Staff can approve/reject cash fallback.
- [ ] No guest payment data stored outside PCI-compliant layer.

## Dependencies
- Blocks: Cloudbeds-as-inventory-authority layer (DOS-80).
- Enables: Flexible workation payment USP (#13).