# Dostel Brand Platform v2.0

> Supersedes the Forest/Sunset system in `design-tokens.md` v1.0 and `visual-identity.md`.
> Colours are derived from the logo at `apps/frontend/public/logo.png`.

---

## 1. The name is the brand

**दोस्त · دوست · dost — friend.**

Dostel = *dost* + *hostel*. The hostel where you arrive a stranger.

The v1.0 system never mentioned this. It described the brand as "mountain-grounded"
and built a forest-green palette around Vattakanal's geography. But the place is the
inventory, not the brand — we will operate in other valleys eventually, and "misty
mountain hostel" is a description every competitor can also use.

The name is the one thing no competitor can take. Everything below is downstream of it.

**Brand line:** *Every hostel sells you a bed. Dostel introduces you to the room.*

---

## 2. Counter-positioning

| | Zostel | The Hosteller | **Dostel** |
|---|---|---|---|
| Brand colours | (JS-rendered, unverified) | `#FFE700` yellow on `#121212` — **verified from markup, Aug 2026** | **Coral-led**, yellow as accent only |
| Loyalty mechanic | `$Zo` currency, quests, wallet | Flat-rate perks | Being *known*, not being *scored* |
| Trust model | Brand scale | Amenity lists | **Timestamped proof** |
| Community | Pre-packaged Zo Trips | Themed events | Who is actually in the room this week |

**Zostel's move is gamification** — a casino layer standing in for belonging. Points,
quests, a wallet. It scales, and it is beatable, because currency is not friendship.

**The Hosteller owns yellow + black in this market.** This is the single hardest
constraint on our palette, and it is why the rule in §4 is non-negotiable.

**Our counter-position is the anti-casino:** you are not a balance. You are a person the
staff remember. That is DOS-500's guest graph stated as a brand promise rather than a
schema — *"the whole Dostellers promise is being known, and we have no system that knows
anything."* This platform is where that promise becomes visible.

---

## 3. Design concept — "The Noticeboard"

Every hostel booking site on earth ships the same clean card grid. Real hostels do not
look like that. They have a native design language nobody has ever put on a screen:

| Artifact | Digital role | Where it ships |
|---|---|---|
| **The Stamp** | Proof you were somewhere, or that something was checked | Logo, Verified Hill-Stay Card, Dosteller badges |
| **The Tag** | A label tied to a thing — price, room, status | Price tags, room labels, status pills |
| **The Board** | What's happening, who's around, pinned by hand | "Who's here", events, community surfaces |
| **The Guestbook** | Handwriting from people who came before | Reviews, social proof, stay memories |

This is not skeuomorphism. No cork textures, no drop-shadowed paper, no torn edges.
We take the **structural logic** of these objects — layering, slight rotation, pinning,
stamping, tying — and execute it with flat, modern, high-craft precision.

The logo already is this: a **stamp** crossed by a **tag**. The identity was in the
artwork before the system existed.

**Why this wins awards and sells beds at the same time:** it is the only visual system
in the category that is native to backpacking rather than borrowed from hotel booking,
and every artifact maps to a real product surface we already have in the backlog.

---

## 4. Colour

Extracted from `logo.png` (447×447, 199,809 opaque px):

| Seed | Hex | Share | Role |
|---|---|---|---|
| Coral | `#F54E4E` | 3.32% | The seal. Primary brand. |
| Yellow | `#FCCC00` | 4.80% | The tag. Accent only. |
| Ink | `#000000` | 1.46% | Everything you read. |
| Paper | `#FCFCFC` | 44.92% | Ground. |

### The two rules that matter

**Rule 1 — Coral leads, always.** Yellow never becomes the dominant surface colour, never
the page background, never the primary CTA. The Hosteller owns yellow-on-black; a
yellow-led Dostel is a Hosteller clone. Yellow appears as tags, highlights, and marks —
high-attention, low-area. Target ratio on any screen: **coral ≥ 3× yellow by area.**

**Rule 2 — Logo colours are graphic colours, not text colours.** Measured on paper:

- `#F54E4E` coral → **3.40:1** — legal for fills, borders, large display type. **Fails body text.**
- `#FCCC00` yellow → **~1.7:1** — fill only, ink on top, never text.

So the ramps below keep the logo hues and derive text-safe steps. Ships as-is in the
mark; darkens for interface text. Every pair in §4.2 is verified, none fails.

### 4.1 Ramps

Generated in OKLCH for perceptually even steps, chroma eased at both ends so tints don't
go muddy and shades don't clip sRGB.

**Coral** — brand, primary action, links
```
 50 #FFDBD3    400 #FF615E    800 #860A16
100 #FFCBC2    500 #F14A4A    900 #60050D
200 #FFB1A8    600 #D42A32    950 #3A0205
300 #FF8D85    700 #AD1120
```

