# DOS-80: Dostellers landing page (`/dostellers`)

**Priority:** P1 · **Area:** `apps/frontend`  
**Assignee:** UI Engineer  
**Source:** `design/flows/dostellers-journey.md` Step 1, `marketing/membership-dostellers-copy.md`  
**Depends on:** Nothing (static page, no backend data)

---

## Why

Current `/membership` is a generic 3-tier discount club page (Explorer/Nomad/Wanderer at ₹999/₹1,999/₹4,999) that feels like a SaaS pricing table. The CMO/marketing copy repositions Dostellers as community access. This page is the first touchpoint for building the Dostellers brand.

## What

### 1. Create `apps/frontend/app/dostellers/page.tsx`

A static marketing landing page with:

**Hero:**
- Badge: "Dostellers — The Dostel Community"
- H1: "Become a Dosteller"
- Subtitle from `marketing/membership-dostellers-copy.md`:
  > "More than a membership. A community of travelers, remote workers, and mountain-lovers who call Vattakanal a home base."

**"What is Dostellers?" explain block** (new section before pricing):
- Heading: "Long-stay community, short-stay benefits"
- Story paragraph: "Dostellers started as the name we gave to guests who kept coming back..."
- 3-column value props: Community | Savings | Access

**Tier cards (3):**
Use existing pricing (Explorer ₹999/mo, Nomad ₹1,999/mo, Wanderer ₹4,999/mo) but repositioned with community-first copy:
- Explorer: "For the weekend crew" — 5% off, priority check-in, WhatsApp group
- Nomad: "For the regulars" — 10% off, free breakfast, late checkout
- Wanderer: "For the family" — 15% off, all meals, 2 free nights/mo

**Stats section:**
| Stat | Value |
|------|-------|
| 40+ yrs | Hostelling in Vattakanal |
| 3,000+ | Dostellers and counting |
| 12+ | Countries our members come from |

**"How it works" — 3 steps:**
1. Pick your tier
2. Sign up (2 min, no hidden fees)
3. Start staying

**FAQ accordion** (6 questions from copy doc, keyboard accessible)

**CTA section:**
- H2: "Join the community"
- Primary: "Become a Dosteller" → `/dostellers/join`
- Secondary: "See what's included" → scroll to tiers

### 2. Redirect `/membership` → `/dostellers`

Add redirect in `apps/frontend/app/membership/page.tsx` or a Next.js middleware rule.

### 3. Navbar update

In `Navbar.tsx`: rename "Membership" link to "Dostellers" pointing to `/dostellers`.

### 4. Design tokens

Use existing Dostel design tokens from `DESIGN_SYSTEM.md`:
- Forest greens (`--color-forest-500`, `--color-forest-900`)
- Sunset accent (`--color-sunset`)
- Stone neutrals for text/backgrounds
- Inter font family

## Acceptance criteria

- [ ] `/dostellers` renders full landing page with hero, explain block, tiers, stats, steps, FAQ, CTA
- [ ] `/membership` redirects to `/dostellers`
- [ ] Navbar link shows "Dostellers" instead of "Membership"
- [ ] Tier cards are styled as community-rooted cards (not SaaS pricing table)
- [ ] FAQ accordion keyboard-navigable (Tab + Enter/Space)
- [ ] Mobile-first: single column < 768px, 3-column tiers on desktop
- [ ] All CTAs have touch targets >= 44px
- [ ] Text matches copy from `marketing/membership-dostellers-copy.md` (voice: warm, community-first)
- [ ] No "subscribe" or "plan" language — use "join" and "tier"
