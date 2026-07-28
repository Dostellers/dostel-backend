# Dostel Design System — Enterprise Guide

Brand: **Dostel** — community hostel (Vattakanal/Kodaikanal)  
Design org: `.paperclip/TEAM.md` · Competition: `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md`

---

## Surfaces

| Surface | Stack | Location | Status |
|---------|-------|----------|--------|
| Guest frontend | Next.js 16 + React 19 + Tailwind v4 | `apps/frontend/` | Complete — booking flow (7 steps), Dostellers flow (5 routes), search, detail, checkout |
| Admin PMS | Next.js 16 + React 19 + Tailwind v4 + Lucide icons | `apps/admin/` | Scaffolded — dashboard, bookings table, hostels cards, guests page, sidebar nav, AuthGate |

---

## Design principles

1. **Mountain-grounded** — forest greens (`#2d6a4f`), sunset amber (`#e07a2f`), warm earth — not generic SaaS purple
2. **Community soul** — Playfair Display (headings) + Inter (body), warm off-white backgrounds (`#fefcf5`), social proof as trust signal
3. **Mobile-first, thumb-friendly** — sticky bottom bars (72px), 44px touch targets, single-column <768px, native inputs
4. **Accessible by default** — WCAG AA verified per token, focus rings (sky `#2b6cb0`), semantic forms, `prefers-reduced-motion`
5. **3 animations only** — card lift (`translateY(-2px)`), page fade-in (`opacity 0→1`), button press (`scale(0.97)`) — no motion noise
6. **Warm not trendy** — no purple gradients, no dashboard-in-hero, no cream+terracotta brochure defaults

---

## Design tokens

All tokens spec: `.paperclip/design/system/design-tokens.md`

| Token family | Covered |
|---|---|
| Color (14 tokens) | Forest-900→100, Sunset, Sky, Earth, Snow, Stone scale, Error, Success |
| Typography | Playfair Display (headings) + Inter (body) + JetBrains Mono (code) |
| Spacing | 8px grid (4–64px) |
| Border radius | 4px–9999px |
| Shadows | 4 levels, Forest-900 rgba |
| Motion | 3 durations, 3 easings, 3 prescribed animations |
| States | hover/active/focus/disabled/loading/empty/error |
| Admin extensions | separate density track (DS-004) |

---

## Flow specs

| Flow | File | Version | Key deliverables |
|---|---|---|---|---|
| Guest booking (7-step) | `.paperclip/design/flows/booking-flow.md` | v3.0 (refined Jul 28) | Search→Listing→Detail+Rooms→Guest Details→Review→Payment→Confirmation; 19 files to create/update; implementation order table |
| Dostellers journey (5-step) | `.paperclip/design/flows/dostellers-journey.md` | v2.0 (refined Jul 28) | Discover→Join→Dashboard→Long-stay Book→Badges; 11 files to create/update; API contracts |

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

## Active tickets — all shipped Jul 28

| Ticket | For | Priority | Status | What |
|--------|-----|----------|--------|------|
| DS-001 | Design Systems | P0 | ✅ Shipped | Token migration completed: globals.css, layout.tsx fonts, 14 files fixed, @applies/@app-- fixes |
| DS-002 | Product Designer | P0 | ✅ Shipped | Booking UX: BookingProvider, StepIndicator, SearchBar URL sync, Room selection, PolicyPills, PriceBreakdown |
| DS-003 | UI Engineer | P0 | ✅ Shipped | 12 components implemented, 4 checkout routes, detail page refactor, all type-safe |
| DS-004 | Design Systems | P1 | ✅ Shipped | Admin PMS: 5 routes (Dashboard, Bookings, Hostels, Guests, Badges), Sidebar with Lucide icons, MetricCard, StatusBadge, DataTable |
| DS-005 | Product Designer | P1 | ✅ Shipped | Dostellers: 5 routes (landing, join, dashboard, bookings, badges), 6 components (TierCard, PointsBar, BadgeGrid, MemberHeader, QuickActions, LongStayToggle) |

All tickets saved to `.paperclip/design/tickets/`.

---

## Known frontend issues (full audit — addressed by DS-001 + DS-002/003 + DS-005)

| Issue | Ticket(s) | Fix |
|-------|-----------|-----|
| `@applies` → `@apply` (lines 158-203) | DS-001 | Replace directive |
| `@app--` broken directive (line 100) | DS-001 | Replace with proper `.btn-primary` |
| Undefined CSS vars (`--color-text-primary`) | DS-001 | Replace with Dostel tokens |
| Old brand tokens (`#0f172a`, `#ef4444`) in 14 files | DS-001 | Replace with Forest/Sunset/Stone/Snow palette |
| Geist font instead of Playfair+Inter | DS-001 | Update layout.tsx font imports |
| No checkout/booking routes | DS-002/003 | 4 new route pages + 12 components (BookingProvider, StepIndicator, StickyBottomBar, GuestDetailsForm, PriceBreakdown, PaymentMethodSelector, ConfirmationCard, RoomSelector, PolicyPills, SocialProof, LongStayToggle, BookingSummary) |
| No state persistence across flow | DS-002/003 | BookingContext with URL + localStorage + React Context |
| Detail page: "View rooms" CTA + "Book now" per room | DS-002/003 | Replace with inline RoomSelector + StickyBottomBar — no extra page load |
| No policy pills — policies at page bottom | DS-002/003 | PolicyPills component: 3 pills below header |
| No sticky bottom bar | DS-002/003 | StickyBottomBar component on detail + checkout pages |
| No social proof anywhere | DS-002/003 | SocialProof component, add `bookedThisWeek` to HostelCard |
| SearchBar uses `?q=` instead of `?destination=&checkIn=&checkOut=&guests=` | DS-002/003 | URL param sync, remove booking type pills |
| HostelCard missing `soldOut`, `bookedThisWeek`, `dostellerPrice`, `variant` | DS-003 | Update HostelCard + HostelCardProps interface |
| Navbar missing auth-aware links | DS-002/003 | Add "My Trips", "Dashboard" when logged in |
| No Dostellers pages | DS-005 | 5 new routes, 6 new components (TierCard, PointsBar, BadgeGrid, MemberHeader, QuickActions, LongStayToggle) |
| Page background: cool slate `#f8fafc` instead of warm off-white `#fefcf5` | DS-001 | Update `--color-snow` in globals.css |
| No long-stay pricing in booking flow | DS-005 | LongStayToggle on detail page for 7+ nights |

---

## Mobile-first rules (all flows)

1. Sticky bottom bar (72px) on all booking pages — CTA always thumb-reachable
2. Native `<input type="date">` — no custom date pickers
3. Single column <768px, sidebar layout on desktop
4. All touch targets ≥ 44px (iOS HIG + Android Material)
5. Back navigation preserves all state (localStorage)
6. Edge-to-edge images on mobile (no horizontal padding)
7. Page has 80px bottom padding to prevent sticky bar overlap
