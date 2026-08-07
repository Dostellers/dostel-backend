# DOS-009: Loyalty Tokens & Badge Component Spec

## Assigned to: Design Systems Designer
## Priority: P0
## Status: Draft

## Overview
Implement loyalty program design tokens and component contracts to power the Dostellers tiered membership system (Bronze/Silver/Gold), addressing a key competitive gap vs. Zostel and The Hosteller who lack visible loyalty programs.

## Design Tokens to Add

### Loyalty Program Colors
Add these to `design-tokens.md` under a new "Loyalty Program" section:

| Token | Hex | Usage |
|-------|-----|-------|
| `--ds-color-bronze` | `#cd7f32` | Bronze tier background/border |
| `--ds-color-silver` | `#c0c0c0` | Silver tier background/border |
| `--ds-color--ds-color | Gold tier background/border/border`--ds-color--ds--color-po-to-in-t2000--`--ds--color-po-in-t200-- |
--ds-color-po-in-t300--`--df--do--co--lo-or-- |
--ds-color-po-in-t400-- | `#2563eb` | Points progress bar (Blue-600) |
|--ds-color-po-in-t500-- | `#1d4ed8` | Points progress bar fill (Blue-800) |
|--ds-color-po-in-t600-- | `#1e40af` | Points progress bar active (Blue-900) |
|--dss-color--s-ol--d-l--e--r--v-e--r-- |#`#f59e0b` | Earnings badge (Amber-400) |
|--ds-color--d--i--s--c--o--u--n--t-- | `#10b981` | Discount badge (Emerald-500) |
|--ds-color--d--a--i--l--y-- | `#ef4444` | Streak badge (Red-500) |

### Loyalty Program Spacing
Add to spacing section:
| Token | Value | Usage |
|-------|-------|-------|
|--ds-space--3-- | `12px` | Badge internal padding |
|--ds-space--4-- | `16px` | Tier card padding |
|--ds-space--6-- | `24px` | Points panel gap |

### Loyalty Program Border Radius
| Token | Value | Usage |
|-------|-------|-------|
|--ds-radius--s--m--d-- | `8px` | Tier cards, points panel |
|--ds-radius--f--u--l--l-- | `9999px` | Loyalty badges (pill shape) |

## Component Contracts

### TierBadge Component
**Purpose:** Display Dosteller membership tier with visual progression

**Props Interface:**
```typescript
interface TierBadgeProps {
  tier: 'bronze' | 'silver' | 'gold' | null;
  points?: number; // Current points balance
  maxPoints?: number; // Points needed for next tier (if applicable)
  size?: 'sm' | 'md' | 'lg'; // Default: 'md'
  className?: string;
  onClick?: () => void; // Optional: link to Dostellers dashboard
}
```

**States & Visual Treatment:**
- **Default (no tier)**: Outline only, `--ds-color-stone-200` border, `--ds-color-stone-400` text
- **Bronze**: Border `--ds-color-bronze`, Background `--ds-color-bronze/10`, Text `--ds-color-bronze`
- **Silver**: Border `--ds-color-silver`, Background `--ds-color-silver/10`, Text `--ds-color-silver`
- **Gold**: Border `--ds-color-gold`, Background `--ds-color-gold/10`, Text `--ds-color-gold`
- **Hover**: Scale `1.02`, Shadow `--ds-shadow-sm`
- **Pressed**: Scale `0.98`

**Layout Rules:**
- Minimum size: 32x32px (sm), 40x40px (md), 48x48px (lg)
- Always square aspect ratio
- Text centered vertically and horizontally
- Points display: `"{points}pts"` below tier name when provided

**Accessibility:**
- Role: `img` with aria-label `"Bronze Dosteller tier"` (dynamic based on tier)
- Focus ring: `2px solid var(--ds-color-sky)` with `2px` offset
- Keyboard: Space/Enter to activate (when onClick provided)

**Motion:**
- Hover: Scale animation (1.0 -> 1.02, 150ms ease-out)
- Tier change: Pulse scale (1.0 -> 1.1 -> 1.0, 300ms ease-in-out)
- Respects `prefers-reduced-motion`

### PointsPanel Component
**Purpose:** Sidebar module showing points balance, rewards, and redemptions

**Props Interface:**
```typescript
interface PointsPanelProps {
  points: number;
  tier: 'bronze' | 'silver' | 'gold';
  rewards: Array<{
    id: string;
    title: string;
    pointsCost: number;
    available: boolean;
    icon?: string;
  }>;
  redemptions: Array<{
    id: string;
    title: string;
    date: string; // ISO date
  }>;
  onViewAllRewards?: () => void;
  onRedeem?: (rewardId: string) => void;
  className?: string;
}
```

**States & Visual Treatment:**
- **Container**: Background `--ds-color-white`, Border `1px solid var(--ds-color-stone-200)`, Radius `--ds-radius-md`
- **Header**: Background `--ds-color-forest-500/5`, Padding `--ds-space-4`
- **Points Display**: Large text `--ds-text-title`, Color `--ds-color-forest-900`
- **Progress Bar**: Height `4px`, Background `--ds-color-stone-200`, Fill `--ds-color-points-500`
- **Rewards List**: Background `--ds-color-snow`, Border-top `1px solid var(--ds-color-stone-200)`
- **Reward Item**: Padding `--ds-space-3`, Hover: Background `--ds-color-forest-50/10`
- **Redemptions**: Text `--ds-text-xs`, Color `--ds-color-stone-600`

