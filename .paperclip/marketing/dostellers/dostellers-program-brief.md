# Dostellers Program Brief — v1.0

**Author:** Dostel Community Lead  
**Date:** Jul 27, 2026  
**Status:** Draft  
**Consumes:** DOS-65 (membership schema), dostellers-journey.md (design spec)  
**Prerequisite reading:** `.paperclip/design/flows/dostellers-journey.md`

---

## 1. What is Dostellers?

Dostellers = long-stay community members at Dostel Vattakanal. Not a generic loyalty program — it's the digital expression of the house culture that's been running since 1985 (Bob & Tanya, ecological restoration + community).

The program has two layers:
- **Digital layer** (PMS-managed): membership tiers, points, badges, member pricing, booking integration
- **On-ground layer** (house culture): shared meals, skillshares, treks, volunteer days, WhatsApp network

One requires the other to feel real — digital without house culture is a hollow loyalty card.

---

## 2. Membership Tiers

### Bronze (Free — instant join)
| Element | Detail |
|---------|--------|
| Cost | ₹0 (register with email/phone) |
| Discount | 10% off long-stay (7+ nights) |
| Events | Access to free community events |
| Community | Join WhatsApp group, member directory |
| Points | Earn 5 pts/₹100 spent |
| Badges | Unlockable (up to 3 badges) |

**Who it's for:** First-timers, weekend backpackers who might come back. Low friction entry.

### Silver (₹999/year)
| Element | Detail |
|---------|--------|
| Cost | ₹999/yr |
| Discount | 20% off long-stay, 10% off events |
| Events | Free entry to paid events (up to 4/yr) |
| Community | WhatsApp + welcome dinner |
| Points | Earn 10 pts/₹100 spent |
| Badges | Unlockable (all badges) |
| Perks | Dostel tumbler on first stay, birthday night free |

**Who it's for:** Returning travelers, remote workers staying 1-2 weeks.

### Gold (₹2,499/year)
| Element | Detail |
|---------|--------|
| Cost | ₹2,499/yr |
| Discount | 35% off long-stay, 20% off events |
| Events | Free entry to all paid events |
| Community | WhatsApp + welcome dinner + "Dosteller of the Month" eligibility |
| Points | Earn 15 pts/₹100 spent |
| Badges | Unlockable (all badges + exclusive Gold badge) |
| Perks | Early check-in / late checkout (subject to availability), one free night after 30 nights, priority booking for new properties |

**Who it's for:** Long-term travelers (1+ months), repeat Dostellers, digital nomads.

---

## 3. House Culture — On-Ground Program

This is what makes Dostellers real. These are recurring rituals, not one-off events.

