# Property Decision & Arrival Flow v1.0

## Overview
Critical path from property discovery to in-person arrival. Focus on reducing friction and uncertainty.

## User Journey
```
Hostel Detail Page
  → PolicyPills (always visible)
  → Room Selection (inline, no page change)
  → SocialProof ("X booked this week")
  → Availability Check → Booking
  ↓
Post-booking: Instant confirmation
  → Access Guide (email/SMS)
  → Arrival Plan (check-in time, key instructions)
  → Community intro (Dosteller welcome if applicable)
```

## Key Components

### 1. PolicyPills (Persistent)
- Always visible below hero image
- 3 pills max: [Cancellation] [COVID] [Payment]
- Click pill → toast explainer (not modal)
- Mobile: pills truncate with "More" dropdown

**Contract:**
```typescript
interface PolicyPillsProps {
  policies: Array<{
    type: 'cancellation' | ' covid' | 'payment' | 'other'
    title: string
    description: string
  }>
}
```

### 2. SocialProof (Detail page)
- "X booked this week at this property"
- Recent reviews (auto-scroll carousel)
- Dosteller badge if user is member

**Contract:**
```typescript
interface SocialProofProps {
  bookedThisWeek: number
  avgRating: number
  recentReviews: Array<{ name: string; rating: number; text: string }>
  isDosteller: boolean
}
```

### 3. Decision Strip (Room selection)
Inline widget between photos and booking form:
```
📍 Kasol, Parvati Valley
⭐ 4.7 (127 reviews)
✓ 5 min walk from bus stand
🎯 Best for: Solo/travelers/workation
```

**Contract:**
```typescript
interface DecisionStripProps {
  location: string
  rating: number
  reviewCount: number
  distanceFrom?: string
  bestFor: 'solo' | 'groups' | 'digital' | 'nature'
}
```

### 4. Access Guide (Post-booking)
Email/SMS template with:
- Check-in window
- Key code/instructions
- Emergency contact
- Dosteller welcome (if member)

### 5. Arrival Plan (Pre-arrival)
- Map with directions (integrated Google Maps)
- Public transport + walking directions
- Parking info
- Community connection (WhatsApp group link)

## Mobile-First Rules
- All CTAs sticky bottom (72px)
- Map iframe aspect ratio 16:9
- Directions always clickable

## Acceptance Criteria
- [ ] PolicyPills visible without scroll trigger
- [ ] SocialProof updates live (no page refresh)
- [ ] Decision Strip renders in 200ms
- [ ] Access Guide sends within 1 minute of booking
- [ ] Arrival Plan accessible from confirmation page
- [ ] All text WCAG AA compliant
- [ ] Animations respect prefers-reduced-motion