import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

async function fetchGraphQL(query: string, variables?: any) {
  const res = await fetch('http://65.109.113.80:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { ...variables } })
  });

  const result = await res.json();
  if (result.errors) {
    throw new Error(`GraphQL error: ${result.errors[0].message}`);
  }

  return result.data;
}

export async function GET() {
  try {
    const data = await fetchGraphQL(`query { bookings { id reference status roomType totalAmount } }`);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const payload = await req.json();
  const {
    reference,
    customerId = new ObjectId(),
    hostelId = new ObjectId(),
    roomType = 'Dorm',
    checkInDate = new Date(),
    checkOutDate = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    totalAmount = 100,
    guests = 1,
    payment = { status: 'Pending', method: 'UPI', amount: totalAmount },
    source = { name: 'Admin Panel' },
    ...rest
  } = payload;

  if (!ObjectId.isValid(customerId)) {
    return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
  }
  if (!ObjectId.isValid(hostelId)) {
    return NextResponse.json({ error: 'Invalid hostel ID' }, { status: 400 });
  }

  const mutation = `
    mutation CreateBooking($input: BookingInput!) {
      createBooking(input: $input) {
        id reference status roomType
      }
    }
  `;

  try {
    const data = await fetchGraphQL(mutation, {
      input: {
        reference,
        customerId: customerId.toString(),
        hostelId: hostelId.toString(),
        roomType,
        checkInDate: typeof checkInDate === 'string' ? checkInDate : new Date(checkInDate).toISOString(),
        checkOutDate: typeof checkOutDate === 'string' ? checkOutDate : new Date(checkOutDate).toISOString(),
        guests,
        totalAmount,
        payment,
        source,
        ...rest
      }
    });
    return NextResponse.json(data.createBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const payload = await req.json();
  const {
    id,
    customerId = new ObjectId(),
    hostelId = new ObjectId(),
    roomType = 'Dorm',
    reference,
    totalAmount,
    payment,
    status,
    guests
  } = payload;

  if (!id) return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
  if (!ObjectId.isValid(customerId)) {
    return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
  }
  if (!ObjectId.isValid(hostelId)) {
    return NextResponse.json({ error: 'Invalid hostel ID' }, { status: 400 });
  }

  const mutation = `
    mutation UpdateBooking($id: ID!, $input: BookingInput!) {
      updateBooking(id: $id, input: $input) {
        id reference status roomType totalAmount
      }
    }
  `;

  try {
    const input: any = {
      customerId: customerId.toString(),
      hostelId: hostelId.toString(),
      roomType,
      reference,
      totalAmount,
      payment,
      status,
      guests
    };
    Object.keys(input).forEach(key => input[key] === undefined && delete input[key]);

    const data = await fetchGraphQL(mutation, { id, input });
    return NextResponse.json(data.updateBooking);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const payload = await req.json();
  const { id } = payload;

  if (!id) return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });

  const mutation = `
    mutation DeleteBooking($id: ID!) {
      deleteBooking(id: $id) {
        id
      }
    }
  `;

  try {
    const data = await fetchGraphQL(mutation, { id });
    return NextResponse.json(data.deleteBooking);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
