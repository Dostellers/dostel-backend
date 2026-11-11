# Dostel Design System — Enterprise Guide

Brand: **Dostel** — community hostel (Vattakanal/Kodaikanal)  
Design org: `.paperclip/TEAM.md` · Competition: `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md`  
Visual identity: `.paperclip/design/visual-identity.md` · Tokens: `.paperclip/design/system/design-tokens.md` · Components: `.paperclip/design/components.md`

---

## Surfaces

| Surface | Stack | Location | Status |
|---------|-------|----------|--------|
| Guest frontend | Next.js 16 + React 19 + Tailwind v4 | `apps/frontend/` | In progress — booking flow (7 steps), Dostellers flow (5 routes), search, detail, checkout |
| Admin PMS | Next.js 16 + React 19 + Tailwind v4 + Lucide icons | `apps/admin/` | Scaffolded — dashboard, bookings table, hostels cards, guests page, sidebar nav, AuthGate |

---

## Design principles

Learned from Meta **Astryx** + Hostelworld patterns; Noticeboard DNA kept.

1. **Ink primary, coral accent** — Primary actions are ink; coral is hover/focus/brand mark — never a hero wash. Yellow is a tag fill only.
2. **Noticeboard concept** — Stamp, tag, board, guestbook — structural, not cork/tape textures
3. **Semantic tokens** — Prefer `--color-surface`, `--color-text-primary`, `--color-accent` over scattered hex (Astryx rule)
4. **Components over raw HTML** — Prefer `components/ui/*` (Button, DateRangeField, GuestSelect) before inventing controls
5. **Controlled fields** — value + onChange; DateRange = one trigger + popover; Select = listbox, not OS chrome
6. **Community soul** — Bricolage Grotesque + Inter + JetBrains Mono (data), warm paper (`#FFFDF9`)
7. **Mobile-first** — sticky bottom bars (72px), ≥44px targets, single-column <768px
8. **Accessible by default** — WCAG AA, focus on `--color-accent`, `prefers-reduced-motion`
9. **Motion with purpose** — card lift, page fade, button press, pin settle, reveal, split-flap, hero word-rise
10. **Warm not trendy** — no purple gradients, no dashboard-in-hero, no cream+terracotta brochure defaults

---


## Design tokens

Living specimens: `apps/frontend/app/design` · CSS: `apps/frontend/app/globals.css`

| Token family | Covered |
|---|---|
| Brand scales | Coral, Yellow, Ink, Paper + semantic aliases (`surface`, `text-primary`, `accent`, `tag-fill`, `negative`) |
| Typography | Bricolage Grotesque (display) + Inter (body) + JetBrains Mono (data) + Noto Devanagari |
| Spacing | 8px grid (4–64px) |
| Radius | `--radius-element` 2px · `--radius-control` 4px · `--radius-container` 6px |
| Shadows | flat / raised / float / board |
| Motion | `--transition-fast` 150ms · `--transition-base` 220ms · `--ease-out-soft` |
| UI kit | `Button`, `DateRangeField`, `GuestSelect` under `apps/frontend/components/ui/` |
| States | hover/active/focus/disabled/loading/empty/error |

---

## Flow specs

| Flow | File | Version | Key deliverables |
|---|---|---|---|
| Guest booking (7-step) | `.paperclip/design/flows/booking-flow.md` | v5.0 | Search→Listing→Detail+Rooms→Guest Details→Review→Payment→Confirmation |
| Dostellers journey (5-step) | `.paperclip/design/flows/dostellers-journey.md` | v3.1 | Discover→Join→Dashboard→Long-stay Book→Badges; UI contracts |
| Property decision & arrival | `.paperclip/design/flows/property-decision-arrival.md` | v1.0 | Decision strip, room choices, access guide, arrival plan |
| Admin/PMS enterprise shell | `.paperclip/design/flows/admin-shell.md` | v1.0 | Operational IA, dense tables, filters, detail drawers, status and audit contracts |
| Search & listing flow | `.paperclip/design/flows/search-listing-flow.md` | v1.0 | SearchBar URL sync, HostelCard with social proof/policy pills, sticky bar |
| Property detail & room selection | `.paperclip/design/flows/property-detail-room-selection.md` | v1.0 | Inline room selection, no separate rooms route, decision strip |

