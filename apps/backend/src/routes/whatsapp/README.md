# Guest memory (DOS-502)

Staff send a note — "Priya doesn't eat dairy" — and it becomes a structured fact
on that guest's record, so what the house knows survives a shift change.

## Pieces

| Piece | Location |
|---|---|
| WhatsApp webhook | `src/routes/whatsapp/index.js` |
| Extraction (Claude) | `src/services/guestMemoryService.js` |
| Transcription interface | `src/services/transcriptionService.js` |
| Facts on the customer | `src/models/customer.js` → `guestFacts[]` |
| Staff surfacing + review queue | `src/routes/admin/customers.js` |
| Guest access + erasure | `myGuestFacts` / `deleteMyGuestFact` (GraphQL) |
| Tests | `test/guestMemory.test.js`, `test/whatsappStaffCapture.test.js`, `test/guestFactAccess.test.js` |

## Before first run

1. Set `ANTHROPIC_API_KEY`, `WHATSAPP_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`,
   `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and
   `WHATSAPP_STAFF_NUMBERS` — see `.env.example`.
2. Point the Meta app's webhook at `POST /api/whatsapp/staff` and subscribe to
   `messages`.
3. Send one real note and check the extraction before trusting it. The request
   shape is verified against the API reference and the tests, not against a live
   response.

## Voice notes do not work yet

Claude has no audio input, so voice notes need a separate speech-to-text service,
and `TRANSCRIPTION_PROVIDER` is deliberately unset. Staff at Vattakanal mix Tamil,
Hindi and English inside single sentences; providers vary a lot on code-switched
Indian speech, and a bad transcript does not fail loudly — it produces a
confident-looking guest fact that is wrong.

While unset, text notes work end to end and a voice note gets an honest reply
asking the staff member to type it. Register a provider with
`transcriptionService.registerProvider(name, fn)` at startup and set
`TRANSCRIPTION_PROVIDER` to that name.

## Rules the model does not decide

Extraction proposes; policy disposes. These are enforced in code and asserted in
tests, because a wrong extraction would otherwise violate them:

- **Cautions are staff-only**, always, whatever the model returns. They never
  reach the guest dashboard or an automated message.
- **Cautions and low-confidence facts queue for review** and surface nowhere
  until a human approves them.
- **Every fact expires** — 30 days for stay-scoped, ~6 months for seasonal, ~3
  years for standing facts. Stale preferences are worse than none.
- **Every fact names who captured it.** There are no anonymous notes about
  guests; the model rejects a fact with no `capturedBy`.
- **Ambiguous subjects are never guessed.** Two guests named Priya means the bot
  asks rather than picking one. A fact on the wrong guest is worse than no fact.

## Review workflow

```
GET    /api/admin/customers/guest-facts/review-queue   pending items, newest first
PATCH  /api/admin/customers/:id/guest-facts/:factId    { reviewStatus: approved | rejected }
GET    /api/admin/customers/:id/guest-facts            staff view, grouped by category
DELETE /api/admin/customers/:id/guest-facts/:factId    erasure over the desk
```

## Guest rights (DPDP Act 2023)

`myGuestFacts` is the right of access; `deleteMyGuestFact` is the right of
erasure. Both require a signed-in **guest** — a staff token is rejected, since
those fields mean "mine". A guest can only delete facts they can see; a request
for a staff-only note returns the same answer as a request for one that does not
exist, so the response does not confirm it is there.