**Layout Rules:**
- Width: `100%` of sidebar container (desktop), full-width card (mobile)
- Minimum height: `200px`
- Points section: Flex layout with icon + text + progress bar
- Rewards section: Vertical list with dividers
- Redemptions section: Optional, collapsed by default

**Accessibility:**
- Role: `region` with aria-label `"Dostellers points and rewards"`
- Points display: `aria-label="You have {points} Dosteller points"`
- Each reward: `role="button"` with appropriate aria-label
- Focus ring: `2px solid var(--ds-color-sky)` offset `2px`
- Live region for points updates: `aria-live="polite"`

**Motion:**
- Points counter update: Scale pulse (1.0 -> 1.05 -> 1.0, 200ms ease-in-out)
- Reward hover: Background fade-in (150ms ease-out)
- Panel expand/collapse: Height animation (250ms ease-out/in)
- Respects `prefers-reduced-motion`

### DostellerBadge Component
**Purpose:** Small badge indicating Dosteller status or achievements

**Props Interface:**
```typescript
interface DostellerBadgeProps {
  variant: 'member' | 'streak' | 'badge' | 'points';
  label: string;
  count?: number; // For streak/badge variants
  icon?: string; // Optional icon key
  size?: 'sm' | 'md'; // Default: 'sm'
  className?: string;
}
```

**States & Visual Treatment:**
- **member**: Background `--ds-color-sunset/20`, Border `1px solid var(--ds-color-sunset)`, Text `--ds-color-sunset`
- **streak**: Background `--ds-color-error/20`, Border `1px solid var(--ds-color-error)`, Text `--ds-color-error`
- **badge**: Background `--ds-color-success/20`, Border `1px solid var(--ds-color-success)`, Text `--ds-color-success`
- **points**: Background `--ds-color-points-200`, Border `1px solid var(--ds-color-points-500)`, Text `--ds-color-points-900`
- **Hover**: Opacity `0.9` (no scale to maintain layout)
- **Pressed**: Opacity `0.8`

**Layout Rules:**
- Minimum height: 24px (sm), 28px (md)
- Minimum padding: `--ds-space-1` vertical, `--ds-space-2` horizontal
- Text: `--ds-text-xs` (sm), `--ds-text-sm` (md)
- Icon (when provided): 16px size, margin-right `--ds-space-1`

**Accessibility:**
- Role: `status` for live updates, `img` for static badges
- Aria-label: Dynamic based on variant and label (e.g., `"3-day Dosteller streak"`)
- Focus ring: `2px solid var(--ds-color-sky)` with `2px` offset (when focusable)
- Keyboard: Space/Enter (when interactive)

**Motion:**
- Appear: Fade-in (150ms ease-out)
- Update: Gentle pulse (1.0 -> 1.03 -> 1.0, 200ms ease-in-out)
- Respects `prefers-reduced-motion`

## Implementation Guidelines

### Token Usage
1. All loyalty tokens must be imported from `:root` CSS variables
2. Use semantic token names in components (never hardcode hex values)
3. Apply opacity variants via CSS (e.g., `var(--ds-color-bronze)/10`)
4. Update `globals.css` `@theme inline` block with new tokens

### Component Placement
- **TierBadge**: 
  - User avatar dropdown in header
  - Dostellers dashboard header
  - Profile cards in community features
  - Review author badges
- **PointsPanel**: 
  - Dostellers dashboard sidebar
  - Modal/panel in booking flow (when Dosteller logged in)
  - Profile sidebar
- **DostellerBadge**:
  - Review cards (streak badge)
  - Activity feed items
  - Event RSVPs
  - Referral program displays

### Responsive Behavior
- Mobile: Stack vertically, full-width containers
- Desktop: Sidebar layout for PointsPanel, inline for badges
- Touch targets: Minimum 44x44px for all interactive elements

## Verification Checklist

### Functional
- [ ] TierBadge correctly displays all four states (null/bronze/silver/gold)
- [ ] PointsPanel shows accurate points vs. tier progress
- [ ] DostellerBadge variants render with correct colors
- [ ] All interactive states respond to hover/focus/press
- [ ] Click handlers fire correctly when provided

### Accessibility
- [ ] WCAG AA contrast met for all text/background combinations
- [ ] Focus indicators visible (2px solid Sky-500)
- [ ] ARIA labels present for all interactive elements
- [ ] Touch targets ≥ 44px
- [ ] Screen reader announces dynamic changes (points updates)

### Visual
- [ ] Uses only prescribed loyalty tokens (no hardcoded colors)
- [ ] Mountain/community tone maintained (no corporate aesthetics)
- [ ] Consistent spacing (8px grid)
- [ ] Proper border radius application
- [ ] Motion only from prescribed set (no decorative animations)

### Performance
- [ ] Components render without layout shift
- [ ] Animations smooth on low-end devices
- [ ] CSS custom properties used efficiently
- [ ] No redundant re-renders in React implementations

## Follow-up Issues
- Link to Dostellers journey spec updates for loyalty integration
- Create UI Engineer ticket for PointsPanel implementation in dashboard
- Update booking flow to display Dosteller discounts inline
- Add loyalty analytics tracking points accrual/redemption

## References
- Competitive analysis: `.paperclip/design/competitive/zostel-hosteller-ux-gaps.md` (Gap 4: No loyalty program)
- Existing tokens: `.paperclip/design/system/design-tokens.md`
- Component patterns: `.paperclip/design/components.md`
- Visual identity: `.paperclip/design/visual-identity.md`