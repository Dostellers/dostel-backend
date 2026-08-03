# Admin/PMS Enterprise Shell Spec v1.0

**Issue:** DOS-49  
**Surface:** `apps/admin`  
**Scope:** Shared shell and operational patterns for properties, rooms/inventory, bookings and guests  
**Primary viewport:** 1440×900; compact desktop: 1024×768; mobile exception viewport: 360×800

## 1. Outcome

A receptionist or property manager can identify work requiring attention, filter a large dataset, inspect a record and complete the next safe action without losing context. The shell should feel like a hostel operations workspace—not a generic analytics dashboard.

Success means:

- navigation reflects operational jobs rather than implementation entities;
- dense tables remain readable and keyboard-operable;
- filters, sorting and selection survive navigation and refresh;
- details open without destroying list context;
- high-impact actions show consequences and require explicit confirmation;
- every guest promise—payment, room, policy, arrival/access and Dosteller status—is visible to staff.

## 2. Current audit

| Area | Current state | Required correction |
|---|---|---|
| Navigation | Fixed 240px sidebar; no mobile or collapse behavior | Responsive rail/drawer, property switcher, role-aware items, global command/search entry |
| Bookings | Static table with no search, filters, sorting or row action | Operational queue with saved views, arrival status and detail drawer |
| Guests | Static table; email displayed but no actionable context | Searchable guest directory with stay, balance, consent and Dosteller context |
| Rooms | Create/edit forms are always exposed above tables | Inventory workspace; move create/edit into drawer, show conflicts and consequences |
| Data table | Visual table only; no caption, sort, selection, pagination or horizontal strategy | Reusable enterprise table contract with accessible controls and responsive fallback |
| Status | Text/color badge exists, but semantics vary by page | Shared status vocabulary pairing label, icon and color |
| Feedback | Inline error string; loading is plain text | Retained-layout loading, actionable empty/error/offline/saving states |
| Typography | Display heading font used in admin | Functional sans throughout PMS; mono only for references, amounts optional |

## 3. Information architecture

```text
Operations
├─ Today                    arrivals, departures, exceptions
├─ Bookings                 reservation lifecycle and payment
├─ Calendar                 room/bed allocation by date

Inventory
├─ Rooms & beds             physical status and assignments
├─ Room types & rates       sellable inventory and pricing
├─ Properties               property configuration and access guidance

Relationships
├─ Guests                   identity, stays, notes, consent
├─ Dostellers               tier, rewards, long-stay context

Control
├─ Reports                  saved operational/finance exports
├─ Team & permissions       role access
├─ Activity                 audit trail
└─ Settings
```

### Navigation rules

- `Today`, `Bookings`, `Rooms & beds`, `Guests` are always primary.
- `Badges` is not primary PMS navigation; it belongs under Dostellers.
- Health/debug routes are restricted to technical roles and never shown to property staff.
- Current property is visible in a labelled switcher above navigation. Global users may choose `All properties`; property-scoped users cannot.
- Navigation badges show actionable counts only, such as `3 arrivals need action`; never decorative KPI totals.
- Route, query, filters, sort and selected record are URL-addressable when safe.

## 4. Shell anatomy

### 1440×900

```text
┌───────────────┬────────────────────────────────────────────────────┐
│ Dostel PMS    │ Property / route                    Search   User │ 56
│ Vattakanal ▾  ├────────────────────────────────────────────────────┤
│               │ Page title · count                Primary action │
│ Today       3 │ Saved views / filters / bulk actions              │
│ Bookings      ├───────────────────────────────┬────────────────────┤
│ Calendar      │                               │ Detail drawer      │
│ Rooms & beds  │ Operational table / board     │ 440px              │
│ Guests        │                               │                    │
│ Dostellers    │                               │                    │
│               │                               │                    │
│ Reports       │                               │                    │
│ Activity      │                               │                    │
│ Settings      │                               │                    │
│ Team / help   │                               │                    │
└───────────────┴───────────────────────────────┴────────────────────┘
     232px                  fluid                    optional
```

