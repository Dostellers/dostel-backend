# ADR-001: The guest graph runs on MongoDB, not a graph database

Status: accepted · Aug 2026
Context: DOS-500 epic; DOS-505 crossings; DOS-506 nicknames

## Question
"Are we using a graph database for this?" — asked when crossings (DOS-505)
made the guest graph an engineered thing rather than a metaphor.

## Decision
No. The guest graph lives in MongoDB (the existing store), as a `crossings`
edge collection beside `customers` and `bookings`.

## Why

**1. Our deepest query is one hop, by design.** Graph databases earn their keep
on variable-depth traversals — friend-of-friend-of-friend. DOS-505 explicitly
forbids that shape: *reunion, not discovery*. The only queries are "my
crossings" (1 hop) and "compute crossings for this booking" (an interval-overlap
join). The privacy stance and the infrastructure choice are the same fact.

**2. Crossing detection is an interval problem, not a traversal problem.**
"Who overlapped this stay" is `hostel == X AND checkIn < myOut AND
checkOut > myIn` — a compound-index range scan MongoDB does natively. A graph
database would still have to do this the same way, then build edges.

**3. Scale doesn't ask for it.** Eight properties, ~110 beds at the largest.
Seasons of bookings measure in thousands of documents. Every quality this
feature needs comes from correctness, consent handling and indexes — not from
storage exotica.

**4. Operational honesty.** This box already hosts multiple agents fighting
over dev servers. A second database means another process to supervise, back
up, and secure, paid for by every future contributor — for zero query we can
name that needs it.

**5. The escape hatch is already dug.** `crossings` IS an edge list:
`(guestA, guestB, weight, window)`. If a real multi-hop need ever appears
(it should be argued for in a new ADR, against the privacy rule above), the
collection exports to Neo4j/Memgraph mechanically, with no schema archaeology.

## Consequences
- Crossings computed at booking confirmation/check-in, stored denormalised
  with both consent states inline — one read serves the guest view.
- Compound indexes: `(hostel, checkInDate, checkOutDate)` on bookings;
  `(pairKey, hostel, overlapStart)` unique on crossings; `(guestA)`, `(guestB)`.
- A new consent purpose `guest_graph_crossings` joins the Customer consent
  enum — granular and independently withdrawable, per the DPDP pattern
  already established on the model.
