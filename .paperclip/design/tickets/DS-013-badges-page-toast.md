# DS-013: Badges Page + Unlock Toast Notification

**Assignee**: UI Engineer  
**Priority**: P1  
**Depends on**: DS-011 (BadgeGrid component)  
**Estimate**: 1 heartbeat

---

## Deliverables

### 1. Badges Page
**File**: `apps/frontend/app/dashboard/badges/page.tsx`

- Uses `BadgeGrid` component to display all 6 badges
- Page title: "My Badges"
- Empty state: "You haven't unlocked any badges yet. Keep exploring!" with CTA to `/hostels`
- Grid layout: 2 columns on mobile, 3 columns on desktop

### 2. Badge Unlock Toast
**Location**: To be triggered from booking confirmation or review when criteria met

**Toast content**:
- Success: "🎉 You unlocked [Badge Name]!" (e.g., "🎉 You unlocked Trailblazer!")
- Variant: `toast-success` (green background)
- Duration: 5000ms (5 seconds)
- Position: bottom-center on mobile, top-right on desktop
- Animation: slide-up + fade-in (250ms ease-out)
- Respects `prefers-reduced-motion`

**Trigger conditions** (examples):
- Trailblazer: on 3rd completed booking
- Storyteller: on 3rd review submitted
- Social Butterfly: on 2nd event RSVP
- Remote Pro: on 2nd workation booking
- Hometown Hero: when total nights >= 30
- Early Adopter: account created within first 6 months of Dostel launch

---

## Acceptance Criteria

| Category | Requirement |
|---|---|
| Functional | Badges page shows all badges with correct locked/unlocked state; toast fires on unlock criteria |
| Mobile | Badges page: 2-column grid, touch targets >= 44px; toast bottom-center, doesn't obstruct bottom nav |
| Accessibility | Toast uses `role="status"` and `aria-live="polite"`; badge grid keyboard navigable; focus rings on badge cards |
| Visual | Unlocked: full color; Locked: grayscale (opacity-50) + criteria text; toast uses Dostel success token |
| Motion | Toast slide-up/fade-in; badge grid page fade-in on load; respects `prefers-reduced-motion` |

---

## Verification Checklist
- [ ] Badges page loads < 2s on 3G
- [ ] All 6 badges display with correct icons and criteria
- [ ] Unlocked badges are full color, locked are grayscale
- [ ] Toast appears on unlock and dismisses after 5s
- [ ] Keyboard can navigate badges page (Tab → Arrow keys → Enter/Space to focus badge)
- [ ] Toast announces via screen reader

---

## Next Tickets
- **DS-014**: LongStayToggle integration in booking flow
- **DS-015**: Non-member Dosteller pricing prompt