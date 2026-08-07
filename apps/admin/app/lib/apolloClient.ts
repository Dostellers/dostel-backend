// Generated Apollo Client configuration
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://65.109.113.80:4000/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});

export default client;