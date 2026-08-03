# Dostel Iconography System v1.0

**Issue:** DOS-83  
**Surfaces:** Guest web and Admin PMS  
**Implementation target:** One shared visual language; no emoji as interface controls, navigation, amenities, statuses, or empty-state artwork.

## 1. Outcome

Dostel uses a consistent, accessible SVG icon system that feels precise enough for enterprise PMS workflows and warm enough for the guest product. Icons support recognition; labels carry meaning.

This fixes the current platform inconsistency: emoji render differently by OS, vary in visual weight, can be misannounced by assistive technology, and make booking and PMS surfaces feel unfinished.

## 2. Visual direction

- Geometry: rounded line icons with open counters and calm proportions.
- Grid: 24×24 viewBox; 20×20 for metadata; 16×16 only in dense admin tables.
- Stroke: 2px guest UI; 1.75–2px admin UI. Use round caps and joins.
- Fill: none by default. Filled shapes are reserved for selected navigation and status emphasis.
- Color: inherit `currentColor`; consumers choose semantic tokens.
- Brand motif: a restrained two-ridge line may appear in the logo/brand mark only. Do not redraw every icon as a mountain.
- Labels: visible labels remain on primary navigation, booking actions, policies, and admin commands.

## 3. Approved implementation

Use the existing inline React SVG pattern in `apps/frontend/components/Icons.tsx` for guest UI. Do not add a new package for this migration. Admin may use the same icon contracts or its existing SVG components; both surfaces must share names and sizing.

Each component accepts:

```ts
interface IconProps {
  className?: string
  'aria-hidden'?: boolean
}
```

Decorative icons default to `aria-hidden="true"`. Icon-only buttons receive their accessible name on the parent button, not the SVG.

## 4. Semantic icon registry

| Key | Meaning | Required contexts |
|---|---|---|
| `home` | Home | Guest mobile navigation |
| `bed` | Hostel, room, bed | Navigation, room inventory |
| `dashboard` | Dashboard | Member and admin navigation |
| `calendar` | Dates, bookings | Search, booking, events |
| `users` | Guests, community, capacity | Room metadata, Dostellers |
| `mountain` | Destination/place | Destination filters, brand story |
| `briefcase` | Workation | Navigation, filters |
| `map-pin` | Location | Property metadata, access |
| `lock` | Locker/security | Amenities, trust |
| `lamp` | Reading light | Room amenities |
| `plug` | Power socket/backup | Room amenities |
| `shower` | Hot shower | Amenities |
| `wifi` | Wi-Fi | Amenities |
| `snowflake` | Air conditioning | Amenities |
| `coffee` | Café | Amenities and place story |
| `flame` | Bonfire | Amenities and events |
| `camera` | CCTV | Trust and safety |
| `paw` | Pet friendly | Amenities |
| `parking` | Parking | Amenities |
| `check` | Confirmed/selected | Selection and success |
| `alert-circle` | Warning/error | Validation and unavailable states |
| `phone` | Contact/support | Footer and arrival guide |
| `instagram` etc. | Social network brand | Footer only |

Unknown icon keys fall back to no icon, never a bullet or emoji. The visible text label remains.

## 5. Color and state rules

| Context | Color |
|---|---|
| Primary action/navigation | `forest-700` or inherited text color |
| Secondary metadata | `stone-600` |
| Selected/active | `forest-500`; pair with label/shape, never color alone |
| Trust/information | `sky` with Forest-900 text |
| Warm highlight | Sunset with Forest-900 text; not white text |
| Error/destructive | `error` plus text label |
| Disabled | Stone-400 icon with readable Stone-600 label |

Icons never receive independent gradients, drop shadows, multi-color emoji styling, or decorative circles on every instance.

## 6. Accessibility contract

