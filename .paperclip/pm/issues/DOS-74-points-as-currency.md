# DOS-74: Points display as ₹-equivalent

**Priority:** P2 · **Area:** `apps/frontend`  
**Assignee:** Builder  
**Source:** Dostellers v2 Gap 9, DS-005 UX refinement  
**Depends on:** DOS-65 (points model — already in flight), DOS-68 (Apollo Client for real data)

---

## Why

Points are stored as integers (1 point per ₹1 spent, 5/10/15x for tier bonuses). Showing "320 points" is abstract. "₹320 in rewards" is instantly understood. The math is 1:1 — no backend change needed.

## What

### Frontend display change — three locations

#### 1. Member dashboard (`/dashboard`)

Change the points display from:
```
320 points
```
to:
```
You have ₹320 in rewards
```

Progress bar text:
```
Before: "320 / 1000 points until next tier"
After:  "₹680 more until a free night" 
```

#### 2. Customer profile / member header

Anywhere `customer.loyaltyPoints` is shown, display as:
```
₹{points} in rewards
```

#### 3. Booking checkout

When creating a booking, add a toggle if `loyaltyPoints > 0`:
```
[ ] Use your ₹{points} in Dosteller rewards?
    Max 50% of booking value. ₹{points} applied.
```

### No backend changes

`loyaltyPoints` stays stored as integers. The frontend formats display as:

```typescript
const displayRewards = (points: number): string =>
  `₹${points} in rewards`
```

### Shared utility

Create `apps/frontend/lib/rewards.ts`:

```typescript
export function formatRewards(points: number): string {
  return `₹${Math.floor(points)}`
}

export function rewardsLabel(points: number): string {
  if (points === 0) return 'No rewards yet'
  return `You have ${formatRewards(points)} in rewards`
}

export function pointsToNextFreeNight(points: number): string {
  const target = 500
  const remaining = Math.max(0, target - points)
  return `₹${remaining} more until a free night`
}
```

## Acceptance criteria

- [ ] Dashboard shows "₹X in rewards" not "X points"
- [ ] Progress bar shows "₹X more until a free night"
- [ ] Zero points shows "No rewards yet" (not "₹0")
- [ ] Checkout toggle shows reward ₹-amount
- [ ] No backend schema or resolver changes
- [ ] Existing tests pass (if any)
