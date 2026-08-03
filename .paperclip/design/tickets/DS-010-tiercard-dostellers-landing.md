# DS-010: TierCard + Dostellers Landing Page

**Assignee**: UI Engineer  
**Priority**: P0  
**Depends on**: DS-001 (tokens), DS-006 (design system)  
**Estimate**: 1 heartbeat

---

## Deliverables

### 1. TierCard Component
**File**: `apps/frontend/components/TierCard.tsx`

```tsx
interface TierCardProps {
  tier: 'explorer' | 'nomad' | 'wanderer';
  name: string;
  price: number;
  period: 'free' | '/yr';
  benefits: string[];
  highlighted?: boolean;
  selected?: boolean;
  onSelect: () => void;
}
```

**States**:
- Default: `bg-stone-50 border-stone-200`
- Selected: `border-2 border-forest-500 bg-forest-50`
- Highlighted (Nomad): "Most popular" badge in sky-500
- Hover: `shadow-lg` (desktop only)
- Disabled: `opacity-50 cursor-not-allowed`

**Visual**:
- Tier icon (Explorer: compass, Nomad: mountain, Wanderer: star)
- Price: large, font-bold
- Benefits: checkmark icons, 1 line each
- CTA: "Select" button (full width on mobile)

---

### 2. Dostellers Landing Page
**File**: `apps/frontend/app/dostellers/page.tsx`

**Sections** (in order):
1. **Hero**: "Not just a stay. A community." + mountain photo (object-cover, aspect-[4/3])
2. **Why Join** (BenefitsList): 4 cards with icons
   - Up to 40% off long stays
   - Free events & workshops
   - Community of travellers
   - Earn points → free nights
3. **Tier Comparison** (TierCard × 3): Stacked mobile, 3-col desktop
4. **TestimonialCarousel**: Auto-scroll, pause on hover, 3 testimonials
5. **FAQAccordion**: 6 questions, keyboard accessible
6. **Footer CTA**: "Join Dostellers – Free" (primary) + "See membership plans" (secondary, scrolls to tiers)

---

## Acceptance Criteria

| Category | Requirement |
|---|---|
| Functional | Tier selection updates URL; Explorer pre-selected; benefits match spec |
| Mobile | Single column; CTA above fold; carousel touch-swipe; accordion keyboard nav |
| Accessibility | Focus rings; ARIA labels; live region for carousel; WCAG AA contrast |
| Visual | Tokens only; forest/sunset/sunset palette; no purple gradients |
| Motion | Page fade-in on load; card lift on hover; respect `prefers-reduced-motion` |

---

## Verification Checklist
- [ ] TierCard renders all 3 states
- [ ] Landing page loads < 2s on 3G
- [ ] No horizontal scroll at 375px
- [ ] Keyboard can navigate entire page
- [ ] Testimonial carousel announces changes via `aria-live`

---

## Next Tickets
- **DS-011**: Join page (tier select + signup form)
- **DS-012**: Dashboard components (MemberHeader, PointsBar, QuickActions, BadgeGrid)