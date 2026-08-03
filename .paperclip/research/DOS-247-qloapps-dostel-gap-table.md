# DOS-247 QloApps → Dostel PMS Gap Table

**Recommendation:** Use QloApps as a workflow reference only. Do not migrate or reuse its core for Dostel. QloApps is hotel-room based, while Dostel needs first-class dorm-bed inventory and a separate Dosteller experience layer.

## Workflow mapping

| Domain | QloApps public behavior | Dostel today | Missing semantic + use case | Recommendation |
|---|---|---|---|---|
| Sellable inventory | Room type is the sellable product; individual hotel rooms are allocated beneath it | `RoomType` + physical `Room`; dormant `InventoryType` supports `private_room \| bed`, and `InventoryDay` has total/held/sold/blocked | **Atomic dated stock:** prevent two guests buying the final unit during concurrent checkout | Expose `InventoryType`/`InventoryDay` through GraphQL and reserve with optimistic locking |
| Hostel beds | Bed types describe dimensions and map to room-type products; booking allocation uses `id_room` | Dorms use capacity and descriptive `bedType`; no first-class bed records | **Bed unit/assignment:** front desk assigns “Dorm A / Bed 4” and blocks that bed for maintenance | Do not reuse QloApps inventory semantics; add a Dostel `Bed` entity and bed-level allocation |
| Availability | Calendar exposes room availability and supports back-office walk-in booking | Availability groups physical rooms and embedded reservations | **Single source of truth:** guest quote, booking and admin calendar must read the same dated inventory | Retire embedded reservation append as authoritative inventory |
| Reservation lifecycle | Room booking states include allotted, checked-in and checked-out; cancellation/refund/back-order flags coexist with order/payment states | Booking schema offers creation/confirmation/completion/abandonment, but model stores `sequenceStatus` while resolvers use `status` | **Explicit stay state:** receptionist checks in a guest, assigns/moves a bed, records no-show or early departure | Define one booking/stay state machine before adding more UI |
| Reservation integrity | Room-level booking data links sellable room type and assigned room | Booking creation does not reserve `Room` or decrement `InventoryDay` | **Hold → confirm → release:** payment failure or timeout releases inventory without overselling | Implement idempotent, atomic inventory holds tied to booking/payment |
| Folio/payment | `Order`, `OrderInvoice`, `OrderPayment` and payment allocations provide invoice/accounting behavior | `Bill`, embedded booking payment and `Transaction` are disconnected | **Guest folio:** add room nights, cafe/activity charges, split payments, refunds and balance due with audit history | Borrow the separation pattern, not source code; build a ledger contract native to Dostel |
| Staff roles | Employees belong to configurable profiles with per-admin-tab/module permissions | Users, roles and permissions exist, but GraphQL lacks broad enforcement and current field mappings conflict | **Property-scoped access:** front desk can check in guests but cannot change finance or global configuration | Fix current auth mappings, enforce GraphQL authorization, then add least-privilege hostel scopes |
| Membership | No equivalent to Dostel’s long-stay community differentiator in the evaluated core workflow | Membership plans/subscription model exist; subscription purchase/renewal/benefit redemption is not exposed | **Eligibility:** confirm activity/network access for an active Dosteller without coupling it to room stock | Keep membership as a separate module connected through stable booking/customer IDs |

## Semantics already covered or underway

- Room types, physical rooms and grouped availability: `apps/backend/src/schema/roomTypeDefs.js:4-69`
- Availability overlap logic: `apps/backend/src/resolvers/roomResolver.js:12-52`
- Date inventory foundation (`total`, `held`, `sold`, `blocked`, `version`): `apps/backend/src/models/InventoryDay.js:5-29`
- Private-room/bed inventory modes: `apps/backend/src/models/InventoryType.js:3-16`
- Booking and payment GraphQL concepts: `apps/backend/src/schema/bookingTypeDefs.js:15-50`
- Bill line items and totals: `apps/backend/src/schema/billTypeDefs.js:5-24`
- User/role/permission concepts: `apps/backend/src/schema/userTypeDefs.js:8-22`, `apps/backend/src/schema/roleTypeDefs.js:4-28`
- Membership plan/subscription types: `apps/backend/src/schema/membershipTypeDefs.js:10-31`

## Priority gaps for Product/Builder

1. **P0 — Inventory integrity:** connect dated inventory, holds, booking confirmation and release atomically.
2. **P0 — Contract repair:** reconcile `status` vs `sequenceStatus`, missing model fields/resolvers and case-sensitive imports before extending the API.
3. **P1 — Hostel bed model:** bed ID/label, parent room, operational status and reservation assignment.
4. **P1 — Stay lifecycle:** held, confirmed, checked-in, checked-out, cancelled, no-show; room/bed move and stay extension.
5. **P1 — Authorization:** property-scoped least privilege and auditable admin actions.
6. **P2 — Folio ledger:** room-night and add-on postings, allocations, refunds, receipts and balances.

## QloApps adoption risks

- **License:** Core is OSL-3.0; Webkul modules can carry their own licenses and other modules may be AFL-3.0. Legal review is required before code reuse or derivative integration.
- **Stack/maintenance:** QloApps uses PHP 8.1–8.4 and MySQL 5.7–8.4; Dostel uses Node/GraphQL/MongoDB. Adoption creates a second stack, upgrade path and security burden.
- **Migration:** Product, room, order and employee concepts do not map one-to-one to dorm beds, Dostellers or existing booking/payment records.
- **Hostel fit:** Public core code confirms room-level allocation, not independently sellable beds. Reuse would require substantial inventory redesign.
- **Commercial modules:** Channel/payment capabilities may depend on separately licensed add-ons; “open source core” does not imply every required integration is included.

## Sources

- [QloApps repository and license](https://github.com/Qloapps/QloApps), accessed 1 Aug 2026
- [QloApps Manage Hotel guide](https://docs.qloapps.com/hrs/), updated 9 Mar 2026
- [QloApps Orders guide](https://docs.qloapps.com/orders/), updated 9 Mar 2026
- [QloApps Employees guide](https://docs.qloapps.com/administration/employees/), updated 9 Mar 2026
- [QloApps `HotelRoomInformation`](https://github.com/Qloapps/QloApps/blob/bda4b4718a8e4395aa37a4b46b81c5557872727d/modules/hotelreservationsystem/classes/HotelRoomInformation.php)
- [QloApps `HotelBedType`](https://github.com/Qloapps/QloApps/blob/bda4b4718a8e4395aa37a4b46b81c5557872727d/modules/hotelreservationsystem/classes/HotelBedType.php)
- [QloApps `HotelBookingDetail`](https://github.com/Qloapps/QloApps/blob/bda4b4718a8e4395aa37a4b46b81c5557872727d/modules/hotelreservationsystem/classes/HotelBookingDetail.php)
- [QloApps `OrderInvoice`](https://github.com/Qloapps/QloApps/blob/bda4b4718a8e4395aa37a4b46b81c5557872727d/classes/order/OrderInvoice.php)
- [QloApps `Profile`](https://github.com/Qloapps/QloApps/blob/bda4b4718a8e4395aa37a4b46b81c5557872727d/classes/Profile.php)

## Limitations

- QloApps was not installed or load-tested.
- “Folio” is an analogy to QloApps order/invoice/payment records; no separate core `Folio` model was found.
- The review covers public core code/docs, not paid or third-party modules.
