# MKT-001: Update Homepage Copy — Conversion-Focused

**Assignee**: Content Marketer (this ticket) → Frontend Builder (implementation)  
**Priority**: P0  
**Estimate**: 1 heartbeat  
**Depends on**: None  

## Background
We have drafted conversion-focused homepage copy that aligns with Dostel's warm community hostel voice (not generic startup tone). The draft is saved at `.paperclip/marketing/homepage-copy.md`.

## Changes Needed
Replace the existing homepage copy with the draft content. Specific sections to update:

### 1. Hero Section
- Replace H1 with two-line version: "Welcome to Dostel" / "A community hostel in the mountains of Vattakanal"
- Update subtitle to: "Perched in the misty forests of Kodaikanal. Built on a story of restoration — inspired by Bob & Tanya (1985). This is a place you stay, not just sleep."
- Change search bar placeholder to: "Search stays in Vattakanal..."

### 2. Value Proposition Cards (replacing generic 3-column section)
Replace with Dostel-specific cards:

**Card 1 — The Story**
- Icon: 🌱 (or tree sapling SVG)
- Heading: "Rooted in restoration"
- Body: "In 1985, Bob & Tanya came to Vattakanal and never left. They restored the land, grew a community, and planted the seed for what Dostel is today. Forty years later, we're still tending that garden."

**Card 2 — Dostellers**
- Icon: 🔥 (or campfire SVG)
- Heading: "The Dostellers"
- Body: "More than guests — community members. Stay long enough to unlock the network: shared meals at Altaf's Cafe, group treks to Dolphin's Nose, bonfire nights under the Kodaikanal sky."

**Card 3 — The Place**
- Icon: 🏔️ (or mountain SVG)
- Heading: "Vattakanal, Kodaikanal"
- Body: "Not a resort. Not a co-working chain. A mountain hostel at 2,000m where the rainforest meets a backpacker's curiosity. Suites, couple rooms, dorms — something for every kind of traveler."

### 3. Featured Hostels Section
Since Dostel is a single property, highlight room types:
- Heading: "Rooms built for every kind of stay"
- Subtitle: "From solo dorms to private suites — all with mountain light and community spirit"
- Cards: Dorm (₹327/night) · Couple Room (₹1,299/night) · Deluxe Suite (₹1,799/night)

### 4. Bob & Tanya Brand Story Block (new section)
Add between Featured and Events:
- Heading: "It started with two backpackers"
- Body: "Bob & Tanya arrived in Vattakanal in 1985. British travelers who fell in love with a hillside and never caught their flight home. They planted trees, built a home, and opened their doors to other wanderers. The land they restored became the foundation of Dostel. Forty years later, we're still welcoming travelers the same way — with tea, a warm bed, and room at the table."
- Visual: Side-by-side or split layout with forest/mountain imagery
- CTA: None (brand depth, not conversion)

### 5. Upcoming Events Section
Keep section but add:
- Small badge/tag above section: "Vattakanal & beyond"
- Empty state body: "No upcoming events — check back soon. Or ask at reception about this week's treks and bonfires."

### 6. Trust & Safety Section
Replace with:
- Badges:
  - 🏔️ "Real Vattakanal hostel since 1985"
  - ☕ "Altaf's Cafe on property"
  - 🔥 "Campfire & community nights"
  - ✅ "Free cancellation — no booking fees"
  - 🌿 "Ecologically restored grounds"
  - 📞 "24hr reception + local support"
- Body: "Dostel isn't a chain. It's one hostel in one mountain town — run by people who know every trail, every cafe owner, and every firefly spot on the hillside."

### 7. Final CTA Section
Replace generic CTA with:
- Heading: "Come stay awhile"
- Body: "Vattakanal is waiting. whether you're passing through for a weekend or staying for a month — there's a bed, a fire, and a community here."
- Primary CTA: "Book a room" → `/hostels/dostel-vattakanal`
- Secondary CTA: "Become a Dosteller" → `/membership`

## Voice Guidelines for Implementation
- Use "we" and "our" — not "Dostel" as a third-person brand
- Lowercase tone where it feels human (e.g., "come stay awhile" not "Come Stay Awhile")
- Avoid: "extraordinary", "transformative", "curated", "journey", "transformation"
- Prefer: "mountain", "community", "fire", "trail", "stay", "real"
- Reference real things: Altaf's Cafe, Dolphin's Nose, Vattakanal, Bob & Tanya, Kodaikanal, 1985

## Definition of Done
- All copy replaced as specified in `.paperclip/marketing/homepage-copy.md`
- Voice guidelines implemented
- No generic startup tone remains
- Live at http://65.109.113.80:3001/

## References
- Copy draft: `.paperclip/marketing/homepage-copy.md`
- Brand facts: `/root/dostel-backend/.paperclip/MARKETING_INSTRUCTIONS.md` (Brand facts section)
- Live frontend: http://65.109.113.80:3001