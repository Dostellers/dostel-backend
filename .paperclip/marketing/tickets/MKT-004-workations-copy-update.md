# MKT-004: Update Workations Page Copy — Conversion-Focused

**Assignee**: Content Marketer (this ticket) → Frontend Builder (implementation)  
**Priority**: P0  
**Estimate**: 1 heartbeat  
**Depends on**: None  

## Background
We have drafted conversion-focused workations page copy that aligns with Dostel's honest tone about remote work realities. The draft is saved at `.paperclip/marketing/workations-copy.md`.

## Changes Needed
Replace the existing workations page copy with the draft content. Specific sections to update (based on the draft):

### 1. Hero Section
- Update badge to: "Remote work in the mountains"
- Update H1 to: "Work from Vattakanal"
- Update subtitle to: "Fiber internet, mountain air, and a community of people who also brought their laptop. Dostel has been a remote work base for years — not because we branded it that way, but because people kept staying."
- Update CTA to: "Book a long stay" → `/hostels/dostel-vattakanal?longStay=true`
- Update secondary CTA to: "See our long-stay rates" → (scroll to pricing)

### 2. The "Why Vattakanal for Work" Section
- Update heading to: "Why Vattakanal for work?"
- Update body to: "It’s not the coworking spaces (there aren’t any). It’s the rhythm: morning walks through misty forests, lunch at Altaf’s Cafe, afternoon work with a view of Dolphin’s Nose, and evenings spent swapping stories around the fire. You’re not escaping your work — you’re placing it in a place that makes it better."
- Update the 3 cards to reflect:
  - Card 1: "Real mountain internet" — Body: "Fiber-connected rooms and common spaces. Tested for Zoom calls and large file uploads."
  - Card 2: "Community, not isolation" — Body: "Other remote workers are already here. Join the morning tea circle or find a trek buddy for Saturday."
  - Card 3: "Work with the mountain" — Body: "Your desk faces the valley. Take breaks on the terrace. Let the weather dictate your pace."

### 3. The "Long-Stay Rates" Section
- Update heading to: "Long-stay rates"
- Update subtitle to: "Stay longer, pay less — no membership required"
- Update the table to:
  - 1-6 nights: ₹1,299/night (Couple Room) · ₹1,799/night (Deluxe Suite)
  - 7-13 nights: ₹1,169/night (10% off) · ₹1,619/night (10% off)
  - 14+ nights: ₹1,039/night (20% off) · ₹1,439/night (20% off)
- Update the footnote to: "*Dostellers members get additional 5-15% off these rates. Long-stay discount applies to the base rate before member discount.*"
- Update the CTA below the table to: "Book a long stay" → `/hostels/dostel-vattakanal?longStay=true`

### 4. The "What’s Included" Section
- Update heading to: "What’s included in your stay"
- Update the 4 icons and text to:
  - Icon: 📶 — Text: "Fiber internet in rooms and common areas"
  - Icon: ☕ — Text: "Breakfast available at Altaf's Cafe (pay-as-you-go)"
  - Icon: 🔥 — Text: "Weekly bonfire and community dinner"
  - Icon: 🥾 — Text: "Trail maps and local knowledge at reception"

### 5. The "Real Remote Workers, Real Stays" Section
- Update heading to: "Real remote workers, real stays"
- Update the 3 testimonials to:
  - Testimonial 1: "I came for a week and stayed for a month. The internet held up for my client calls, and the community kept me sane." — Alex, software developer, 4-week stay
  - Testimonial 2: "Met my trekking partner at breakfast. We did Dolphin's Nose together and now we’re planning a trip to Kashmir." — Priya, designer, 2-week stay
  - Testimonial 3: "My daughter did online school from the common room while I worked. The teachers thought she was in a fancy international school." — Mark, consultant, 6-week stay with family

### 6. Final CTA Section
- Update heading to: "Ready to work from the mountain?"
- Update body to: "Vattakanal is waiting. Whether you're here for a week or a season, there's a desk, a bed, and a community here."
- Update primary CTA to: "Book a long stay" → `/hostels/dostel-vattakanal?longStay=true`
- Update secondary CTA to: "Questions? Ask at reception" → (scroll to contact or leave as is if it links to contact)

## Voice Guidelines for Implementation
- Be honest about remote work realities — don't overpromise
- Focus on community + productivity, not just productivity
- Use lowercase where it feels human (e.g., "work from vattakanal" is okay in body text but keep H1 title case)
- Avoid: "escape", "escape your home office", "transformative", "journey", "peak performance"
- Prefer: "mountain", "community", "fire", "trail", "stay", "real", "internet", "cafe", "trek"
- Reference real things: Altaf's Cafe, Dolphin's Nose, Vattakanal, Kodaikanal, fiber internet

## Definition of Done
- All copy replaced as specified in `.paperclip/marketing/workations-copy.md`
- Voice guidelines implemented
- No generic co-working resort tone remains
- Live at http://65.109.113.80:3001/workations

## References
- Copy draft: `.paperclip/marketing/workations-copy.md`
- Brand facts: `/root/dostel-backend/.paperclip/MARKETING_INSTRUCTIONS.md` (Brand facts section)
- Live frontend: http://65.109.113.80:3001