**Yellow** — the tag. Steps 50–500 are fills only (ink on top). 700+ are text-safe.
```
 50 #FFF7B5    400 #EFCD65    800 #835900
100 #FFF0A7    500 #E7C34F    900 #634200
200 #FFE391    600 #CC9D00    950 #3C2700
300 #F6D678    700 #A57700
```

**Ink** — neutrals carry a trace of the coral hue (C≈0.006) so greys feel related to the
brand rather than dead. `ink-1000` is `#0B0B0C`, never pure `#000`.
```
  0 #FFFFFF    300 #D1CCCB    700 #555050
 50 #FEF8F8    400 #AEA9A9    800 #383434
100 #F5F0EF    500 #908B8A    900 #1F1B1B
200 #E6E0E0    600 #726D6D   1000 #0B0B0C
```

**Paper** `#FFFDF9` — warm ground. Not clinical white, not the v1.0 cream.

### 4.2 Verified pairs (WCAG 2.1)

| Use | Foreground | Background | Ratio | Need |
|---|---|---|---|---|
| Display / heading | `ink-1000` | paper | **19.36:1** | 4.5 |
| Body text | `ink-900` | paper | **16.79:1** | 4.5 |
| Muted text | `ink-600` | paper | **5.01:1** | 4.5 |
| Link / brand text | `coral-700` | paper | **7.18:1** | 4.5 |
| Primary CTA | white | `coral-600` | **5.03:1** | 4.5 |
| Accent CTA | `ink-1000` | `yellow-400` | **12.73:1** | 4.5 |
| Coral tint chip | `coral-800` | `coral-50` | **7.89:1** | 4.5 |
| Yellow tint chip | `ink-900` | `yellow-100` | **14.85:1** | 4.5 |
| Focus ring | `coral-600` | paper | **4.95:1** | 3.0 |
| Logo coral as UI | `#F54E4E` | paper | **3.40:1** | 3.0 |

Regenerate with `.paperclip/design/system/palette.py`.

---

## 5. Typography

**Display — Bricolage Grotesque.** Variable, with optical-size and width axes. It has
deliberate irregularity: it reads as printed rather than rendered, which is exactly the
noticeboard/zine register. Chosen against Playfair Display, which v1.0 used and which is
among the most templated display serifs on the web — it signals "authentic travel brand"
so strongly it signals nothing.

**Body — Inter.** Retained deliberately. It is already loaded, it is the most legible UI
face at small sizes on low-end Android, and swapping it is high churn for no brand gain.
The rebrand is carried by the display face and the colour system, where it is visible.

**Data — JetBrains Mono.** Reserved for *proof*: timestamps, speeds, measurements,
booking references. Monospace makes the Verified Hill-Stay Card read as an instrument
reading rather than marketing copy. This is a semantic assignment, not decoration.

**Devanagari — Noto Sans Devanagari.** The brand is bilingual at its root. दोस्त should
be settable anywhere in the product, not trapped inside a logo bitmap.

```
Display   Bricolage Grotesque   600/700/800   -0.02em   1.05
Heading   Bricolage Grotesque   600           -0.01em   1.15
Body      Inter                 400/500       0         1.6
UI label  Inter                 500/600       0.01em    1.4
Data      JetBrains Mono        400/500       0         1.5
```

---

## 6. Motion

v1.0's "3 animations only" rule was right and is kept, extended by one gesture native to
the concept:

1. **Card lift** — `translateY(-2px)`, interactivity
2. **Page fade** — `opacity 0→1`, continuity
3. **Press** — `scale(0.97)`, tactile feedback
4. **Pin** — a ≤1.5° settle on cards entering a board surface. Once, on entry, never on hover.

All respect `prefers-reduced-motion`. Rotation caps at 1.5°: past that it reads as a
gimmick and it breaks text rendering on low-DPI screens.

---

## 7. Imagery

Carried forward from v1.0 — it was the strongest part of the old system:
documentary candids over staged stock, golden hour, experiences over amenities, real
travellers. Added: photography must survive a coral or yellow tag laid over it, so
prefer frames with a quiet corner.

---

## 8. Voice

Plain, warm, specific, and never overclaiming. The product promise is proof, so the copy
cannot inflate — a brand that says "verified" has to mean it.

- **Say:** "Wi-Fi measured 48 Mbps at the common room, 14:20 today."
- **Not:** "Blazing-fast connectivity!"
- **Say:** "Ravi will meet you at the junction."
- **Not:** "Seamless arrival experience."

---

## 9. Never

- Yellow as the dominant surface — that is The Hosteller
- Points-as-currency, wallets, quest mechanics — that is Zostel
- Purple gradients, glassmorphism, dashboard-in-hero
- Cork textures, torn paper, fake tape — the concept is structural, not textural
- Emoji as UI icons
- Claiming verification we cannot timestamp
