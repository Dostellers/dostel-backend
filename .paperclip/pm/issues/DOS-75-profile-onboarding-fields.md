# DOS-75: Customer profile + onboarding state fields

**Priority:** P2 · **Area:** `apps/backend`  
**Assignee:** Builder  
**Source:** Dostellers v2 Gaps 1, 3  
**Depends on:** DOS-67 (auth for sign-up)

---

## Why

Several Dostellers features need new customer fields but don't yet justify their own full issue. This bundles the lightweight schema changes that enable:
- Remote worker flag (Gap 3 — workation pricing)
- Onboarding state machine (Gap 1 — welcome sequence)
- Referral tracking (Gap 5 — referral program)

These are all just schema additions + resolver pass-through. No UI yet.

## What

### 1. Add fields to Customer Mongoose model

In `apps/backend/src/models/customer.js`:

```js
// Profile (add to existing schema)
profile: {
  occupation: String,
  isRemoteWorker: { type: Boolean, default: false }
},

// Onboarding state machine
onboardingStep: {
  type: String,
  enum: ['welcome_sent', 'group_invited', 'event_offered', 'profile_quizzed', 'peer_matched', 'checkin_sent', 'complete'],
  default: null
},
onboardingStartedAt: Date,
onboardingCompletedAt: Date,

// Referral (add to existing referralCode field — already exists)
referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
```

### 2. Add fields to GraphQL typeDefs

In `apps/backend/src/schema/customerTypeDefs.js`:

```graphql
type CustomerProfile {
  occupation: String
  isRemoteWorker: Boolean
}

# Add to Customer type:
profile: CustomerProfile
onboardingStep: String
onboardingStartedAt: Date
onboardingCompletedAt: Date
referredBy: Customer
```

```graphql
input CustomerProfileInput {
  occupation: String
  isRemoteWorker: Boolean
}

# Add to CustomerInput:
profile: CustomerProfileInput
onboardingStep: String
onboardingStartedAt: Date
onboardingCompletedAt: Date
referredBy: ID
```

### 3. Resolver pass-through

The existing `createCustomer` and `updateCustomer` resolvers in `apps/backend/src/resolvers/customerResolver.js` use `new Customer(input)` and `findByIdAndUpdate(id, input)`. Mongoose will handle the nested `profile` object automatically. No resolver changes needed.

### 4. Verify

```graphql
mutation {
  updateCustomer(id: "<id>", input: {
    profile: { isRemoteWorker: true, occupation: "Software Engineer" }
  }) {
    id
    profile { isRemoteWorker occupation }
  }
}
```

## Acceptance criteria

- [ ] Customer type exposes `profile { occupation, isRemoteWorker }`
- [ ] Customer type exposes `onboardingStep`, `onboardingStartedAt`, `onboardingCompletedAt`
- [ ] Customer type exposes `referredBy` (nullable Customer ref)
- [ ] `updateCustomer` mutation can set all new fields
- [ ] Backend boots without errors
- [ ] Existing customers have null defaults (backward compatible)

## Not in scope

- Frontend UI for any of these fields
- Onboarding cron logic
- Referral payout trigger
- Remote worker pricing engine
