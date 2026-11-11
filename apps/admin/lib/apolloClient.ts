import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Shared admin Apollo client (also used by GraphQLProvider). Point at live API.
// User: fix dashboard Apollo provider invariant.
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window === 'undefined' ? null : localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});