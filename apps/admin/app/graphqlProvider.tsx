'use client'

/**
 * Apollo provider for admin App Router.
 * Caller: apps/admin/app/layout.tsx wrapping AuthGate/children.
 * Existing stub at this path imported 'eact' and did not mount ApolloProvider —
 * that is why dashboard useQuery threw "Could not find client in the context".
 * Reads NEXT_PUBLIC_GRAPHQL_URL; writes Bearer token from localStorage onto requests.
 * User query was an empty message with the Apollo invariant screenshot on /dashboard.
 */

import { useMemo } from 'react'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ApolloProvider } from '@apollo/client/react'

function createClient () {
  const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL || '/graphql'
  const httpLink = new HttpLink({ uri })
  const authLink = setContext((_, { headers }) => {
    const token =
      typeof window === 'undefined' ? null : localStorage.getItem('token')
    return {
      headers: {
        ...headers,
        Authorization: token && token !== 'admin-session' ? `Bearer ${token}` : '',
      },
    }
  })

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
    },
  })
}

export default function GraphQLProvider ({
  children,
}: {
  children: React.ReactNode
}) {
  const client = useMemo(() => createClient(), [])
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
