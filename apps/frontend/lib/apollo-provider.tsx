'use client';

import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';

export const ApolloProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
