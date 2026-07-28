# DOS-67: Customer auth mutations (signup / login / me)

**Priority:** P1 · **Area:** `apps/backend` · **Assignee:** Builder  
**Depends on:** Nothing (standalone)

---

## Why

Customer model has `password` + `accountStatus` fields and `bcryptjs` in deps, but no GraphQL auth endpoint. Without this:
- No login/signup for booking or membership flows
- No `me` query for personalized dashboard
- No JWT context for protected resolvers (future)

## What

### 1. Add GraphQL typeDefs for auth

In `apps/backend/src/schema/`:

```graphql
extend type Mutation {
  signup(input: SignupInput!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
}

extend type Query {
  me: Customer
}

type AuthPayload {
  token: String!
  customer: Customer!
}

input SignupInput {
  fullName: String!
  email: String!
  phone: String!
  password: String!
  dateOfBirth: Date
  referralCode: String
}
```

### 2. Add auth resolvers

In `apps/backend/src/resolvers/` — new file `authResolver.js`:

- `signup`: hash password with bcryptjs, create Customer, return JWT + customer
- `login`: lookup by email, bcrypt compare, return JWT + customer
- `me`: extract user from context — `context.user` already populated by `authenticate` middleware (see `src/index.js:13`)

### 3. Update resolver index

Wire `authResolver` into `src/resolvers/index.js`.

### 4. Verify

```bash
# signup
curl -X POST http://65.109.113.80:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { signup(input: { fullName: \"Test\" email: \"test@dostel.in\" phone: \"9999999999\" password: \"test1234\" }) { token customer { id fullName email } } }"}'

# login
curl -X POST http://65.109.113.80:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(email: \"test@dostel.in\" password: \"test1234\") { token customer { id fullName } } }"}'
```

## Acceptance criteria

- [ ] `signup` returns token + customer; rejects duplicate email
- [ ] `login` returns token + customer; rejects bad credentials
- [ ] `me` returns current customer when `Authorization: Bearer <token>` header sent
- [ ] `me` returns null when no token
- [ ] Backend app still boots (no runtime errors)
