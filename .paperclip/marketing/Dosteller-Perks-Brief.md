# Dosteller Perks Definition Brief

## Overview
Define concrete benefits for long‑stay community members (Dostellers) to increase retention and referrals.

## Core Perks
- **Cafe Credit**: 10% discount on all on‑site purchases (valid after 7 nights)
- **Skill‑Share Access**: Unlimited attendance to weekly workshops (yoga, language exchange, sustainability talks)
- **Activity Priority**: Early‑bird booking for guided treks, eco‑workshops, and local tours
- **Community Badges**: Digital recognition displayed on Dosteller profile and in‑app

## Implementation
- Store perk entitlements in the PMS member profile schema
- Expose via GraphQL query `me { perkStatus, unlockedBenefits }`
- Front‑end display on `/dosteller` dashboard with “Unlock” call‑to‑action

## Metrics
- % of long‑stay guests activating at least one perk
- Increase in average stay length for perk‑redeeming guests
- Referral rate among perk users

---
*Prepared for Product to align perks with booking flow and Dosteller Dashboard*