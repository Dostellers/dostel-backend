# DOS-68: Frontend Apollo Client + GraphQL data layer

**Priority:** P1 · **Area:** `apps/frontend` · **Assignee:** Builder  
**Depends on:** DOS-67 (auth for token header, but not required for read queries)

---

## Why

Frontend uses only static mock data from `lib/data.ts`. Every page (hostels, rooms, events, membership) is disconnected from the backend. Need Apollo Client to:
1. Replace mock data with real GraphQL queries
2. Support auth (pass JWT token in headers after DOS-67)
3. Set up pattern for all future data fetching

## What

### 1. Install Apollo Client

```bash
cd apps/frontend && npm install @apollo/client graphql
```

### 2. Create Apollo provider wrapper

At `apps/frontend/lib/apollo-provider.tsx`:

- `ApolloClient` configured with uri `http://65.109.113.80:4000/graphql`
- Cache: `InMemoryCache`
- Link: `HttpLink` + `setContext` for auth header (reads token from `localStorage`)
- Wrap as `ApolloProvider` component using `'use client'`

### 3. Wire provider into layout

In `apps/frontend/app/layout.tsx`:
- Wrap children with `<ApolloProvider>` (conditionally — only in client components)
- Import the provider

### 4. Wire first real query: hostel listing

In `apps/frontend/lib/queries.ts` — define GQL query:
```graphql
query GetHostels {
  hostels {
    id
    name
    tagline
    basePrice
    location { address { city } }
    images { thumbnail { url } }
  }
}
```

Modify `apps/frontend/app/hostels/page.tsx`:
- Replace `import { hostels } from "@/lib/data"` with Apollo `useQuery`
- Map GraphQL response to existing component props

### 5. Remove mock data dependency for hostels page

Keep `lib/data.ts` as fallback/default — pages that are not yet GraphQL-enabled can continue using mocks.

## Acceptance criteria

- [ ] `npm run dev` in `apps/frontend` boots without errors
- [ ] Hostel listing page shows data from GraphQL (not mock)
- [ ] Apollo DevTools show queries in browser
- [ ] Network tab shows requests to `:4000/graphql`
- [ ] Auth header added when token exists in localStorage

## Files touched

- `apps/frontend/package.json` — add dep
- `apps/frontend/lib/apollo-provider.tsx` — new
- `apps/frontend/lib/queries.ts` — new (or inline)
- `apps/frontend/app/layout.tsx` — add provider
- `apps/frontend/app/hostels/page.tsx` — switch to GQL

## Not in scope

- Hostel detail page (next issue)
- Booking creation (next issue)
- Auth UI (separate issue)