- Interactive controls have a minimum 44×44px target; the glyph may remain 20–24px.
- Decorative SVGs use `aria-hidden="true"` and `focusable="false"`.
- Standalone meaningful SVGs use `role="img"` with an accessible name, but prefer visible adjacent text.
- Icon-only controls require `aria-label` or `aria-labelledby` on the button/link.
- Status, availability, selection, and errors use icon + text; never icon or color alone.
- Tooltips supplement unfamiliar icon-only actions but do not replace accessible names.
- Focus remains on the control, not its SVG.

## 7. Motion

Icons do not wiggle, bounce, pulse, spin, or scale independently. They participate only in the system’s three purposeful motions:

1. The containing interactive card may lift on hover.
2. The containing page may fade in.
3. The containing button may compress on press.

Loading indicators are functional exceptions and must stop under `prefers-reduced-motion`.

## 8. Migration slices

### Slice A — booking decision UI (P0)

Replace emoji amenity mapping in `RoomSelector` with semantic SVG icons: locker, lamp, plug, curtain, shower, users, snowflake, screen, bath, wifi, housekeeping, mountain, balcony. Preserve amenity text. Replace the text glyph check with `CheckIcon` plus `Selected`.

### Slice B — global navigation/footer (P0)

Replace mobile navigation emoji with home, bed, dashboard, calendar/event, mountain/users. Replace footer social emoji with platform SVG marks. Labels and accessible names remain.

### Slice C — trust, filters, empty states (P1)

Replace emojis on home trust items, property amenities, category filters, Dostellers benefits, workations, and empty states. Empty states use one restrained line illustration or icon in a tinted 48px container, not oversized emoji.

### Slice D — content data and admin parity (P1)

Replace emoji strings in data objects with semantic icon keys. Admin navigation and table actions use the same registry terms and size rules.

## 9. Component/data contracts

```ts
type IconKey =
  | 'home'
  | 'bed'
  | 'dashboard'
  | 'calendar'
  | 'users'
  | 'mountain'
  | 'briefcase'
  | 'map-pin'
  | 'lock'
  | 'lamp'
  | 'plug'
  | 'curtain'
  | 'shower'
  | 'wifi'
  | 'snowflake'
  | 'coffee'
  | 'flame'
  | 'camera'
  | 'paw'
  | 'parking'
  | 'check'
  | 'alert-circle'
  | 'phone'

type IconSize = 'sm' | 'md' | 'lg'

interface DostelIconProps {
  name: IconKey
  size?: IconSize
  className?: string
  decorative?: boolean
  label?: string
}
```

Size map: `sm=16`, `md=20`, `lg=24`. If `decorative=false`, `label` is required at the type or runtime boundary.

## 10. Verification

### Mobile — 360×800 and 390×844
- Navigation icons align on a common baseline and retain visible labels.
- All icon controls are at least 44×44px.
- Room amenities remain readable without horizontal overflow.
- No emoji appear in navigation, booking controls, trust rows, filters, or empty states.

### Desktop — 1440×900
- Guest and admin strokes, sizes, and semantic names feel consistent.
- Dense admin rows use 16px icons without reducing control targets.
- Hover, focus, selected, disabled, error, and loading states remain distinguishable without color alone.

### Automated/manual
- Search source files for Unicode emoji; remaining matches must be approved editorial copy, never UI structure.
- Keyboard-test all icon-only controls.
- Screen-reader test navigation and room selection; decorative SVGs are silent.
- Verify Windows, Android, iOS, and macOS no longer produce platform-dependent UI glyphs.

## 11. Acceptance criteria

- [ ] A typed semantic icon registry replaces emoji values in interface data.
- [ ] Guest navigation, footer social links, RoomSelector, filters, trust rows, and empty states use SVG icons.
- [ ] Admin uses the same naming, sizing, and accessibility conventions.
- [ ] No new icon dependency is added for the guest migration.
- [ ] Every icon-only control has an accessible name and 44×44px target.
- [ ] Status and selection retain visible text.
- [ ] No independent decorative icon animation is introduced.
- [ ] Mobile and desktop verification notes are posted on the implementation issue.