- Content header remains visible while the table scrolls.
- Sidebar uses a dense 40px row rhythm and may collapse to a 64px labelled-icon rail between 1024 and 1199px.
- Main content owns scrolling; shell header/sidebar remain stable.
- Detail drawer is 440px at ≥1280px and overlays at 1024–1279px. It does not alter table sorting or scroll position.
- Admin uses functional sans throughout; no decorative display font.

### 360×800 exception mode

The PMS is desktop-first but core incident handling must remain usable on a phone.

```text
┌────────────────────────────┐
│ Menu  Vattakanal      User │ 56
├────────────────────────────┤
│ Bookings                   │
│ 24 results      [New]      │
│ [Search bookings]          │
│ [Arrivals] [Payment due]   │ horizontally scrollable chips
├────────────────────────────┤
│ DOS-2407-018  Confirmed    │
│ A. Kumar · Today, 2 PM     │
│ Mixed dorm · Bed pending   │
│ ₹600 due          [Open]   │
├────────────────────────────┤
│ record cards, not squeezed │
│ desktop table              │
└────────────────────────────┘
```

- Sidebar becomes a modal navigation drawer with focus trap and focus restoration.
- Tables transform to task cards using explicitly prioritized fields; they do not rely on horizontal scrolling for primary tasks.
- Detail drawer becomes a full-screen route-like sheet with sticky close/back and primary action.
- Bulk actions may be unavailable on small screens if safe completion cannot be guaranteed; explain that desktop is required.

## 5. Shared page hierarchy

Every operational index page uses:

1. Breadcrumb only when hierarchy adds meaning.
2. Page title, result count and one primary create/action button.
3. Saved views representing jobs: `Arriving today`, `Payment due`, `Unassigned beds`, not generic chart tabs.
4. Search and visible high-value filters; additional filters in a labelled panel.
5. Applied-filter summary with individual remove and `Clear all`.
6. Bulk action bar only after selection.
7. Table/board with persistent column header.
8. Pagination or cursor controls with result range.
9. Detail drawer opened from a row.

KPI cards are permitted on `Today` only when each metric leads to the underlying work queue. They must not precede the primary task list on operational routes.

## 6. Core component contracts

### `AdminShell`

```ts
interface AdminShellProps {
  user: { name: string; role: string; avatarUrl?: string }
  properties: Array<{ id: string; name: string }>
  activePropertyId?: string
  navigation: AdminNavGroup[]
  onPropertyChange(id?: string): void
  children: React.ReactNode
}
```

- Property changes prompt before discarding unsaved drawer edits.
- Role and property scope control visibility and server authorization; hiding UI alone is insufficient.

### `OperationalPageHeader`

```ts
interface OperationalPageHeaderProps {
  title: string
  resultCount?: number
  description?: string
  primaryAction?: { label: string; onInvoke(): void; permission: string }
  lastUpdatedAt?: string
}
```

### `FilterBar`

```ts
interface FilterDefinition {
  id: string
  label: string
  type: 'search' | 'single-select' | 'multi-select' | 'date-range' | 'boolean'
  options?: Array<{ label: string; value: string }>
}

interface FilterBarProps {
  definitions: FilterDefinition[]
  value: Record<string, string | string[] | boolean | undefined>
  savedViews?: Array<{ id: string; label: string; query: string }>
  onChange(value: FilterBarProps['value']): void
  onSaveView?(name: string): void
}
```

- Filters write to URL after explicit apply on mobile and immediately/debounced on desktop.
- Search debounce is 300ms; Enter applies immediately.
- Result count changes are announced through one polite live region.

### `DataTable`

