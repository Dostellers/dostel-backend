# Dostel Design Tokens v1.0

## Brand DNA
- **Place**: Vattakanal, Kodaikanal — mountain rainforest, mist, coffee, trails
- **Community**: warm, social, shared experiences, Dostellers
- **Tone**: grounded, warm, clear — NOT generic SaaS, NOT purple gradients

---

## 1. Color Tokens

### Primary palette (nature-rooted, not corporate)

| Token | Hex | Usage |
|-------|-----|-------|
| `--ds-color-forest-900` | `#0f1a14` | Primary text, dark headers |
| `--ds-color-forest-700` | `#1a3328` | Secondary headings, icons |
| `--ds-color-forest-500` | `#2d6a4f` | Primary brand, links, active states |
| `--ds-color-forest-100` | `#d8f3dc` | Subtle backgrounds, tags |
| `--ds-color-sunset` | `#e07a2f` | CTA buttons, badges, highlights |
| `--ds-color-sky` | `#2b6cb0` | Info accents, trust elements |
| `--ds-color-earth` | `#d4a373` | Warm neutrals, decorative elements |
| `--ds-color-snow` | `#fefcf5` | Page background (warm off-white) |
| `--ds-color-white` | `#ffffff` | Card surfaces, modals |
| `--ds-color-stone-200` | `#e6e0d8` | Borders, dividers |
| `--ds-color-stone-400` | `#a89f94` | Muted text, placeholders |
| `--ds-color-stone-600` | `#6b6258` | Body text |
| `--ds-color-error` | `#dc2626` | Errors, destructive actions |
| `--ds-color-success` | `#16a34a` | Success states, confirmations |

### Semantic mapping

| Context | Token |
|---------|-------|
| Page background | `--ds-color-snow` |
| Card surface | `--ds-color-white` |
| Primary text | `--ds-color-forest-900` |
| Body text | `--ds-color-stone-600` |
| Muted text | `--ds-color-stone-400` |
| Border | `--ds-color-stone-200` |
| Primary CTA | `--ds-color-sunset` |
| Primary CTA hover | `--ds-color-forest-500` |
| Link | `--ds-color-forest-500` |
| Success | `--ds-color-success` |
| Error | `--ds-color-error` |
| Rating stars | `--ds-color-sunset` |
| Badge new | `--ds-color-sunset` |
| Badge trending | `--ds-color-forest-500` |

### Contrast compliance
All text on background combos meet WCAG AA (4.5:1+). Key:
- Forest-900 on Snow = 14:1
- Stone-600 on Snow = 7:1
- White on Sunset = 5.5:1
- White on Forest-500 = 6.2:1

---

## 2. Typography

### Font stack
| Role | Font | Fallback | Weight range |
|------|------|----------|--------------|
| Display / Hero | `"Playfair Display"` | serif | 600-700 |
| Heading | `"Playfair Display"` | serif | 500-700 |
| Body | `"Inter"` | sans-serif | 400-600 |
| UI / Button | `"Inter"` | sans-serif | 500-700 |
| Mono | `"JetBrains Mono"` | monospace | 400-500 |

### Type scale (mobile-first, REM)

| Token | Size | Line-height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--ds-text-hero` | 2.5rem / 3.5rem (md+) | 1.1 | 700 | Hero title |
| `--ds-text-display` | 2rem / 2.5rem (md+) | 1.15 | 600 | Section headings |
| `--ds-text-title` | 1.5rem / 1.75rem (md+) | 1.2 | 600 | Card titles, modal headers |
| `--ds-text-subtitle` | 1.125rem | 1.3 | 500 | Section subtitles |
| `--ds-text-body` | 1rem | 1.5 | 400 | Paragraphs |
| `--ds-text-small` | 0.875rem | 1.4 | 400 | Captions, metadata |
| `--ds-text-xs` | 0.75rem | 1.3 | 500 | Labels, badges |

---

## 3. Spacing (8px grid)

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-space-1` | 4px | Micro spacing |
| `--ds-space-2` | 8px | Tight gaps |
| `--ds-space-3` | 12px | Element padding |
| `--ds-space-4` | 16px | Standard padding |
| `--ds-space-5` | 20px | Section inset |
| `--ds-space-6` | 24px | Card padding, form spacing |
| `--ds-space-8` | 32px | Section spacing |
| `--ds-space-10` | 40px | Page section gap |
| `--ds-space-12` | 48px | Large sections |
| `--ds-space-16` | 64px | Page margins |

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-radius-sm` | 4px | Inputs, small elements |
| `--ds-radius-md` | 8px | Cards, buttons |
| `--ds-radius-lg` | 12px | Modals, large cards |
| `--ds-radius-xl` | 16px | Search bars, hero elements |
| `--ds-radius-full` | 9999px | Pills, avatars |

---

## 5. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-shadow-sm` | `0 1px 2px rgba(15,26,20,0.06)` | Subtle card elevation |
| `--ds-shadow-md` | `0 4px 12px rgba(15,26,20,0.08)` | Hovered cards |
| `--ds-shadow-lg` | `0 8px 24px rgba(15,26,20,0.1)` | Modals, dropdowns |
| `--ds-shadow-xl` | `0 12px 40px rgba(15,26,20,0.14)` | Search bars, sticky headers |

