# DOS-73: Code of Conduct acceptance on membership sign-up

**Priority:** P1 · **Area:** `apps/backend` + `apps/frontend`  
**Assignee:** Builder  
**Source:** Dostellers v2 Gap 8  
**Depends on:** DOS-67 (auth for sign-up), DOS-65 (membership schema)

---

## Why

Members sign up but never explicitly accept a community Code of Conduct. The WhatsApp group and events have no agreed rules. This is a legal-adjacent risk and a community health issue. The CoC exists in `.paperclip/marketing/dostellers/dostellers-iteration-v2.md`.

## What

### Backend — Schema + Model change

In `apps/backend/src/models/customer.js`, add:

```js
acceptedCodeOfConduct: { type: Boolean, default: false },
acceptedCoCAt: Date,
```

In `apps/backend/src/schema/customerTypeDefs.js`, add to `Customer` type:

```graphql
acceptedCodeOfConduct: Boolean!
acceptedCoCAt: Date
```

Add to `CustomerInput`:

```graphql
acceptedCodeOfConduct: Boolean
```

Resolvers need no change — `createCustomer` and `updateCustomer` pass input directly.

### Frontend — Checkbox on sign-up

In `apps/frontend/app/dostellers/join/page.tsx` (or wherever membership sign-up lives), add:

- Checkbox: `[ ] I agree to the Dostellers Community Code of Conduct`
- Clicking the label opens the CoC inline (expandable `<details>` element) or as a modal
- Validation: checkbox must be checked to submit
- Submit includes `acceptedCodeOfConduct: true` in the mutation

### CoC content to show

Copy from the v2 doc — exactly 6 rules:

1. Be respectful — disagree without attacking
2. No spam, no self-promotion without asking
3. Keep it safe — no sharing others' contact info without consent
4. Event RSVPs are commitments — no-show twice = event access suspended 30 days
5. Report issues to staff
6. Dostel reserves the right to remove members who violate these

## Acceptance criteria

- [ ] `customer.acceptedCodeOfConduct` stores as `true` when submitted
- [ ] `customer.acceptedCoCAt` stores timestamp
- [ ] Sign-up form blocks submission if checkbox unchecked
- [ ] CoC text visible inline (expandable) without leaving the page
- [ ] Existing customers default to `false` (no migration needed)
- [ ] Backend boots without errors
