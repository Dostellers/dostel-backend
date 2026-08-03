'use client';

import { useMemo } from 'eact';

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://65.109.113.80:4000/graphql';

export default function GraphQLProvider({ children }) {
  return (
    <div data-graphql-client="client">
      {children}
    </div>
  );
}