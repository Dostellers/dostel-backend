# Dosteller Dashboard Brief

## Objective
Build a minimal guest-portal page (`/dosteller`) that unifies activity access, long-stay perks, and community engagement — the #1 competitive gap identified vs. The Hosteller (Glu app) and Zostel (Zo currency).

## Key Features
1. **Activity Calendar** — upcoming guided treks, eco-workshops, cultural nights with real-time availability
2. **Perks Wallet** — visible cafe credit balance, skill-share unlocks, priority booking status
3. **Progress Tracker** — nights stayed toward Dosteller tier, eco-impact contributions
4. **Peer Connect** — lightweight guest-to-guest board for coordination (interim: integrate Hostelworld chat widget)

## Competitive Context
- The Hosteller's Glu app drives retention via door locks, food ordering, and messaging — Dostel lacks equivalent
- Zostel's Zo currency incentivizes repeat stays — Dostellers program exists but is not exposed digitally
- Dostel's eco-restoration narrative (Bob & Tanya, 1985) is unique differentiator not matched by competitors

## Implementation Notes
- Extend existing GraphQL MVP: query `me { dostellerStatus, upcomingActivities, perkWallet }`
- Link dashboard from post-booking confirmation email and profile menu
- Pilot with 2 activities (guided sunrise trek, eco-workshop)

## Metrics to Track
- Dashboard visit rate (target: 60% of returning guests)
- Activity booking conversion from dashboard (target: 30%)
- Avg stay length for dashboard users vs non-users

---
*Feed into DOS-91 (Dosteller Dashboard MVP) for Product*