```ts
interface DataColumn<T> {
  id: string
  header: string
  accessor?: keyof T
  render?(row: T): React.ReactNode
  sortable?: boolean
  priority: 'essential' | 'supporting' | 'desktop-only'
  align?: 'start' | 'center' | 'end'
}

interface DataTableProps<T> {
  caption: string
  columns: DataColumn<T>[]
  rows: T[]
  rowKey(row: T): string
  sort?: { columnId: string; direction: 'asc' | 'desc' }
  selectedIds?: string[]
  loading?: boolean
  onSort?(sort: DataTableProps<T>['sort']): void
  onOpen(row: T, returnFocusTo: HTMLElement): void
  onSelectionChange?(ids: string[]): void
}
```

- Sort controls are buttons inside `<th>` and announce direction.
- Row click may open details, but the row also contains a named `Open booking` action for keyboard and assistive technology.
- Checkboxes have row-specific accessible names.
- Numeric/date columns align consistently; references use tabular numerals.
- Selected rows remain selected across pagination only when actions support it.
- Loading skeleton preserves column widths; stale rows may remain visible with `Updating` status.

### `DetailDrawer`

```ts
interface DetailDrawerProps {
  title: string
  subtitle?: string
  open: boolean
  dirty?: boolean
  sections: Array<{ id: string; heading: string; content: React.ReactNode }>
  actions: Array<{ label: string; intent: 'primary' | 'secondary' | 'danger'; permission: string; onInvoke(): void }>
  onClose(): void
}
```

- Desktop drawer is non-modal when the list remains operable; overlay/mobile variants are modal.
- Focus moves to drawer heading on open and returns to the invoking control on close.
- Escape closes only if no unsaved change or destructive confirmation is active.
- Primary actions remain in a sticky footer and never obscure errors.

### `StatusBadge`

```ts
interface StatusDefinition {
  label: string
  icon: React.ReactNode
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  description?: string
}
```

Status is always conveyed by text plus icon, never color alone. Identical status keys use identical labels and tones across tables, drawers and guest communication.

### `ActivityTimeline`

```ts
interface ActivityEvent {
  id: string
  occurredAt: string
  actor: string
  action: string
  summary: string
  source: 'staff' | 'guest' | 'system'
  correlationId?: string
}
```

Critical mutations add an immutable activity event with actor, timestamp and before/after summary.

## 7. Booking workspace

### Default saved views

- Arriving today
- Departing today
- Payment due
- Needs room/bed
- Late arrival reported
- Cancelled/refund pending
- All bookings

### Essential columns

`Booking ref`, `Guest`, `Stay`, `Room/bed`, `Payment`, `Arrival`, `Booking status`, `Property` (when all properties).

### Booking drawer hierarchy

1. Booking status, reference and next required action.
2. Guest contact and verified identity/check-in requirement.
3. Stay dates, guests, room/bed assignment and inventory conflict state.
4. Payment total, paid, balance, method and transaction references.
5. Arrival ETA, access note sent, late-arrival state.
6. Accepted cancellation/house-rule versions and timestamps.
7. Dosteller tier/rate/points context.
8. Internal notes with author and timestamp.
9. Activity timeline.

### Actions

- Assign/change bed
- Record payment
- Send approved arrival instructions
- Update arrival ETA/late status
- Check in / check out
- Cancel/refund request

Room reassignment previews affected guests, inventory conflicts and price changes before confirmation. Conflicts are blocked, not merely warned.

## 8. Rooms and inventory workspace

Do not expose create/edit forms permanently above the inventory table.

- Default view is a property/date inventory board grouped by room type and physical room.
- Secondary tab shows room types and base rates.
- `Add room`, `Add room type` and edit actions open a drawer.
- Physical state vocabulary: `Available`, `Occupied`, `Maintenance`, `Out of order`.
- Sellability is separate from physical state; an occupied room may have future sellable inventory.
- Status mutation requires reason and effective period for maintenance/out-of-order.
- Deleting referenced inventory is prohibited; archive with consequence summary instead.
- Availability updates show last-sync time and stale/offline treatment.

## 9. Guest workspace

### Essential columns

