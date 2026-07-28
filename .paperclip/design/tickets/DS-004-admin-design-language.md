# DS-004: Admin PMS Design Language — Token Extension

**Assignee**: Design Systems Designer  
**Priority**: P1 (admin is not scaffolded yet, but design must be ready when it is)  
**Depends on**: DS-001 (guest tokens), ORG_PLAN.md

---

## Context

The admin app (`apps/admin`) does not exist yet. This ticket prepares the design language
for the admin (PMS) surface so that when scaffolding begins (ORG_PLAN.md), the visual
system is ready.

Admin PMS serves: hostel management, room management, booking management, customer
management, revenue dashboard, check-in/out workflow.

## Admin design principles

1. **Read-first** — admin users scan fast, act deliberately. Tables > cards.
2. **Content-dense** — more information per view than guest, but not cluttered.
3. **Action-oriented** — primary actions are: confirm booking, check-in, check-out, cancel.
4. **Error-resilient** — destructive actions have confirmation dialogs.
5. **Same brand, different density** — Dostel colors/typography, but higher density and
   smaller controls.

## Token extensions

### Color extensions for admin

| Token | Value | Usage |
|---|---|---|
| `--ds-admin-surface` | `#f5f3f0` | Admin page background (slightly cooler than guest Snow) |
| `--ds-admin-card` | `#ffffff` | Card surfaces, table rows |
| `--ds-admin-row-hover` | `#f0eeea` | Table row hover |
| `--ds-admin-row-selected` | `#e8e4de` | Table row selected |
| `--ds-admin-border` | `#ddd8d0` | Table borders, dividers |
| `--ds-admin-text` | `#1a1a18` | Primary text (denser black than Forest-900) |
| `--ds-admin-muted` | `#8a8278` | Secondary text, metadata |
| `--ds-admin-pending` | `#d97706` | Pending booking status (amber) |
| `--ds-admin-checked-in` | `#2d6a4f` | Checked-in status (Forest-500) |
| `--ds-admin-cancelled` | `#dc2626` | Cancelled status (Error) |
| `--ds-admin-archived` | `#a89f94` | Archived/expired (Stone-400) |

### Typography for admin

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--ds-admin-text-xs` | 0.75rem (12px) | 500 | Table cell data, badges |
| `--ds-admin-text-sm` | 0.8125rem (13px) | 400 | Body text, descriptions |
| `--ds-admin-text-base` | 0.875rem (14px) | 500 | Labels, button text |
| `--ds-admin-text-lg` | 1rem (16px) | 600 | Section headers |
| `--ds-admin-text-xl` | 1.25rem (20px) | 600 | Page titles |

Note: Admin uses Inter exclusively (no Playfair). Inter at 14px provides better
information density than 16px body text.

### Spacing for admin

Admin uses the same 8px grid as guest but with tighter defaults:
- Table cell padding: `--ds-space-2` (8px) vertical, `--ds-space-3` (12px) horizontal
- Card padding: `--ds-space-4` (16px) instead of `--ds-space-6` (24px)
- Section margin: `--ds-space-6` (24px) instead of `--ds-space-10` (40px)

### Component sizing for admin

Controls are 36px tall (vs 44px on guest) for higher density while remaining
touch-viable on tablet.

### Shadow

Same as guest tokens (sm/md/lg) but with cooler undertones for data surfaces:
```
--ds-admin-shadow-sm: 0 1px 2px rgba(0,0,0,0.04)
--ds-admin-shadow-md: 0 2px 8px rgba(0,0,0,0.06)
--ds-admin-shadow-lg: 0 4px 16px rgba(0,0,0,0.08)
```

---

## Admin component roadmap (not for implementation, for design planning)

| Component | Guest? | Admin adaptation |
|---|---|---|
| DataTable | New | Sortable columns, row actions dropdown, pagination |
| StatusBadge | New | Color by booking status (pending/confirmed/checked-in/cancelled) |
| MetricCard | New | KPI cards: occupancy %, revenue, bookings today, check-ins today |
| SearchInput | Extend guest | Same component, smaller size preset |
| Modal | Extend guest | Confirmation dialogs, detail panels, full-screen on mobile |
| DateRangePicker | Extend guest | Preset ranges: "Today", "This week", "This month", "Custom" |
| Toast | Extend guest | Action feedback: "Booking confirmed", "Check-in complete" |
| Sidebar | New | Navigation: Dashboard, Bookings, Hostels, Rooms, Customers, Settings |

---

## Deliverable

Update `.paperclip/design/system/design-tokens.md` with admin token extensions.

- Add "Admin color tokens" section
- Add "Admin typography scale" subsection
- Note admin component sizing (36px controls)
- Add admin shadow tokens
- Add admin "Status badge" semantic colors

## Acceptance criteria

- [ ] Admin color tokens defined (surface, card, row hover, etc.)
- [ ] Admin typography scale defined (12-20px, Inter only)
- [ ] Admin component sizing documented (36px baseline)
- [ ] Status badge colors defined for: pending, confirmed, checked-in, cancelled, archived
- [ ] Admin shadow tokens documented

## References

- `.paperclip/design/system/design-tokens.md` — existing guest tokens to extend
- `.paperclip/ORG_PLAN.md` — company plan for admin scaffolding
- `.paperclip/TEAM.md` — org chart showing UI Engineer role
