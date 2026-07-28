# DS-001: Token Migration — Replace old brand tokens with Dostel design tokens

**Assignee**: Design Systems Designer  
**Priority**: P0 (blocks all frontend work)  
**Estimate**: 1 heartbeat  
**Ties to**: Competitive gap analysis (policy pills, CTA bars, room cards all depend on correct tokens)

---

## Problem

The frontend (`apps/frontend/app/globals.css`) uses old brand tokens that do not match
the Dostel design system specification:

```css
/* CURRENT (wrong — generic SaaS): */
--color-brand-primary: #0f172a;
--color-brand-secondary: #ef4444;
--color-brand-accent: #f59e0b;
--color-brand-lime: #10b981;
--color-brand-teal: #0369a1;
```

These must be replaced with the Dostel palette from
`.paperclip/design/system/design-tokens.md`.

Additionally, `@applies` is used instead of `@apply` (Tailwind v4 directive) — broken CSS
on lines 158-204 of `globals.css`. A broken `@app--` directive exists on line 100.

## Required changes

### 1. Fix `globals.css` token block

Replace the `@theme inline` block with Dostel tokens:

```css
@theme inline {
  --color-forest-900: #0f1a14;
  --color-forest-700: #1a3328;
  --color-forest-500: #2d6a4f;
  --color-forest-100: #d8f3dc;
  --color-sunset: #e07a2f;
  --color-sky: #2b6cb0;
  --color-earth: #d4a373;
  --color-snow: #fefcf5;
  --color-white: #ffffff;
  --color-stone-200: #e6e0d8;
  --color-stone-400: #a89f94;
  --color-stone-600: #6b6258;
  --color-error: #dc2626;
  --color-success: #16a34a;
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
  --animate-marquee: marquee 28s linear infinite;
  --animate-marquee-slow: marquee 50s linear infinite;
}
```

### 2. Layout font setup

In `apps/frontend/app/layout.tsx`:
- Replace `Geist` import + variable with `Playfair Display` + `Inter`
- Set `--font-heading` and `--font-body` CSS vars

```tsx
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})
```

### 3. Fix broken Tailwind directives

- Line 100: `@app--` → proper `@apply` rule for `.btn-primary`
- Lines 158-204: Replace all `@applies` with `@apply`

### 4. Card + button utility classes

Replace old brand token references in utility classes:

| Old | New |
|---|---|
| `bg-brand-primary` | `bg-forest-500` |
| `text-brand-primary` | `text-forest-900` |
| `border-brand-primary` | `border-forest-500` |
| `bg-brand-secondary` | `bg-sunset` |
| `text-brand-secondary` | `text-sunset` |
| `bg-brand-accent` | `bg-sunset` |
| `text-brand-accent` | `text-sunset` |
| `bg-brand-lime` | `bg-success` |
| `bg-brand-muted` | `bg-stone-400` |
| `--color-border` | `--color-stone-200` |
| `--color-background` | `--color-snow` |
| `--color-foreground` | `--color-forest-900` |

### 5. Fix HostelCard.tsx

Replace any references to `--color-surface`, `--color-text-primary`, `--color-text-secondary`
with actual token mappings (Forest-900, Stone-600, Snow).

### 6. Update metadata title

`layout.tsx` line 14: Change from "Find Your Perfect Hostel" to
"Find Your Hostel in the Mountains — Dostel" (mountain positioning).

---

## Verification

- [ ] Page background is warm off-white (`--color-snow`), not cool slate
- [ ] Headings render in Playfair Display serif, body in Inter
- [ ] Primary CTA buttons use Sunset (`#e07a2f`), not red (`#ef4444`)
- [ ] All `@applies` replaced with `@apply` — no browser console CSS errors
- [ ] Focus rings visible (sky blue `#2b6cb0`) on all interactive elements
- [ ] No reference to old `--color-brand-*` tokens anywhere in the codebase
- [ ] Font swap does not cause layout shift (`font-display: swap` handled by next/font)

## Follow-up issues

- DS-003: Component library scaffold (depends on correct tokens)
- DS-006: Booking component implementation (depends on tokens)
