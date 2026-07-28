# DOS-79: Seed data script (carry-over from DOS-66)

**Priority:** P1 · **Area:** `apps/backend`  
**Assignee:** Builder  
**Carry-over from:** DOS-66 (identified in gap analysis, never shipped)

---

## Why

Empty MongoDB makes the entire frontend useless. There is no `scripts/seed.js`. Every query returns empty arrays. Without seed data:
- Frontend shows empty hostels/rooms
- Booking flow can't be tested
- Admin shows nothing
- Builder must manually create data via GraphQL playground every time

## What

### 1. Create `scripts/seed.js`

One-time runnable script (`node scripts/seed.js`) that populates the MongoDB with realistic Dostel Vattakanal data.

### Data to seed

**Hostel (1):** Dostel Vattakanal
- `name`: "Dostel Vattakanal"
- `slug`: "dostel-vattakanal"
- `tagline`: "Community hostel in the mountains"
- `description`: "Nestled in the pine forests of Vattakanal, Dostel is Kodaikanal's original backpacker community. Founded by Bob & Tanya in 1985."
- `city`: "Vattakanal", `state`: "Tamil Nadu", `country`: "India"
- `rating`: 4.5, `totalReviews`: 342
- Amenities: bonfire, co-working, cafe (Altaf's), wifi, hot water, lockers, laundry

**Rooms (6):**
| Name | Type | Capacity | Price/night | Quantity |
|------|------|----------|-------------|----------|
| Mixed Dorm (6 Bed) | dorm | 6 | 450 | 3 |
| Female Dorm (4 Bed) | dorm | 4 | 550 | 1 |
| Private Couple Room | private | 2 | 1,200 | 2 |
| Deluxe Suite | private | 2 | 2,500 | 1 |
| Family Room (4 Bed) | private | 4 | 1,800 | 1 |
| Mountain View Suite | private | 2 | 3,000 | 1 |

**Customer (1 test):**
- `fullName`: "Test User"
- `email`: "test@dostel.in"
- `phone`: "9999999999"
- `password`: bcrypt-hashed "test1234"
- `accountStatus`: "active"

**Booking (1 draft):** For test customer, Mixed Dorm, future dates (+3 days from now, 2 nights)

### 2. Add npm run script

In root `package.json`:
```json
"scripts": {
  "seed": "node scripts/seed.js"
}
```

### 3. Verify

```bash
npm run seed
# Should log: "Seeded: 1 hostel, 6 rooms, 1 customer, 1 booking"

# Test via GraphQL
query { hostels { id name slug rooms { id type name price } } }
query { customers { id fullName email } }
```

### 4. Idempotency

Script must be re-runnable — use `deleteMany({})` on each collection at the start, or `findOneAndUpdate` with upsert on unique slugs/emails.

## Acceptance criteria

- [ ] `npm run seed` creates 1 hostel, 6 rooms, 1 customer, 1 booking
- [ ] Re-running seed does not duplicate data (upsert or clean-insert)
- [ ] Test customer can log in with `test@dostel.in` / `test1234` via GraphQL `login`
- [ ] Hostel query returns rooms with correct prices
- [ ] Backend boots after seed (no schema mismatch)
- [ ] Seed script is in version control at `scripts/seed.js`
