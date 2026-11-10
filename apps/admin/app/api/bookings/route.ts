// apps/admin/app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';

// Create Apollo Client instance for server-side GraphQL calls
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://65.109.113.80:4000/graphql',
  }),
  cache: new InMemoryCache(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  const GET_BOOKINGS = gql`
    query GetBookings($status: String, $limit: Int, $offset: Int) {
      bookings(status: $status, limit: $limit, offset: $offset) {
        id
        reference
        status
        checkInDate
        checkOutDate
        totalAmount
        customer {
          id
          fullName
          email
          phone
        }
        hostel {
          id
          name
        }
        roomType
        createdAt
      }
    }
  `;

  try {
    const result = await client.query({
      query: GET_BOOKINGS,
      variables: { status: status || undefined, limit, offset },
      fetchPolicy: 'no-cache',
    });

    return NextResponse.json(result.data.bookings);
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const bookingData = await request.json();

    const CREATE_BOOKING = gql`
      mutation CreateBooking($input: BookingInput!) {
        createBooking(input: $input) {
          id
          reference
          status
          checkInDate
          checkOutDate
          totalAmount
          customer {
            id
            fullName
          }
          hostel {
            id
            name
          }
          roomType
        }
      }
    `;

    const result = await client.mutate({
      mutation: CREATE_BOOKING,
      variables: { input: bookingData },
      fetchPolicy: 'no-cache',
    });

    return NextResponse.json(result.data.createBooking, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json();

    const UPDATE_BOOKING = gql`
      mutation UpdateBooking($id: ID!, $input: BookingInput!) {
        updateBooking(id: $id, input: $input) {
          id
          reference
          status
          checkInDate
          checkOutDate
          totalAmount
          customer {
            id
            fullName
          }
          hostel {
            id
            name
          }
          roomType
        }
      }
    `;

    const result = await client.mutate({
      mutation: UPDATE_BOOKING,
      variables: { id, input: updateData },
      fetchPolicy: 'no-cache',
    });

    return NextResponse.json(result.data.updateBooking);
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const DELETE_BOOKING = gql`
      mutation DeleteBooking($id: ID!) {
        deleteBooking(id: $id)
      }
    `;

    await client.mutate({
      mutation: DELETE_BOOKING,
      variables: { id },
      fetchPolicy: 'no-cache',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}