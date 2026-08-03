# Dostel Experiences Booking Brief

## Objective
Create a bookable Experiences module for on‑site activities (guided sunrise trek, eco‑workshop, cultural night) to capture ancillary revenue and differentiate from OTA competitors that treat activities as add‑ons vs. integrated packages.

## Competitive Context
- The Hosteller bundles activities into workation packages (weekend treks, community dinners)
- Competitors showcase events but Dostel's activities are listed anecdotally on site only
- Guest expectation: pre‑trip planning includes experience booking (Hostelworld data)

## Experiences to Launch (Pilot)

| Experience | Capacity | Price (₹) | Duration | Margin |
|------------|----------|-----------|----------|--------|
| Guided Sunrise Trek | 12 guests | 499 | 3 hrs | 70% |
| Eco‑Restoration Workshop | 8 guests | 299 | 2 hrs | 60% |
| Cultural Night (Bonfire + Storytelling) | 15 guests | 199 | 2 hrs | 50% |

## Requirements

### 1. Booking Flow
- Frontend `/experiences` page with real‑time availability calendar
- Add to booking cart (bundled with stay or standalone)
- Confirmation email with QR code for check‑in

### 2. Admin Backend
- Content type: `Experience { title, description, schedule, capacity, price, image }`
- Admin calendar to manage availability and cancellations
- GraphQL mutation `bookExperience(input: ExperienceInput!)`

### 3. Guest Communication
- Pre‑arrival email: "Add an experience to your stay"
- In‑app notification 30 min before scheduled activity
- Post‑activity prompt: "Leave a review and share on Dosteller board"

## Marketing Alignment
- Upsell messaging on booking confirmation: "Add a sunrise trek — ₹499"
- Dosteller perk: Priority booking for Eco‑Workshops
- Cross‑promote with Pricing Engine (bundle discount: 10% off stay + experience pack)

## Acceptance Criteria
- [ ] `/experiences` page renders real‑time availability
- [ ] Add‑to‑cart syncs with stay booking folio
- [ ] Admin can create/edit/disable experiences
- [ ] Confirmation includes QR code for on‑site check‑in
- [ ] Revenue tracked per experience (target: ₹15K/month by Q4)

## Metrics
- Target: 25% of guests book ≥1 experience during stay
- Revenue target: ₹15K/month ancillary by Q4
- Guest satisfaction lift from experiential programming (track via post‑stay NPS)

## Dependencies
- DOS‑91 (Dashboard) for activity discovery
- DOS‑92 (Pricing Engine) for bundle discounts
- DOS‑94 (Communication Hub) for pre‑arrival upsell

---
*Author: Dostel CMO | Based on competitive gap and Dostel's unique eco‑restoration narrative*