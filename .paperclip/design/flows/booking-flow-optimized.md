# Booking Flow Spec v5.0 – Optimized for Low Drop‑off

## Goal
Reduce booking drop‑off by 30 % vs. Zostel/Hosteller through a mobile‑first, state‑persistent, trust‑centric journey.

## Flow Overview
1. **Search** – destination + dates + guests (URL + localStorage)
2. **Listing** – filtered hostels, sort, view toggle
3. **Property Detail + Room Selection** – inline rooms, sticky sidebar
4. **Guest Details** – minimal fields, auto‑format
5. **Review** – full price, policies, edit inline
6. **Payment** – UPI first, Razorpay fallback
7. **Confirmation** – reference, map, calendar, receipt

## Key Enhancements
* **Persistent Search Context** – URL + React Context + localStorage
* **Inline Room Selection** – no extra page load
* **Sticky Bottom Bar** – always visible on mobile
* **Policy Pills** – 3 chips below CTA
* **Long‑Stay Toggle** – weekly/monthly rates for Dostellers
* **Trust Signals** – SocialProof badge, booking momentum
* **Reduced Touch Targets** – 44 px minimum
* **Motion** – 3 prescribed animations, respects `prefers-reduced-motion`

## Component Contracts
- `StickyBottomBar` – `pricePerNight`, `total`, `roomCount`, `isDosteller`, `onSelect`
- `PolicyPills` – `pills: [{label, type}]`
- `RoomCard` – `room`, `selected`, `onSelect`
- `StepIndicator` – `currentStep`, `totalSteps`

## Acceptance Criteria
| Category | Requirement |
|----------|-------------|
| Functional | Search state persists across refresh/back navigation; room selection updates sticky bar; price breakdown correct |
| Mobile | Sticky bar always visible; thumb‑zone CTAs; single column <768 px; native date inputs |
| Accessibility | WCAG AA contrast; focus ring 2 px Sky‑500; ARIA labels; live region announcements; reduced‑motion respected |
| Performance | Page load <2 s on 3G; CLS <0.1; no layout shift; animations performant on low‑end devices |
| Visual | No purple gradients; warm mountain palette; correct token usage; motion only from prescribed set |
| Integration | `BookingContext` hydrated from URL, localStorage, defaults; all steps share same state shape |

## Definition of Done
All components implemented, tokens applied, accessibility checks passed, verification notes documented for desktop + mobile, follow‑up tickets linked.
