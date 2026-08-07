# Search & Listing Flow v1.0

## Key Deliverables
- URL-parameter-based search persistence
- Filter persistence across pages
- SocialProof integration
- Responsive HostelCard visibility

## User Journey
```
SearchBar (params: destination/checkIn/checkOut)
  -> Filter panel with checkboxes
  -> HostelCard grid with policy pills
  -> SocialProof stats (X booked this week)
  -> Detailed listing view
```

## Flow Components

### 1. SearchBar
- URL parameters match format:
```
?destination=Kasol&checkIn=2023-03-15&checkOut=2023-04-01&guests=2
```
- Persistent clear filter button

### 2. Filter Panel
- Dynamically populated filters
- Filter persistence via URL
- Sort options: price/rating/popularity

### 3. HostelCard
- PolicyPillar integration
- SocialProof stats if user is redirected
- Stacked flexbox grid (mobile) vs. masonry (desktop)

### 4. SocialProof Banner
- "X booked this week
547 staying at this hostel"
- Auto-refresh every 24h

## Technical Contracts

### HostelCard
```typescript
interface HostelCardProps {
  name: string
  rating: number
  price: number
  bookingUrl: string
  policyPills: Array<{
    type: string
    title: string
  }>
  bookedThisWeek: number
  isDosteller: boolean
  variant: 'default' | 'compact'
  soldOut: boolean
  dostellerPrice?: number
}
```

## Acceptance Criteria
- [ ] SearchBar persists to URL
- [ ] Filters clear button resets all
- [ ] HostelCard SocialProof dynamic update
- [ ] No horizontal scroll
- [ ] Touch targets >=44px
- [ ] WCAG AA contrast verified
