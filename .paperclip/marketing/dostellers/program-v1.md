# Dostellers Community Program v1

**Status:** Pilot proposal  
**Property:** Dostel, Vattakanal  
**Audience:** Guests staying 7+ nights, especially remote workers and repeat guests

## Value proposition

Dostellers turns a long stay into participation in Dostel’s community: recurring activities, introductions to other long-stay guests, and opportunities to contribute locally. It reflects Dostel’s ecological restoration and community inspiration from Bob and Tanya (1985); it is not positioned as a generic loyalty scheme.

## Pilot membership

Launch one simple membership before testing paid tiers.

### Dosteller

**Eligibility:** A confirmed stay of 7+ nights, or 10 cumulative nights across completed stays.  
**Access period:** From confirmation until 30 days after checkout. Returning eligible guests regain access.

**Benefits:**
- Weekly activities calendar and RSVP access
- Opt-in Dostellers WhatsApp group
- Welcome introduction during the first 48 hours
- Access to guest-led skillshares and volunteer activities
- Long-stay offer shown during booking, subject to an approved pricing rule

Do not promise discounts, free nights, merchandise, or paid tiers until operations and unit economics approve them.

## Community rhythm

Use a small repeatable schedule rather than daily programming:

- **Welcome circle:** twice weekly; introductions, local orientation, house culture
- **Shared table:** weekly communal meal; price and capacity set per event
- **Skillshare:** weekly, guest- or local-led
- **Nature contribution:** fortnightly cleanup, garden, composting, or restoration activity
- **Low-key social:** weekly games, film, or acoustic session within quiet hours

Every event needs an owner, capacity, price/free status, meeting point, safety note, and cancellation status. Treks require an approved local guide and weather check.

## House culture

- Respect quiet hours and shared spaces.
- Ask consent before adding guests to groups, photographing them, or sharing contact details.
- Sort waste and use water carefully.
- Participation is optional; membership never creates unpaid work obligations.
- Activities must be inclusive of solo travelers, couples, and different comfort levels.
- Staff can remove access for harassment, unsafe behavior, or repeated rule violations through a documented review.

## Retention loop

1. **Before arrival:** Show stay-date activities without blocking checkout.
2. **Check-in:** Invite eligible guests to opt in and accept the community code.
3. **First 48 hours:** Welcome circle and one relevant activity suggestion.
4. **During stay:** Weekly calendar, RSVP reminders, and staff check-in after seven nights.
5. **Checkout:** Ask one short satisfaction question and permission for future updates.
6. **After stay:** Send a neutral return invitation after 60–90 days; no automated incentives in v1.

## Product requirements for PM/Builder

### P0 — Membership page

- Explain eligibility, current benefits, optional participation, and conduct expectations.
- Show only operationally approved benefits.
- Record consent separately for code acceptance, WhatsApp group access, and marketing.
- Allow guests to leave the community group without affecting their booking.

### P0 — Long-stay booking

- Detect stays of 7+ nights and show the approved long-stay offer.
- Preview published activities overlapping the selected stay dates.
- Community-data failure must not block booking.
- Persist eligibility against the confirmed booking, not merely search dates.

### P1 — Events

- Staff can create, edit, publish, cancel, and set capacity for an activity.
- Eligible guests can view details and RSVP or cancel.
- Staff can view attendee counts; waitlists and automated messaging are later scope.
- RSVP records must not expose attendee contact information to other guests.

### P1 — Community operations

- Staff can search eligible/current Dostellers.
- Staff can record onboarding and code acceptance.
- Staff can export an opt-in contact list for manual communication.
- Staff can revoke community access without altering the underlying booking.

## Pilot measures

Track weekly:
- Eligible guests and opt-in rate
- Welcome-circle participation
- RSVP-to-attendance rate
- Percentage attending at least one activity
- Seven-night check-in satisfaction
- Code-of-conduct incidents
- Return-booking intent at checkout

## Assumptions requiring PM/operations approval

- Seven nights is the initial long-stay threshold.
- Vattakanal is the only v1 pilot property.
- WhatsApp communication is manual and opt-in.
- No paid tiers, points, badges, referrals, or automatic lifecycle campaigns ship in this pilot.
- Event schedule, prices, staffing, safety procedures, and long-stay pricing remain operational decisions.

## Recommended issue sequence

1. Membership eligibility, consent, and access state
2. Long-stay offer plus stay-date activity preview
3. Staff event publishing and guest RSVP
4. Community manager member list and manual outreach export
5. Pilot analytics snapshot