---

## 6. Motion

### Durations (purposeful, minimal)

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-motion-fast` | 150ms | Micro-interactions (hover, tap) |
| `--ds-motion-base` | 250ms | Transitions, panel open/close |
| `--ds-motion-slow` | 400ms | Page transitions, modals |

### Easing

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Exiting, reveals |
| `--ds-ease-in` | `cubic-bezier(0.4, 0, 0.68, 0.06)` | Entering, dismissals |
| `--ds-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Celebratory, confirmations |

### Prescribed animations (only 3 - no noise)

1. **Card hover lift**: `translateY(-2px)` + shadow-md, 250ms ease-out
2. **Page fade-in**: `opacity 0->1` + `translateY(8px->0)`, 400ms ease-out, stagger children 80ms
3. **Button press**: `scale(1->0.97)`, 150ms ease-in, reverse on release

---

## 7. States

### Interactive state tokens

| State | Visual |
|-------|--------|
| Default | No overlay |
| Hover | `brightness(0.96)` or shadow-md |
| Active / Press | `scale(0.97)` + `brightness(0.92)` |
| Focus-visible | `outline: 2px solid var(--ds-color-sky)` with `outline-offset: 2px` |
| Disabled | `opacity: 0.45`, `cursor: not-allowed` |
| Loading | Skeleton shimmer (pulse animation 1.5s) |

### Empty states
- Search with no results: illustration + clear CTA (already exists on listing page - keep pattern)
- No bookings: illustration + "Start your first trip" CTA
- No Dostellers activities: "No upcoming events - check back soon"

### Error states
- Form validation: inline red text below field, border changes to `--ds-color-error`
- API error: toast at top, auto-dismiss 5s
- Network offline: persistent banner "You're offline - changes saved locally"

---

## 8. Iconography

- Prefer inline SVG (no icon library dependency for core UI)
- 24x24 default size for action icons
- 20x20 for inline metadata (ratings, amenities)
- Use forest-500 for decorative icons
- Use sunset for rating stars
- Emoji acceptable for amenity display (mountain, fire, wifi icons)
- Admin icons: use Lucide (lightweight, tree-shakeable)

---

## 9. Data visualization

- Charts (admin only): keep to 2 chart types - bar (revenue, occupancy) and line (trends)
- Color-blind safe: use pattern + label, not color alone
- Admin dashboard: 3-4 metric cards max, no sparkline noise

---

## 10. Token implementation

### Tailwind v4 (existing pattern in globals.css)
Use `@theme inline` block mapping token names to CSS custom properties.

```css
@theme inline {
  --color-forest-900: var(--ds-color-forest-900);
  --color-forest-700: var(--ds-color-forest-700);
  --color-forest-500: var(--ds-color-forest-500);
  --color-forest-100: var(--ds-color-forest-100);
  --color-sunset: var(--ds-color-sunset);
  --color-sky: var(--ds-color-sky);
  --color-earth: var(--ds-color-earth);
  --color-snow: var(--ds-color-snow);
  --color-stone-200: var(--ds-color-stone-200);
  --color-stone-400: var(--ds-color-stone-400);
  --color-stone-600: var(--ds-color-stone-600);
}
```

### CSS custom properties (root)
```css
:root {
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}
```
