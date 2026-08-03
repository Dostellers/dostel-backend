'use client';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider as Provider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import React from 'react';

const httpLink = new HttpLink({
  uri: 'http://65.109.113.80:4000/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export function ApolloProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  return <Provider client={client}>{children}</Provider>;
}