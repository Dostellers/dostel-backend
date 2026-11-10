import client from '../../lib/apolloClient';
import { gql } from '@apollo/client';

export async function GET() {
  const GET_CUSTOMERS_QUERY = gql`
    query GetCustomers {
      customers {
        id
        name
        email
        phone
      }
    }
  `;

  try {
    const { data } = await client.query({
      query: GET_CUSTOMERS_QUERY,
      fetchPolicy: 'network-only',
    });
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}