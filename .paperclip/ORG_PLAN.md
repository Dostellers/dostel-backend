# Dostel Company Build Plan (OmniRoute Free Tokens)

Company: **Dostel** (`DOS`) · Workspace: `/root/dostel-backend`  
Model policy: **OmniRoute free auto-routing** — `opencode-omniroute/auto/best-free` (general) · `auto/best-coding` (engineering). OmniRoute picks upstream (DeepSeek, NVIDIA Nemotron, Groq, etc.) from the free pool — no single-model lock-in.

## Brand research (web)

**Dostel / DOSTel Vattakanal** is a long-running backpacker hostel in Vattakanal, Kodaikanal (Tamil Nadu), India.

- Positioning: community hostel, “redefining friendships,” long-stay immersion
- **Dostellers**: long-stay guests who join the community/activities network (not just overnight backpackers)
- Audience: solo backpackers, friend groups, families, corporate groups, remote workers
- Product types on property: deluxe suites, couple rooms, dorms (8/6/4 bed)
- Heritage story: inspired by Bob & Tanya (British backpackers, 1985) — ecological restoration + community
- Channels today: Hostelworld, Airbnb/OTA listings, vattakanal.com stay page, LinkedIn (Dostel Vattakanal)
- Ops reality: mountain access, shared spaces, house rules, local food partners (Altaf’s Cafe), cash/advance booking norms

**What we are building in Paperclip:** a hostel/PMS + guest digital product (frontend booking/community, GraphQL backend, admin) that can scale the Dostel / Dostellers brand beyond a single property.

Sources:
- https://www.vattakanal.com/stay/dostel
- https://www.hostelworld.com/hostels/p/302851/dostel-vattakanal/
- https://www.linkedin.com/company/dostel-vattakanal

## Free-token operating principles

1. All agents use `opencode_local` + OmniRoute **auto** routes (no paid Anthropic/OpenAI direct).
2. Keep the org **lean** — each hire must create issues or ship artifacts, not chatter.
3. Stagger heartbeats (marketing/research 15–30 min; builders 10 min) to avoid token storms.
4. Non-coding agents write into `.paperclip/` docs + Paperclip issues only; coding stays with Builder/CTO/QA.
5. Prefer `coalesce_if_active` routines + small issue slices.
6. OmniRoute handles failover across free upstreams. Manual pin only if debugging: `oc/deepseek-v4-flash-free` or `nvidia/nemotron-3-super-120b-a12b`. Never paid `agy/*` routes.

## Org (target)

```
Board
 └── Dostel CEO
      ├── CMO (marketing + brand + Dostellers growth)
      │    ├── Market Researcher
      │    ├── Content Marketer
      │    └── Community Lead (Dostellers)
      ├── Product Manager (guest + PMS roadmap)
      ├── Head of Design (enterprise UX bar vs Zostel/Hosteller)
      │    ├── Product Designer (UX flows)
      │    └── Design Systems Designer (tokens/components)
      └── CTO
           ├── Builder (full-stack)
           ├── UI Engineer (design-system implementation)
           └── QA (incl. red-team drills)
```

### Existing (keep)
| Role | Agent | Model |
|------|-------|-------|
| CEO | Dostel CEO | free OmniRoute |
| CTO | Dostel CTO | free OmniRoute |
| Engineer | Dostel Builder | free OmniRoute |
| QA | Dostel QA | free OmniRoute |

### New hires (this wave)
| Role | Name | Reports to | Job |
|------|------|------------|-----|
| CMO | Dostel CMO | CEO | Brand, acquisition, Dostellers narrative, campaign briefs |
| Researcher | Dostel Market Researcher | CMO | Hostel/OTA competitors, pricing, SEO keywords, persona research |
| Designer/comms | Dostel Content Marketer | CMO | Site copy, blogs, social drafts, SEO pages (markdown → frontend issues) |
| Community | Dostel Community Lead | CMO | Dostellers program, events, membership, retention loops |
| PM | Dostel Product Manager | CEO | Prioritize guest/PMS features from research + brand |

### Design wave (hired)
| Role | Name | Reports to | Job |
|------|------|------------|-----|
| Head of Design | Dostel Head of Design | CEO | Design vision + competitive bar vs Zostel/Hosteller |
| Product Designer | Dostel Product Designer | Head of Design | Booking/Dostellers/admin UX flows |
| Design Systems | Dostel Design Systems | Head of Design | Tokens, components, motion, states |
| UI Engineer | Dostel UI Engineer | CTO | Implement DS in Next guest + admin |

Competitive note: Zostel wins on brand network + booking apps; Hosteller similarly. Dostel wins by pairing **community hostel soul (Dostellers)** with **enterprise PMS craft** (systemized UI, faster funnel, clearer ops admin).

Deferred (hire later if free capacity allows): Growth/SEO specialist, Customer Support, Finance, dedicated Red-team specialist (QA covers for now), motion specialist.

## First 2-week mission (all free)

1. **Research pack** — Market Researcher: competitor hostels + OTA listing gaps → issues for PM/CMO
2. **Dostellers definition** — Community Lead: membership tiers, events calendar, long-stay value prop
3. **Brand/content** — CMO + Content: homepage/membership/workations copy briefs aligned to Vattakanal story
4. **Product cuts** — PM: turn brand needs into Builder tickets (booking, rooms, membership, admin)
5. **Ship** — Builder/QA: continue PMS monorepo; marketing never blocks engineering without an issue

## Success metrics
- Hires approved and heartbeats green on free model
- Research + Dostellers docs in `.paperclip/`
- Marketing issues feeding Builder backlog weekly (Friday board update routine)
- No paid model spend
