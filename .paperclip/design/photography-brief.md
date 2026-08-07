# Dostel Photography Brief v1.0

Owner: design · For: whoever holds a camera at each property (staff phone is fine, and
often better — see "register" below)
Supersedes: all Unsplash stock currently in `apps/frontend/lib/data.ts` and the landing
marquee. Stock is the single biggest gap between this product and the brand it claims.

---

## Why this brief exists

The brand promise is **measured, not claimed**. Rented photography is a claim.
A network that publishes Wi-Fi methods but illustrates itself with someone else's
mountains undercuts its own thesis on every page. These photos are not decoration —
they are evidence, same as the proof card.

## Register

Documentary, not aspirational. The bar: **a photo a guest could have taken on the best
morning of their stay** — not one a marketing team staged.

- Golden hour or honest overcast. Never midday flash, never HDR.
- People mid-activity, unaware or comfortable. No high-fives, no laptop-on-summit.
- Imperfection stays in: steam on the lens, wet floors, a messy common table.
- Colour: natural grade. The interface supplies the coral/yellow; photos should not
  compete (brand-platform.md §7 — prefer frames with a quiet corner so a tag can sit).

## The signature series: photograph the proof

This is the series no competitor can copy, because it requires actually doing the checks:

1. **The speed test** — a phone running the test at the common-room router, timestamp
   visible, chai next to it.
2. **The generator** — whoever maintains it, mid-check, hands in frame.
3. **The walk timer** — the staff member timing the walk to the village / beach / metro,
   phone stopwatch in the foreground, path in focus behind.
4. **The board itself** — the physical noticeboard/chalkboard each property keeps.
5. **The named human** — a portrait of the person the Verified Stay Card names as
   contact. Environmental, at their actual post.

One set per property. These run beside the proof card, so the card's mono timestamps
and these frames corroborate each other.

## Per-property shot list (8 properties × ~10 frames)

Every property shoots the same skeleton so the network greets you consistently:

| # | Frame | Notes |
|---|---|---|
| 1 | Exterior at first light | From the guest's arrival direction, not a drone |
| 2 | The approach | The last 100 m a guest actually walks |
| 3 | Dorm, lived-in | Beds made *by guests*, curtains half-drawn, one locker open |
| 4 | Private room | Morning light, window view included |
| 5 | Common area, mid-use | Real guests (release forms), games/laptops/chai as found |
| 6 | Food | The actual breakfast, the actual cafe counter |
| 7 | The terrain claim | See below — the frame that proves the terrain badge |
| 8–10 | Proof series | From the signature series above |

**Frame 7, per terrain** (this is the one the listing card leads with):

- **Vattakanal** — mist moving through shola forest from the deck, morning
- **Dharamshala** — the range from a window or roofline, dawn
- **Anjuna** — the beach at the hour guests actually walk it (early, empty-ish)
- **Gokarna** — the quiet cove, no crowd, wide
- **Coorg** — coffee rows in rain or mist, worker if willing
- **Jaipur** — the street below the property waking up, vendors setting up
- **Delhi Airport** — honest: the room at 3 a.m., someone arriving, warm light inside vs
  dark outside. Do not pretend it's scenic; its promise is *refuge in transit*
- **Bangalore HSR** — laptops on the deck at golden hour, the work actually happening

## Technical spec (what the components need)

| Surface | Ratio | Min px | File |
|---|---|---|---|
| Property hero panel | 4:3 | 1600×1200 | `hostelImages[slug][0]` |
| Listing card | 16:10 | 1200×750 | `hostels[].image` |
| Landing marquee tile | ~1.54:1 | 640×416 | `stripPhotos` |
| Room cards | 1:1 crop-safe | 800×800 | `/images/*.jpg` (currently 404ing) |

Shoot wider than the crop; every frame should survive a coral tag laid over one corner.

## Hard don'ts

- No stock, ever again, anywhere. A missing photo is more honest than a rented one —
  ship the typographic fact panel (landing marquee already supports this) until the
  real frame exists.
- No beach photos at hill properties (this actually shipped once; it's why this
  document exists).
- No filters that lie about weather, light, or how green things are.
- No faces without a release. First names only in captions, matching the board's
  privacy rule.
