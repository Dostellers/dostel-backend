# Flexible Workweek Hold — Product Prioritization Brief

## Recommendation

Prioritize a controlled **25% UPI hold** pilot after authoritative inventory and a real payment rail are live. The differentiator is not “partial payment” alone; it is a transparent long-stay commitment paired with verified workspace conditions and Dosteller-led community value.

## Competitive evidence

- The Hosteller sells 7/14/28-night workations at 15% off and requires full payment at booking: https://www.thehosteller.com/workations/
- Cloudbeds supports digital payment and outstanding-folio collection, showing the operational baseline expected from modern hospitality software: https://www.cloudbeds.com/guest-engagement-software/

## Dostel today

- Backend computes `depositRequired`, `amountPaid`, and `balanceDue`, defaulting deposits to 20%.
- GraphQL `PaymentInput` does not expose `depositPercentage`, so policy is not configurable through the booking API.
- Frontend simulates UPI/card/netbanking and asks for the full total.
- No verified payment intent, webhook reconciliation, reminder schedule, expiry, cancellation, refund or failed-balance workflow exists.

## Scope

1. Configurable deposit policy by rate/package; Workweek pilot defaults to 25%.
2. Real UPI payment intent and idempotent confirmation.
3. Inventory hold created only after confirmed deposit.
4. Balance due date displayed before payment and in confirmation.
5. Automated reminders at configurable intervals.
6. Expiry/grace policy with staff override and audit trail.
7. Refund and reconciliation states visible to staff.
8. Workweek-specific bundle: verified workspace card plus optional Dosteller skill-share credit.

## Suggested policy for validation

- 25% due at booking.
- Remaining 75% due seven days before arrival.
- Bookings inside seven days require full payment.
- One reminder before due date and one on the due date.
- Grace period and cancellation/refund rules require finance/operations approval before launch.

## Acceptance criteria

- Guest sees total, deposit, balance and due date before authorizing UPI.
- Duplicate callbacks cannot duplicate payment or booking state.
- Inventory is not confirmed from a simulated or pending payment.
- Staff can reconcile deposit, balance, refund and expiry from one booking record.
- Reminder delivery and payment events are auditable.
- Copy never promises flexibility beyond published cancellation terms.

## Impact / effort

**Impact H × Effort M** after payment foundation; **Effort H** if attempted before inventory authority, webhook reconciliation and policy ownership.

## Decision metrics

- Workweek checkout completion versus full-prepay control
- Deposit-to-balance settlement rate
- Expired holds and inventory recovery time
- Refund/support contacts per 100 bookings
- Workweek cancellation and no-show rate
- Incremental direct-booking contribution margin
