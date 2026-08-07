# DOS-507: The togetherness pack — first-night buddy, strangers' table, passing book, quiet signal

## Priority: P2
## Type: Product / Ops + light backend
## Parent: DOS-500 (Guest Graph)

### Source
- Founder direction, Aug 7 2026: "increase inclusivity and togetherness which is
  the vibe of Dostellers"
- Design contribution: four mechanics that need almost no software and deliver
  the vibe faster than any feature with a schema

### The four mechanics

**1. First-night buddy.** The loneliest person in a hostel is the solo traveller
on night one; the person who best remembers that feeling arrived yesterday.
At check-in, a solo guest can opt into being introduced to a "second-nighter"
who volunteered at their own check-in. Costs a WhatsApp message. No profiles, no
matching algorithm — recency is the algorithm.

**2. Table for strangers.** One table at every property, every dinner, where
sitting down means "talk to me". Physically: a painted table. Digitally: RSVP
from the property page so a solo guest knows before booking that tonight they
will not eat alone. Seats capped at 6 — small enough that nobody hides.

**3. The passing book.** A note left for the *next occupant of your bed*:
"top bunk light flickers — the 6am mist from the deck is worth getting up for."
Bed-to-bed messages across time. Digital capture (QR at the bunk), moderated by
staff before display, shown at check-in. The guestbook, made granular.

**4. The quiet signal.** Inclusivity includes introverts. A guest can set
"reading tonight" — visible on the common-room board — and every mechanic above
respects it: no buddy intro, no table prompt, no nudges. Togetherness that can't
be declined is pressure, not belonging.

### Why this order
1 and 4 ship together (they are one consent surface). 2 is paint plus an RSVP
field. 3 needs light moderation tooling. None requires the full graph — but all
four get better when it lands (a passing-book note from someone you later cross
paths with is a small miracle).

### Acceptance Criteria
- [ ] Check-in flow captures: buddy opt-in (offer/accept), quiet signal
- [ ] Property page: strangers' table RSVP with visible seat count (max 6)
- [ ] Passing book: capture → staff moderation queue → display at check-in
- [ ] Quiet signal suppresses every prompt from this pack, everywhere
- [ ] Metrics: buddy intros made, table seats filled, notes left/read, and the
      one that matters — % of solo guests who report meeting someone (exit survey)
