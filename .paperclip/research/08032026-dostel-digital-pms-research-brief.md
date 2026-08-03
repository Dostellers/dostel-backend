# Dostel Digital PMS & OTT Competitive Analysis — Aug 3, 2026

## Summary
This research compares Dostel's digital PMS landscape against OTA and hostel competitors to identify action priorities.

**Sources**: Hostelworld listings, Cloudbeds pricing page, The Hosteller/Zostel public websites, Dostel live site (65.109.113.80:3001)

## 1. Dostel vs Kodaikanal Competitors

| Feature | Dostel Vattakanal | Zostel Kodaikanal | The Hosteller |
|---------|-------------------|-------------------|---------------|
| Starting Price | ₹327 (~€3.6) | €4.63 (~₹417) | €6.00 (~₹540) |
| HW Rating | 8.9/10 (15 rev) | 10/10 (139 rev) | 9.4/10 (11 rev) |
| Cleanliness | 6/10 | Unverified | Unverified |
| Booking Model | OTA-only, cash | App + website | Next.js direct |
| Membership | Dostellers (concept) | Zo currency, quests | Member discounts |
| Mobile App | No | iOS/Android | Responsive web |
| Direct Revenue | 0% (OTA fees) | 100% | 100% |

Key Findings:
- Zostel dominates digital with gamified "Zo" currency and instant booking
- The Hosteller leads with Next.js booking engine and membership perks
- Dostel has lowest price but zero direct booking = 12.5% OTA commission loss

## 2. PMS Options Comparison

| Solution | Price | Booking Engine | Channel Manager | Community Features | Fit for Dostel |
|----------|-------|----------------|-----------------|-------------------|----------------|
| **Cloudbeds** | $59-149/mo | ✓ | 300+ OTAs | Basic CRM | Strong ops fit, no membership |
| **Mews** | $80+/mo + 8% tax | ✓ | ✓ | None | Multi-property, weak hostel focus |
| **Custom GraphQL** | Variable | In progress | None | Planned | Full Dosteller control |

Recommendation: Hybrid approach
- Use Cloudbeds for core PMS + channel management
- Build custom Dosteller layer for loyalty/membership
- Switch only if custom dev > $5k for parity (per open-source-pms-patterns.md)

## 3. Critical Gap: Room Availability Query

**Blocking Issue**: DOS-64
The `roomAvailability` query is missing — without it, no booking flow works.

Proposed Schema:
```graphql
type RoomAvailability {
  roomType: RoomType!
  totalCapacity: Int!
  bookedBeds: Int!
  availableBeds: Int!
}

type Query {
  roomAvailability(hostelId: ID!, checkIn: Date!, checkOut: Date!): [RoomAvailability!]!
}
```

**Dependencies**: DOS-65 (membership schema), DOS-69 (payment amounts)

## 4. Next Steps

**Immediate (P0)**:
1. Ship roomAvailability query (DOS-64)
2. Complete payment amount fields (DOS-69)

**Short-term (P1)**:
3. Build membership schema (DOS-65)
4. Create Dosteller dashboard PWA

**Medium-term**:
5. Evaluate Cloudbeds hybrid vs continued custom build
6. Optimize Hostelworld listing (cleanliness 6→8/10)

## Sources
- http://65.109.113.80:3001 (Dostel live site)
- https://www.hostelworld.com (competitor listings)
- https://www.cloudbeds.com/pricing/ (PMS pricing)