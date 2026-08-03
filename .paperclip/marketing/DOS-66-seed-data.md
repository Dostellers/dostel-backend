# DOS-66: Seed Data Script

**Priority:** P2

**Description:** Create a script to populate core Dostel backend data (hostels, rooms, amenities, membership plans) using Prisma or shell commands.

**Acceptance Criteria:**
- Script generates 100+ sample bookings (mix dorms/private rooms)
- Preloads amenities: WiFi, kitchen, 24h reception, security cameras
- Initial membership plans: Bronze (free), Silver (500 points), Gold (1500 points)
- Includes sample Dostellers (one per stay type)
- Adds UPI/card payment gateways
- Exports to both dev/studio and staging environments

**Files to change:**
- `apps/backend/scripts/seed.ts` (Prisma seed script)
- `apps/backend/seeds/defaultData.ts` (for schema-based seeding)
- `apps/backend/src/config/environment-cfg.ts` (environment variables)

**Dependencies:**
- Requires roomAvailability query (DOS-64) for realistic booking patterns
- Assumes existing `Customer`, `Membership`, and `Dosteller` types (DOS-65)
- Starts after database is created but empty