`Guest`, `Contact`, `Upcoming/last stay`, `Open balance`, `Dosteller`, `Risk/action`, `Property` when global.

### Guest drawer hierarchy

1. Identity/contact and communication consent.
2. Upcoming stay and arrival requirements.
3. Open balance/refund.
4. Stay history.
5. Dosteller tier, reward value and long-stay history.
6. Safety/accessibility preferences with restricted visibility.
7. Internal notes and activity.

Sensitive ID documents and safety notes require explicit permission and access audit. Do not expose them in list rows.

## 10. Properties workspace

Property detail prioritizes operational promises rather than marketing previews:

- contact and staffed hours;
- verified map coordinates/URL, address, landmark, final approach, transport limits and after-dark guidance;
- check-in/out windows, age/ID requirements and policy versions;
- room/inventory health;
- guest-facing publication status;
- last verification actor/date for access and policy data.

Changing guest-facing access or policy data shows affected future bookings and requires a publish confirmation.

## 11. State model

| State | Contract | Recovery |
|---|---|---|
| Initial loading | Layout-matched shell/table skeleton; no spinner-only page | Automatic |
| Updating filters | Retain rows with `Updating`; controls remain usable | Automatic/retry |
| Empty dataset | Explain absence and permission-aware create action | `Create…` if allowed |
| Empty filtered | Show applied criteria and result count zero | `Clear filters` |
| Error | Preserve filters and known data; explain impact | `Retry` |
| Offline/stale | Show last sync and disable unsafe mutations | `Reconnect` |
| Saving | Action shows progress; prevent duplicate submission | Automatic |
| Save failed | Retain entered data and field errors | `Try again` |
| Conflict | Name competing record and consequence | Resolve conflict; do not force silently |
| Unauthorized | Explain unavailable action without exposing restricted data | Request access/contact admin |
| Success | Confirm action inline and update row/activity | Continue work; no interruptive modal |

Destructive actions use a confirmation dialog naming the record and consequence. Requiring typed confirmation is reserved for irreversible multi-record actions.

## 12. Accessibility

- WCAG 2.2 AA; 4.5:1 text contrast, 3:1 component boundaries and status icons.
- Functional sans throughout admin; minimum 14px table text and 16px form inputs on mobile.
- All controls have visible persistent labels; placeholders are never labels.
- Focus indicator is at least 2px, high-contrast trail blue, and never clipped.
- Logical source/tab order; no positive `tabindex`; room choices are buttons or labelled quantity controls.
- Selected state includes text/icon and `aria-pressed` or native selection semantics.
- Error summary receives focus after invalid submit and links to each invalid field.
- At 200% zoom and 320 CSS px, content reflows without two-dimensional scrolling.
- Gallery controls announce position; images have meaningful alt text, decorative contour graphics use empty alt.
- External map action identifies that it opens a new app/tab.
- Reduced motion removes transforms; selection and confirmation remain immediately legible.

## 13. Purposeful motion

1. **Drawer reveal:** 180ms opacity and ≤8px translate.
2. **Row update:** 150ms background emphasis after successful mutation.
3. **Navigation collapse:** 180ms width/opacity, preserving focus.

No auto-rotating gallery, parallax, shimmer after content loads, or motion-based urgency. Under `prefers-reduced-motion: reduce`, remove transforms and shorten transitions to effectively immediate.

## 14. Visual direction

- Shola green (Forest-500) anchors navigation and selected states; campfire sunset is reserved for primary/high-attention actions, not every control.
- Mist/snow surfaces provide hierarchy; operational tables remain white with restrained separators.
- Trail blue is reserved for focus, links and informational state.
- No gradients, glass panels, oversized metric cards, decorative Playfair headings or dashboard-in-dashboard compositions.
- Use production icons from the existing approved icon library; no emoji or hand-authored SVG path strings in new shell components.
- Density tokens: `compact` for tables (40px row), `comfortable` for drawers/forms (48px field rhythm). Users may select table density and preference persists locally.

