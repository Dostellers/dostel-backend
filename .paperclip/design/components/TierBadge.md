# TierBadge Component Contract

## Purpose
Display Dosteller membership tier with visual progression and points balance. Powers the Dostellers loyalty program, a key competitive differentiator vs. Zostel and The Hosteller who have no loyalty system.

## TypeScript

```typescript
type Tier = 'bronze' | 'silver' | 'gold' | null;

interface TierBadgeProps {
  tier: Tier;
  points?: number; // Current points balance
  maxPoints?: number; // Points needed for next tier (null for gold tier)
  size?: 'sm' | 'md' | 'lg'; // Default: 'md'
  className?: string;
  onClick?: () => void; // Optional: link to Dostellers dashboard
}
```

## States & Visual Treatment

| State | Border | Background | Text |
|-------|--------|------------|------|
| **Default (null)** | `1px solid var(--ds-color-stone-200)` | `transparent` | `--ds-color-stone-600` |
| **Bronze** | `2px solid var(--ds-color-bronze)` | `var(--ds-color-bronze)/10` | `--ds-color-bronze` |
| **Silver** | `2px solid var(--ds-color-silver)` | `var(--ds-color-silver)/10` | `--ds-color-silver` |
| **Gold** | `2px solid var(--ds-color-gold)` | `var(--ds-color-gold)/10` | `--ds-color-gold` |

**Hover**: Scale `1.02`, Shadow `--ds-shadow-sm`  
**Pressed**: Scale `0.98`

## Layout Rules

- Minimum size: 32x32px (sm), 40x40px (md), 48x48px (lg)
- Always square aspect ratio
- Text centered vertically and horizontally
- Points display: `"{points}pts"` below tier name when provided (uses `--ds-text-xs`)

## Accessibility

- Role: `img` with dynamic aria-label:
  - `null`: `"No Dosteller tier"`
  - `bronze`: `"Bronze Dosteller tier"`
  - `silver`: `"Silver Dosteller tier"`
  - `gold`: `"Gold Dosteller tier"`
- When points provided: append `", {points} Dosteller points"`
- Focus ring: `2px solid var(--ds-color-sky)` with `2px` offset
- Keyboard: Space/Enter to activate (when onClick provided)
- Touch target: minimum 44x44px (achieved via size and padding)

## Motion

- Hover: Scale animation (1.0 -> 1.02, 150ms ease-out)
- Tier change: Pulse scale (1.0 -> 1.1 -> 1.0, 300ms ease-in-out)
- Points update: Gentle pulse (1.0 -> 1.03 -> 1.0, 200ms ease-in-out)
- All animations respect `prefers-reduced-motion`

## Tokens Used

| Token | Usage |
|-------|-------|
| `--ds-color-bronze` | Bronze tier |
| `--ds-color-silver` | Silver tier |
| `--ds-color-gold` | Gold tier (use `--ds-color-sunset` or custom) |
| `--ds-color-points` | Points progress bar (if used elsewhere) |
| `--ds-space-2` | Internal padding |
| `--ds-radius-md` | Corner radius |
| `--ds-shadow-sm` | Hover shadow |
| `--ds-motion-fast` | Hover duration |
| `--ds-color-sky` | Focus ring |
| `--ds-text-xs` | Points text size |

## Implementation Notes

1. **Token Requirement**: Add loyalty colors to `design-tokens.md`:
   - `--ds-color-bronze`: `#cd7f32`
   - `--ds-color-silver`: `#c0c0c0`
   - `--ds-color-gold`: `#d4a373` (earth tone) or create custom gold
   - Consider `--ds-color-points`: `#2563eb` for progress bars

2. **Placement**:
   - User avatar dropdowns

2. **Usage Examples**:
   - Header avatar dropdown: `<TierBadge tier={user.tier} points={user.points} onClick={openDashboard} />`
   - Review author: `<TierBadge tier={review.tier} size="sm" />`
   - Dostellers dashboard: Large badge with points breakdown

3. **Responsive Behavior**:
   - Mobile: Use `sm` or `md` size in headers
   - Desktop: Can use `lg` size in dashboard

## Acceptance Criteria

- [ ] Contract spec written with TypeScript interface
- [ ] Loyalty tokens added to design-tokens.md
- [ ] Visual treatment matches specs (colors, sizing, spacing)
- [ ] All states (default/bronze/silver/gold) implemented
- [ ] Accessibility: WCAG AA contrast, focus ring, ARIA labels
- [ ] Motion: hover scale, tier change pulse, points update pulse
- [ ] Respects `prefers-reduced-motion`
- [ ] Touch targets ≥ 44px
- [ ] Component name: `TierBadge.tsx` in `apps/frontend/components/`

## Linked Follow-ups

- DOS-010: SocialProof component contract (Product Designer)
- DOS-011: PolicyPills booking flow integration (UI Engineer)
- Future: PointsPanel component spec
- Future: Update Dostellers journey spec to include loyalty integration