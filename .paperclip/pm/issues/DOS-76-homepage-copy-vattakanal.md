# DOS-76: Homepage Copy — Vattakanal-rooted rewrite

**Author:** Dostel Content Marketer · **Date:** Jul 28, 2026  
**Priority:** P2 (content only, no schema/API changes)  
**Dependencies:** None (pure frontend copy swap)  
**Copy source:** `.paperclip/marketing/homepage-copy.md`

---

## What

Replace the current generic homepage copy (hero, value props, trust section, CTA) with copy that anchors Dostel in Vattakanal, references the Bob & Tanya (1985) story, and leads with community tone.

## Why current copy doesn't work

- "Discover Extraordinary Stays" / "Where Every Journey Becomes a Story" — generic startup, could be any travel brand
- "Curated Collections" / "Global Community" / "2M+ travelers" — invented scale, no connection to Vattakanal
- Trust badges say "500+ verified hostels" — Dostel is one hostel, not a network

## Changes required

### 1. Hero section (`app/page.tsx` lines 29-34)
Replace H1 + subtitle with:
- H1: "Welcome to Dostel / A community hostel in the mountains of Vattakanal"
- Subtitle: anchored in real place + Bob & Tanya story

### 2. Value proposition cards (lines 46-74)
Replace 3 cards:
- "Curated Collections" → "Rooted in restoration" (Bob & Tanya story)
- "Live Experiences" → "The Dostellers" (community access)
- "Global Community" → "Vattakanal, Kodaikanal" (the place)

### 3. Brand story section (new, lines ~77-113)
Insert a new section between value props and featured hostels: the Bob & Tanya founding story (2 backpackers, 1985, ecological restoration → Dostel today). No CTA — pure brand depth.

### 4. Trust badges section (lines 188-195)
Replace with badges that reflect real Dostel:
- "Real Vattakanal hostel since 1985"
- "Altaf's Cafe on property"
- "Campfire & community nights"
- "Ecologically restored grounds"

### 5. CTA section (lines 200-221)
Change heading from "Ready for your next adventure?" → "Come stay awhile"
Change CTA labels to match: "Book a room" / "Become a Dosteller"

## Acceptance criteria

- [ ] Hero H1 + subtitle reflect Vattakanal reality
- [ ] Value props reference Bob & Tanya, Dostellers, and Vattakanal
- [ ] Bob & Tanya story section exists (visual + ~80 words)
- [ ] Trust badges are real Dostel attributes, not generic
- [ ] CTA section feels like an invitation, not a booking platform
- [ ] No "2M+ travelers", "500+ hostels", or other invented scale claims
- [ ] Voice is warm, first-person plural ("we", "our"), lowercase where human
