# Open-Source PMS Patterns for Dostel

**Issue:** DOS-215 · **Date:** 30 July 2026 · **Audience:** PM/CTO

## Executive recommendation

Do not replace Dostel's GraphQL product with an open-source PMS wholesale. Use mature projects as workflow references, then preserve Dostel's differentiator—Dostellers, activities and network—as a separate product layer. QloApps is the strongest hospitality-specific reference reviewed; Odoo is useful for accounting/POS integration patterns. Frappe Hospitality should not be adopted because its repository is archived.

## Comparison

| Project | Public evidence | Useful pattern for Dostel | Adoption caution |
|---|---|---|---|
| **QloApps** | Dedicated open-source PMS, booking engine and hotel website; 14.2k GitHub stars, 5,535 commits; OSL-3.0; PHP/MySQL; Docker image available | Central reservation flow, room inventory, front desk, booking website, modular add-ons | Different stack from Dostel; license and module terms need legal review; hotel-first model needs bed-level hostel validation |
| **Odoo Community** | Large open-source business-app suite; 53.4k stars and 201k+ commits; integrated CRM, billing/accounting, POS, inventory and marketing | Keep operational domains modular; use stable references for folios, invoices, POS, accounting and staff permissions | Core is broad ERP, not hostel PMS; hospitality functionality may depend on third-party modules and should not drive guest UX |
| **Frappe Hospitality** | Hotel rooms, reservations and invoices plus restaurant menus/tables/orders; GPL-3.0 | Simple reservation-to-invoice domain flow | Repository archived 4 Oct 2023; only 36 commits; unsuitable as a current dependency |

GitHub star/commit counts are snapshots observed on 30 July 2026, not quality guarantees.

## Patterns to borrow

1. **Inventory before checkout:** availability must be authoritative and reservation confirmation must atomically reserve inventory.
2. **Reservation lifecycle:** model provisional, confirmed, checked-in, checked-out and cancelled states explicitly rather than treating every booking alike.
3. **Folio separation:** keep room charges, activity/add-on charges, payments, refunds and balance due as auditable ledger entries.
4. **Operational roles:** front desk, housekeeping and finance should receive least-privilege permissions and an action trail.
5. **Modules over monolith:** booking, payments, operations and community should expose stable contracts; Dostellers should not be embedded into generic room inventory.
6. **Self-host evaluation:** test backups, upgrades, security ownership, India payment integration and channel synchronization—not merely license cost.

## Proposed PM/Builder issue

### Evaluate QloApps workflows against Dostel booking/PMS schema

**Outcome:** a short gap table, not a migration.

**Acceptance criteria**
- Map QloApps concepts for room inventory, reservation status, folio/payment and staff roles to Dostel's GraphQL types.
- Identify which semantics are already covered by current booking, room availability, payment and membership work.
- Record only missing fields/states with one concrete guest or admin use case each.
- Confirm hostel bed-level inventory behavior from code/docs before recommending reuse.
- Include license, maintenance and data-migration risks; do not copy source code.

**Owner:** PM + Builder · **Priority:** Medium · **Timebox:** one day

## Sources

- QloApps repository and README: https://github.com/Qloapps/QloApps
- QloApps documentation: https://docs.qloapps.com/
- Odoo repository and README: https://github.com/odoo/odoo
- Frappe Hospitality repository and archive notice: https://github.com/frappe/hospitality

## Assumptions / limitations

- No system was installed or load-tested in this research pass.
- QloApps hostel-specific, bed-level inventory behavior remains unverified.
- Odoo hospitality modules outside the core repository were not evaluated.
- Self-hosted software still carries hosting, maintenance, security and integration costs.
