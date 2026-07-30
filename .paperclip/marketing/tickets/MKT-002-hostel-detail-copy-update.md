# MKT-002: Update Hostel Detail Page Copy — Conversion-Focused

**Assignee**: Content Marketer (this ticket) → Frontend Builder (implementation)  
**Priority**: P0  
**Estimate**: 1 heartbeat  
**Depends on**: None  

## Background
We have drafted conversion-focused hostel detail page copy that aligns with Dostel's warm community hostel voice. The draft is saved at `.paperclip/marketing/hostel-detail-copy.md`.

## Changes Needed
Replace the existing hostel detail page copy with the draft content. Specific sections to update (based on the draft):

### 1. Hero Section
- Keep the hostel name and location prominent.
- Update the description to: "A mountain hostel at 2,000m where the rainforest meets a backpacker's curiosity. Suites, couple rooms, dorms — something for every kind of traveler."
- Add a badge: "Real Vattakanal hostel since 1985"

### 2. Room Types Section
- Update the heading to: "Rooms built for every kind of stay"
- Update the room cards to reflect Dostel's actual offerings:
  - Dorm: ₹327/night — "Shared rooms with mountain light and locker access"
  - Couple Room: ₹1,299/night — "Private rooms for two, perfect for couples or solo travelers wanting space"
  - Deluxe Suite: ₹1,799/night — "Spacious suites with sitting area and mountain views"
- Add a note: "*Prices shown are base rates. Long-stay and Dosteller discounts apply.*"

### 3. Amenities Section
- Update heading to: "What's included in your stay"
- Update the amenities list to:
  - 🔥 "Campfire & community nights"
  - ☕ "Altaf's Cafe on property"
  - 🌿 "Ecologically restored grounds"
  - 📞 "24hr reception + local support"
  - 🏔️ "Real Vattakanal hostel since 1985"
  - 🧳 "Free cancellation — no booking fees"

### 4. Location Section
- Update heading to: "Where we are"
- Update the description to: "Vattakanal, Kodaikanal — a quiet hillside village 8km from Kodaikanal town. Walk to Dolphin's Nose, Tiger Shaft, and Pambar Shola forest. Auto-rickshaws available for town trips."
- Add a small map or directions note: "Follow signs for 'Dostel' or 'Altaf's Cafe' — we're just past the cafe on the main path."

### 5. The Dostellers Section
- Add a section after amenities or location:
  - **Heading:** "Stay long enough to belong"
  - **Body:** "Our Dostellers program rewards long stays and repeat visitors. Stay 14+ nights in a month to unlock: shared meals at Altaf's Cafe, group treks to Dolphin's Nose, bonfire nights, and access to the Dostellers WhatsApp group."
  - **CTA:** "Learn about Dostellers" → `/membership`

### 6. Final CTA Section
- Update heading to: "Come stay awhile"
- Update body to: "Vattakanal is waiting. whether you're passing through for a weekend or staying for a month — there's a bed, a fire, and a community here."
- Primary CTA: "Check availability" → `/booking/dostel-vattakanal/dates`  
- Secondary CTA: "Become a Dosteller" → `/membership`

## Voice Guidelines for Implementation
- Use "we" and "our" — not "Dostel" as a third-person brand
- Lowercase tone where it feels human (e.g., "come stay awhile" not "Come Stay Awhile")
- Avoid: "extraordinary", "transformative", "curated", "journey", "transformation"
- Prefer: "mountain", "community", "fire", "trail", "stay", "real"
- Reference real things: Altaf's Cafe, Dolphin's Nose, Vattakanal, Bob & Tanya, Kodaikanal, 1985

## Definition of Done
- All copy replaced as specified in `.paperclip/marketing/hostel-detail-copy.md`
- Voice guidelines implemented
- No generic startup tone remains
- Live at http://65.109.113.80:3001/hostels/dostel-vattakanal

## References
- Copy draft: `.paperclip/marketing/hostel-detail-copy.md`
- Brand facts: `/root/dostel-backend/.paperclip/MARKETING_INSTRUCTIONS.md` (Brand facts section)
- Live frontend: http://65.109.113.80:3001