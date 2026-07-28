# DOS-81: BookingProvider + BookingContext (shared booking state)

**Priority:** P1 · **Area:** `apps/frontend`  
**Assignee:** UI Engineer  
**Source:** `design/flows/booking-flow.md` (shared state section)  
**Depends on:** DOS-68 (Apollo Client — for future GQL queries, but not strictly required for context shape)

---

## Why

The booking funnel spans 4 routes (detail → guest details → review → payment/confirmation). Without shared state:
- Dates/guests/selected rooms are lost on navigation
- Each page must re-derive state from URL params
- No persistence across browser close
- DOS-70 (booking creation page) has no data foundation

BookingProvider solves this: a single React context that any booking page can read/write.

## What

### 1. Create `apps/frontend/components/BookingProvider.tsx`

```typescript
// State shape
interface BookingState {
  destination: string
  checkIn: string        // ISO date
  checkOut: string       // ISO date
  guests: number
  nights: number
  hostel: {
    slug: string
    name: string
    location: string
  }
  selectedRooms: Array<{
    roomId: string
    name: string
    type: string
    quantity: number
    pricePerNight: number
    total: number
  }>
  guestInfo?: {
    fullName: string
    email: string
    phone: string
    specialRequests?: string
  }
  subtotal: number
  taxes: number
  serviceFee: number
  total: number
}

// Actions
interface BookingActions {
  updateSearch: (params: Partial<BookingState>) => void
  selectRoom: (room: RoomSelection) => void
  removeRoom: (roomId: string) => void
  updateGuestInfo: (info: BookingState['guestInfo']) => void
  resetBooking: () => void
}
```

### 2. Persistence chain (triple-redundant)

1. URL query params (highest priority)
2. localStorage (survives refresh + browser close, key: `dostel-booking-state`)
3. Defaults (empty — initial mount)

**Hydration order on mount:**
```
URL params → setState → localStorage fallback → render
```

### 3. `apps/frontend/components/BookingSummary.tsx`

Collapsible summary card showing:
- Hostel name + location
- Check-in → Check-out (with nights count)
- Selected room(s): name × qty, price/night
- Total: subtotal + taxes + service fee
- Used in sidebar (desktop) / collapsible drawer (mobile)

```typescript
interface BookingSummaryProps {
  state: BookingState
  collapsed?: boolean
  onToggle?: () => void
}
```

### 4. Wire into layout

Wrap `/booking/*` routes in `BookingProvider` (create route group `apps/frontend/app/booking/(checkout)/layout.tsx` if needed):

```tsx
<BookingProvider>
  {children}
</BookingProvider>
```

### 5. No backend deps

This is pure frontend state management. The `total`/`taxes`/`subtotal` are computed on the client from room prices + nights. Backend integration comes in DOS-70 (booking submission).

## Acceptance criteria

- [ ] `BookingProvider` wraps `/booking/*` routes
- [ ] State hydrates from URL params on mount (`?checkIn=&checkOut=&guests=&roomIds=`)
- [ ] State persists to localStorage on every change (debounced 500ms)
- [ ] State restores from localStorage when URL params are empty
- [ ] `selectRoom` / `removeRoom` update `selectedRooms` and recalculate `total`
- [ ] `updateGuestInfo` merges into `guestInfo`
- [ ] `resetBooking` clears all state
- [ ] `BookingSummary` component renders accurate totals
- [ ] No backend calls — all computation is client-side
- [ ] TypeScript types exported for reuse in booking page components
- [ ] Provider compiles without errors (`npm run dev` on frontend)