### Weekly rhythm (Vattakanal property)
| Day | Activity | Notes |
|-----|----------|-------|
| Monday | **Community dinner** (Altaf's Cafe collab) | Family-style, ₹150 cover, Dostellers free |
| Tuesday | **Skillshare night** (cooking, guitar, yoga, coding) | Guest-led, hostel provides space |
| Wednesday | **Trek day** (Dolphin's Nose / Pillar Rocks) | Guide from village, ₹200-300 |
| Thursday | **Board game / movie night** | Common room, free |
| Friday | **Bonfire + music** | Local musicians, donations welcome |
| Saturday | **Volunteer morning** (trail cleanup, garden, composting) | Bob & Tanya legacy — ecological restoration |
| Sunday | **Rest / free day** | — |

### Special events (quarterly)
- **Dostellers Meet** — 1x quarter, BBQ + games, all members invited
- **Vattakanal Clean-Up Drive** — partnered with local orgs
- **Festival celebrations** — Pongal, Diwali, Christmas at the hostel
- **Full Moon Trek** — overnight trek to Kodaikanal viewpoint

### House rules (displayed at check-in + digital)
1. No shoes indoors
2. Quiet hours 10 PM — 7 AM
3. BYO alcohol, drink responsibly
4. No outside guests after 9 PM
5. Sort waste (compost / recycling / landfill bins in kitchen)
6. Water is precious — mountain source, use sparingly
7. Lockers provided for valuables; hostel not liable
8. Smoking in designated area only
9. Bookings are non-transferable
10. Respect the community — Dostel is home to everyone

---

## 4. Retention Loops

| Loop | Mechanism | Trigger |
|------|-----------|---------|
| **Points → Free night** | 100 pts = ₹100 off, 500 pts = free dorm night | On checkout, shown in dashboard |
| **Tier progression** | Bronze → Silver → Gold based on nights stayed | 3 nights → Bronze, 10 → Silver, 30 → Gold |
| **Badge unlocks** | 6 badges (Trailblazer, Storyteller, Social Butterfly, Remote Pro, Hometown Hero, Early Adopter) | Reviewed post-booking, post-event, post-review |
| **WhatsApp nudges** | Event reminders, "You haven't been here in 60 days" re-engagement, new property alerts | Automated via PMS + manual community-manager posts |
| **Dosteller of the Month** | Free weekend stay + featured on socials | Community-manager nomination + votes |
| **Refer-a-friend** | Referred friend gets 10% off first booking; referrer gets 500 pts | Unique referral link in dashboard |
| **Birthday perk** | Free night (Silver/Gold) or 20% off (Bronze) on birthday month | Date of birth collected at sign-up |

---

## 5. Points & Currency System

| Action | Points |
|--------|--------|
| Booking ₹100 spent | 5 / 10 / 15 (Bronze / Silver / Gold) |
| Writing a review | 50 |
| Referring a friend (after friend's first stay) | 500 |
| Attending a community event | 100 |
| Volunteering (trail cleanup, etc.) | 200 |
| Birthday bonus (Silver/Gold) | 300 |

Redemption: 100 pts = ₹100 off next booking (max 50% of booking value).

---

## 6. Guest-Experience Requirements

These are features the PMS/frontend must support to run the program. Ordered by implementation priority.

### Must-have (ship with v1)
| # | Requirement | Depends on |
|---|-------------|------------|
| R1 | Membership sign-up (Bronze free, Silver/Gold with payment) | Auth system, Razorpay |
| R2 | Member-only pricing on long-stay (7+ nights) | Room availability query (DOS-64), pricing rules |
| R3 | Points earn + display on dashboard | DOS-65 (membership models) |
| R4 | WhatsApp group auto-invite on sign-up (via wa.me link or API) | Basic backend hook |
| R5 | Events RSVP from dashboard (free for members) | Events model (exists in schema) |

### Should-have (v1.1)
| # | Requirement | Depends on |
|---|-------------|------------|
| R6 | Badge display + unlock logic | Badge model, trigger system |
| R7 | Referral link generation + tracking | Referral model |
| R8 | Birth date collection → birthday perk logic | Customer model update |
| R9 | Tiered discount auto-application at checkout | Pricing rule engine |

### Nice-to-have (v1.5+)
| # | Requirement | Depends on |
|---|-------------|------------|
| R10 | Community manager dashboard (view members, send bulk WhatsApp, badge manual award) | Admin panel |
| R11 | Points expiry logic (12 months inactivity) | Cron job |
| R12 | Dosteller profile public page (optional shareable) | Frontend route |

---

## 7. Community Manager Playbook (Process Requirements)

The PMS needs to support someone (onsite staff) running the program:

1. **Member search**: Look up Dosteller by name/email/phone
2. **Manual badge award**: After volunteer day, award "Hometown Hero" etc.
3. **WhatsApp broadcast**: Send event reminder to "active in last 30 days" members
4. **Points adjustment**: Manual +/- for house rules violations or special credit
5. **Event creation**: Create event, set member/free pricing, RSVPs visible

These are admin panel features — captured for later wave.

---

## 8. Key Assumptions (mark them)

1. Vattakanal property is the primary testbed; digital-first expansion to other properties is phase 2.
2. WhatsApp is the primary communication channel — no custom messenger needed.
3. Silver/Gold payments use Razorpay (existing requirement).
4. House culture activities are run by onsite staff / volunteers, not the app.
5. Tier progression based on nights stayed is a simple heuristic; may need adjustment after launch.
6. Referral program relies on honor system + unique links (no fraud detection v1).

---

## 9. Open Questions for PM

- Q1: Does the membership data live in `customer` model (existing) or a separate `membership` collection?
- Q2: Can Silver/Gold memberships auto-renew? Or manual annual renewal only?
- Q3: Is the events model already wired to the frontend? Can Dostellers RSVP flow through to admin?
- Q4: Who manages the WhatsApp broadcast — automated via the PMS or manual copy-paste?
- Q5: What's the pilot cohort size? 10 Dostellers to test, or open enrollment from day one?
