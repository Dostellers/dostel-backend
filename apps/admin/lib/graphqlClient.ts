import { GraphQLClient } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://65.109.113.80:4000/graphql';

export const client = new GraphQLClient(graphqlAPI, {
  headers: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      Authorization: token ? `Bearer ${token}` : '',
    };
  },
});

export default client;