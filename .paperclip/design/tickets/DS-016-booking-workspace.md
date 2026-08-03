# DS-016: Admin Booking Workspace Implementation

**Assignee**: UI Engineer / Builder  
**Priority**: P0  
**Depends on**: DS-001 (tokens), DS-004 (admin design language)  
**Estimate**: 1-2 heartbeats  

---

## Status Summary

The existing `admin-shell.md` spec covers the full admin PMS. This ticket focuses on the **Booking Workspace** slice for immediate implementation.

### Audit Results
| Component | Current State | Required Action |
|-----------|---------------|-----------------|
| `DataTable` | Visual table only | Add caption, sorting, selection, pagination, explicit open action |
| `Sidebar.tsx` | Static, hand-authored SVG icons | Replace with role-aware navigation + property switcher |
| Bookings page | Static dataset | Replace with operational views, filters, booking drawer |
| `StatusBadge` | Varying semantics | Enforce shared text/icon/tone vocabulary |
| `globals.css` | Decorative headings | Remove display font; add shell/density/focus tokens |

---

## Deliverables

### 1. Booking Index Page (`apps/admin/app/bookings/page.tsx`)

**Saved Views** (tab-style buttons):
- `Arriving today`  
- `Departing today`  
- `Payment due`  
- `Needs room/bed`  
- `Cancelled/refund pending`  
- `All bookings`

**Essential Columns**:
- `Booking ref`, `Guest`, `Stay`, `Room/bed`, `Payment`, `Arrival`, `Booking status`

**Filter Bar**:
- Search by booking ref/guest name
- Filter by status (multi-select)
- Date range picker

### 2. Booking Detail Drawer

**Hierarchy** (in order):
1. Booking status, reference, and next required action
2. Guest contact and verified identity
3. Stay dates, guests, room/bed assignment
4. Payment total, paid/balance
5. Arrival ETA and late-arrival state
6. Dosteller tier/rate/points context
7. Internal notes with author/timestamp
8. Activity timeline

**Actions** (sticky footer):
- Record payment
- Assign/change bed
- Send arrival instructions
- Check in / Check out
- Cancel/refund request

### 3. Room Conflict Prevention

When assigning/changing room/bed:
- Show conflict preview (affected guests, price change)
- Block save on conflict
- Require typed confirmation for irreversible multi-record actions

---

## Component Contracts

### `DataTable`

Interface remains as specified in `admin-shell.md` Section 6. Key additions:
- `caption: string` – visible label for screen readers
- `onOpen(row, returnFocusEl)` – explicit row open action
- `loading?: boolean` – skeleton preserves column widths
- Mobile fallback: `recordCards` prop for card view at < 768px

### `DetailDrawer`

```tsx
interface DetailDrawerProps {
  title: string
  subtitle?: string
  open: boolean
  dirty?: boolean
  sections: Array<{
    id: string
    heading: string
    content: React.ReactNode
  }>
  actions: Array<{
    label: string
    intent: 'primary' | 'secondary' | 'danger'
    permission: string
    onInvoke: () => void
  }>
  onClose: () => void
}
```

- 440px width at ≥1280px
- Full-screen sheet on mobile (360px)
- Focus moves to drawer heading on open
- Escape closes only if no unsaved changes

### `StatusBadge` (Shared Vocabulary)

```tsx
interface StatusDefinition {
  label: string
  icon: React.ReactNode
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  description?: string
}
```

**Required Statuses**:
| Status | Tone | Description |
|--------|------|-------------|
| Confirmed | success | Booking confirmed, payment received |
| Pending | warning | Awaiting payment or confirmation |
| Arrived | info | Guest has checked in |
| Departed | neutral | Guest has checked out |
| Cancelled | danger | Booking cancelled |

---

## Acceptance Criteria

### Functional
- [ ] Saved views update URL: `/bookings?view=arriving-today`
- [ ] Table sorting persists in URL after navigation
- [ ] Filters survive page refresh
- [ ] Opening detail drawer preserves table scroll position
- [ ] Room conflict is blocked before save with clear messaging
- [ ] StatusBadge uses shared vocabulary across list, drawer, and guest message

### Mobile (360×800)
- [ ] Table transforms to record cards with 44px touch targets
- [ ] Detail drawer becomes full-screen sheet
- [ ] Navigation opens as modal drawer with focus trap
- [ ] Bulk actions hidden on mobile if unsafe

### Accessibility (WCAG AA)
- [ ] Sort buttons announce direction via `aria-sort`
- [ ] Detail drawer has `aria-labelledby` pointing to heading
- [ ] Status communicated by text + icon, not color alone
- [ ] Focus trap in modal states (nav drawer, detail sheet)
- [ ] Error summary links to invalid fields after failed mutation

### Visual
- [ ] Admin uses functional sans font (no Playfair or decorative headings)
- [ ] Shola green (Forest-500) for selected/navigation states
- [ ] Sunset only for primary/high-attention actions
- [ ] No dashboard-in-dashboard compositions
- [ ] Density: 40px table rows, 48px form fields

---

## Verification Notes Template

```
Desktop 1440×900:
- booking list: 
- drawer open/close: 
- room conflict: 

Compact 1024×768:
- collapsed rail: 
- overlay drawer: 

Mobile 360×800:
- record cards: 
- full-screen detail: 
- touch targets: 

States/a11y:
- loading/skeleton: 
- screen reader: 
- reduced motion: 
```

---

## Related Tickets
- DS-001: Token migration (must be done first)
- DS-004: Admin design language
- DS-009: Loyalty tokens and badges
- DS-010: Guest booking flow completion