---

## Competitive bar (vs Zostel / The Hosteller)

Full analysis: `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md`

Dostel wins on:
- **Social proof** — neither competitor shows reviews/ratings/booking momentum
- **Loyalty program** — neither has tiers/points/badges (Dostellers)
- **Inline availability** — both hide rooms behind interaction
- **Policy transparency** — 3 policy pills always visible (never buried)
- **Session persistence** — triple-redundant (URL + context + localStorage)

---

## Active tickets (new issues)

| Ticket | For | Priority | Status | What |
|--------|-----|----------|--------|------|
| DOS-248 | Design Systems | P0 | In Progress | Finalize design system tokens and visual identity guidelines |
| DOS-249 | Product Designer | P0 | Completed | Produced booking flow and Dostellers journey specs with acceptance criteria and component contracts |
| DOS-250 | UI Engineer | P0 | Todo | Build design token system and component prototypes |

---

## Design Flow Specs

| Flow | File | Version | Key Deliverables |
|------|------|---------|------------------|
| Dostellers Journey | `.paperclip/design/flows/dostellers-journey-refined.md` | v3.1 | TierCard, PointsBar, BadgeGrid, LongStayToggle, SocialProof, PolicyPills, StickyBottomBar |
| Booking Flow | `.paperclip/design/flows/booking-flow-optimized.md` | v5.0 | 7-step flow with session persistence, inline room selection, trust signals |

## Active tickets (new issues)

| Ticket | For | Priority | Status | What |
|--------|-----|----------|--------|------|
| DS-001 | Design Systems | P0 | ✅ Shipped | Token migration: globals.css, layout.tsx fonts, 14 files fixed |
| DS-002 | Product Designer | P0 | ✅ Shipped | Booking UX: BookingProvider, StepIndicator, SearchBar URL sync, Room selection, PolicyPills, PriceBreakdown |
| DS-003 | UI Engineer | P0 | ✅ Shipped | 12 components implemented, 4 checkout routes, detail page refactor |
| DS-004 | Design Systems | P1 | ✅ Shipped | Admin PMS: 5 routes, Sidebar with Lucide icons, MetricCard, StatusBadge, DataTable |
| DS-005 | Product Designer | P1 | ✅ Shipped | Dostellers: 5 routes, 6 components (TierCard, PointsBar, BadgeGrid, MemberHeader, QuickActions, LongStayToggle) |
| DS-010 | UI Engineer | P0 | ✅ Shipped | TierCard component + Dostellers landing page |
| DS-011 | UI Engineer | P0 | ✅ Shipped | Join page + Dashboard components |
| DS-012 | UI Engineer | P1 | ✅ Shipped | MemberLayout + bottom nav integration |
| DS-013 | UI Engineer | P1 | ✅ Shipped | Badges page + unlock toast notification |
| DS-014 | UI Engineer | P1 | ✅ Shipped | LongStayToggle integration in booking flow |
| DS-016 | UI Engineer | P0 | ✅ Shipped | Admin Booking Workspace implementation |
| DS-017 | UI Engineer | P0 | ✅ Shipped | Search & Listing Flow implementation |

All tickets saved to `.paperclip/design/tickets/`.

---

## Known frontend issues (addressed by DS-001 + DS-002/003 + DS-005 + DS-010/011/012/013/014/016/017)