## 15. Acceptance criteria

### Shell and navigation

- [ ] 1440×900 shows stable sidebar, page header, filter bar and table without whole-page scrolling.
- [ ] 1024×768 uses collapsed rail/overlay drawer without obscuring page actions.
- [ ] 360×800 uses modal navigation and prioritized record cards, not a squeezed table.
- [ ] Property switch retains route and resets only incompatible filters.
- [ ] Role-restricted items/actions are absent and server-authorized.
- [ ] Unsaved drawer edits are protected during route/property changes.

### Data operations

- [ ] Search, filters, sort, pagination and selected record are URL-restorable where safe.
- [ ] Sorting, row opening, selection and pagination work keyboard-only.
- [ ] Opening/closing a record restores table scroll, filters and focus.
- [ ] Applied filters are visible individually and clearable.
- [ ] Bulk action bar appears only after selection and names selected count.
- [ ] Loading, empty dataset, empty filtered, error, offline, save failure and conflict states meet Section 11.

### Booking/arrival integrity

- [ ] Booking drawer shows payment, room/bed, policy acceptance, arrival/access status and Dosteller context.
- [ ] Room conflict is blocked before save and identifies the conflicting booking.
- [ ] Payment and cancellation actions include consequence preview and activity event.
- [ ] Arrival instructions use the approved property access record and record sent timestamp/template version.
- [ ] Status semantics remain identical across list, drawer and guest message.

### Accessibility and responsive verification

- [ ] Keyboard-only completion has visible, unobscured focus and logical order.
- [ ] Screen reader announces page, result changes, sort direction, drawer heading and mutation result once.
- [ ] 200% zoom and 320px width retain all required content/actions without horizontal scrolling.
- [ ] 360×800 passes menu focus trap, record-card actions and full-screen detail checks.
- [ ] 1280×800 and 1440×900 pass sidebar, focus-order and total/policy consistency checks.
- [ ] Reduced-motion mode removes transforms and preserves state clarity.

## 16. Engineering handoff

### Existing targets

- `apps/admin/components/Sidebar.tsx`: replace fixed-only navigation and hand-authored SVG paths with responsive, role-aware shell navigation and property switcher.
- `apps/admin/components/DataTable.tsx`: add caption, sorting, selection, pagination, explicit open action, loading state and mobile record renderer.
- `apps/admin/components/StatusBadge.tsx`: enforce shared text/icon/tone vocabulary.
- `apps/admin/app/bookings/page.tsx`: replace static dataset presentation with operational views, filters and booking drawer.
- `apps/admin/app/rooms/page.tsx`: move always-visible forms into drawers; separate physical state from sellability and add conflict/consequence flow.
- `apps/admin/app/guests/page.tsx`: add filters, operational columns and restricted-detail drawer.
- `apps/admin/app/globals.css`: remove decorative heading typography from PMS; add shell/density/focus/safe responsive tokens.

### Proposed reusable components

`AdminShell`, `PropertySwitcher`, `OperationalPageHeader`, `FilterBar`, `SavedViewTabs`, `AppliedFilters`, `DataTable`, `MobileRecordList`, `DetailDrawer`, `BulkActionBar`, `ConfirmationDialog`, `ActivityTimeline`, `InlineNotice`, `SkeletonTable`.

### Verification note template

```text
Desktop 1440×900:
- navigation/property scope:
- table density/sort/filter:
- drawer open/close/focus return:
- booking action/audit event:

Compact 1024×768:
- collapsed rail:
- drawer overlay:
- sticky header/table scroll:

Mobile 360×800:
- navigation focus trap:
- record card priorities:
- full-screen detail:
- touch targets:

States/a11y:
- loading/empty/error/offline/conflict:
- keyboard/screen reader/200% zoom:
- reduced motion:
```

---
*Hand-off to UI Engineer/Builder. Start with DS-001 token migration before touching admin UI components.*