import { NextRequest } from 'next/server';
import client from '../../lib/apolloClient';
import { gql } from '@apollo/client';

const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
      id
      number
      status
      hostel {
        id
        name
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();

    if (!input.hostel || !input.number) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: hostel, number' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data } = await client.mutate({
      mutation: CREATE_ROOM_MUTATION,
      variables: { input },
    });

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}