| Issue | Ticket(s) | Fix |
|-------|-----------|-----|
| `@applies` → `@apply` (lines 158-203) | DS-001 | Replace directive |
| `@app--` broken directive (line 100) | DS-001 | Replace with proper `.btn-primary` |
| Undefined CSS vars (`--color-text-primary`) | DS-001 | Replace with Dostel tokens |
| Old brand tokens (`#0f172a`, `#ef4444`) in 14 files | DS-001 | Replace with Forest/Sunset/Stone/Snow palette |
| Geist font instead of Playfair+Inter | DS-001 | Update layout.tsx font imports |
| No checkout/booking routes | DS-002/003 | 4 new route pages + 12 components |
| No state persistence across flow | DS-002/003 | BookingContext with URL + localStorage + React Context |
| Detail page: "View rooms" CTA + "Book now" per room | DS-002/003 | Inline RoomSelector + StickyBottomBar — no extra page load |
| No policy pills — policies at page bottom | DS-002/003 | PolicyPills component: 3 pills below header |
| No sticky bottom bar | DS-002/003 | StickyBottomBar component on detail + checkout pages |
| No social proof anywhere | DS-002/003 | SocialProof component, add `bookedThisWeek` to HostelCard |
| SearchBar uses `?q=` instead of `?destination=&checkIn=&checkOut=&guests=` | DS-002/003 | URL param sync, remove booking type pills |
| HostelCard missing `soldOut`, `bookedThisWeek`, `dostellerPrice`, `variant` | DS-003 | Update HostelCard + HostelCardProps interface |
| Navbar missing auth-aware links | DS-002/003 | Add "My Trips", "Dashboard" when logged in |
| No Dostellers pages | DS-005 | 5 new routes, 6 new components |
| Page background: cool slate `#f8fafc` instead of warm off-white `#fefcf5` | DS-001 | Update `--color-snow` in globals.css |
| No long-stay pricing in booking flow | DS-005 | LongStayToggle on detail page for 7+ nights |
| No Dosteller pricing badge in property grid | DS-003 | Add dostellerPrice badge to HostelCard |
| Property detail missing policy pills and social proof | DS-002/003 | Add PolicyPills + SocialProof to detail page |
| Listing grid missing Dosteller availability signals | DS-017 | Add Dosteller pricing and social proof to HostelCard in grid |
| Booking flow lacks state persistence | DS-002/003 | BookingProvider with URL/context/localStorage triple persistence |
| No admin booking workspace | DS-016 | Operational table with saved views, filters, detail drawer |
| SearchBar not persisting filters | DS-017 | URL param sync + debounced apply for filters |

---

## Mobile-first rules (all flows)

1. Sticky bottom bar (72px) on all booking pages — CTA always thumb-reachable
2. Native `<input type="date">` — no custom date pickers
3. Single column <768px, sidebar layout on desktop
4. All touch targets ≥ 44px (iOS HIG + Android Material)
5. Back navigation preserves all state (localStorage)
6. Edge-to-edge images on mobile (no horizontal padding)
7. Page has 80px bottom padding to prevent sticky bar overlap

---

## Verification checklist (per component/flow)

### Functional
- [ ] Works keyboard-only (Tab, Enter, Escape)
- [ ] State persists across browser refresh
- [ ] Back navigation preserves all data
- [ ] No horizontal scroll at 375px viewport

### Accessibility
- [ ] Text meets WCAG AA contrast (≥4.5:1)
- [ ] Focus indicator visible (2px solid Sky-500)
- [ ] ARIA labels on icon-only controls
- [ ] Error messages linked via `aria-describedby`
- [ ] Screen reader announces dynamic changes (aria-live)

### Visual
- [ ] Only 3 prescribed animations used
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No purple gradients, no generic SaaS aesthetics
- [ ] Mountain/community tone consistent

### Performance
- [ ] Loads < 2s on 3G
- [ ] No layout shift (CLS < 0.1)
- [ ] Animations smooth on low-end devices
- [ ] Loyalty components render without layout shift
- [ ] Points counter updates smoothly with proper animation
- [ ] Tier badge transitions use prescribed motion