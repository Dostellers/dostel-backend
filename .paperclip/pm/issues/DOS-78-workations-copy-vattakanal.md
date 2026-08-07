# DOS-78: Workations Page Copy — Vattakanal positioning

**Author:** Dostel Content Marketer · **Date:** Jul 28, 2026  
**Priority:** P2 (content only, no schema/API changes)  
**Dependencies:** None (pure frontend copy swap)  
**Copy source:** `.paperclip/marketing/workations-copy.md`

---

## What

Rewrite the workations page from a generic "work from anywhere" landing to an honest Vattakanal-specific pitch for remote workers. Lead with real internet specs, mountain setting, and community — not co-working buzzwords.

## Why current copy doesn't work

- "Escape your home office" / "Workations built for you" — generic, could be any brand
- Feature cards ("High-speed WiFi", "Co-working Spaces", "Cafe & Community") are identical to every workation site
- No mention of Vattakanal, mountain setting, or Dostellers community
- Missing practical details remote workers actually need (WiFi speed, power backup, timezone)

## Changes required

### 1. Hero section (lines 17-44 in `workations/page.tsx`)
Replace badge, H1, subtitle, CTA:
- Badge: "Remote work in the mountains"
- H1: "Work from Vattakanal"
- Subtitle: honest about internet, lead with community + place
- CTAs: "Book a long stay" / "See our long-stay rates"

### 2. Feature cards (lines 47-62)
Replace 4 cards with Vattakanal-specific reasons:
- "Internet that actually works" (fiber, ~50 Mbps, honest relay)
- "Your office has a view" (common room deck, Altaf's Cafe, mountain mist)
- "Community when you want it" (Dostellers, other remote workers)
- "Work less, explore more" (Dolphin's Nose, Kodaikanal Lake, trails)

### 3. Practical details table (new section after cards)
Add an honest table with: WiFi speed, power backup, workspace options, meeting rooms (none), timezone, max stay length, quiet hours, laundry.

### 4. Long-stay pricing table (new section)
Add clear per-night pricing for 3 brackets: 1-6 nights, 7-13 nights, 14+ nights. Show dorm, couple room, suite rates. Call out Dostellers additional discount.

### 5. Testimonial section (new, optional)
Placeholder format for 2 real guest quotes about working from Dostel.

## Acceptance criteria

- [ ] Hero positions Vattakanal as the reason to work here, not "workation" as a category
- [ ] Feature cards are Vattakanal-specific, not generic co-working features
- [ ] Practical details table exists with honest answers (incl. what we don't have)
- [ ] Long-stay pricing table shows clear per-night rates by duration + room type
- [ ] Mention of Dostellers discount for long-stay members
- [ ] No hustle culture language ("crush goals", "level up")
- [ ] Voice is honest about limitations (no meeting room, limited dedicated desks)
