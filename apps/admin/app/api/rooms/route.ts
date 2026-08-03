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
    const data = await fetchGraphQL(`query { rooms { id type price } }`);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name, number, roomTypeId, floor, status, capacity, maxCapacity, price, msp, additionalGuestPrice, description, features, amenities, accessibilityFeatures, view, size, bedType, petPolicy, restrictions, images, hostel } = await req.json();
  
  const mutation = `
    mutation CreateRoom($input: RoomInput!) {
      createRoom(input: $input) {
        id name type price
      }
    }
  `;
  
  try {
    const input: any = {
      name,
      number,
      roomType: roomTypeId,
      floor,
      status,
      capacity,
      maxCapacity,
      price,
      msp,
      additionalGuestPrice,
      description,
      features,
      amenities,
      accessibilityFeatures,
      view,
      size,
      bedType,
      petPolicy,
      restrictions,
      images,
      hostel
    };
    
    // Remove undefined fields
    Object.keys(input).forEach(key => input[key] === undefined && delete input[key]);
    
    const data = await fetchGraphQL(mutation, { input });
    return NextResponse.json(data.createRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  const { id, name, price, number, floor, status, capacity, maxCapacity, msp, additionalGuestPrice, description, features, amenities, accessibilityFeatures, view, size, bedType, petPolicy, restrictions, images } = await req.json();
  
  if (!id) return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
  
  const mutation = `
    mutation UpdateRoom($id: ID!, $input: RoomUpdateInput!) {
      updateRoom(id: $id, input: $input) {
        id name number type price
      }
    }
  `;

  try {
    const input: any = {
      name,
      number,
      floor,
      status,
      capacity,
      maxCapacity,
      price,
      msp,
      additionalGuestPrice,
      description,
      features,
      amenities,
      accessibilityFeatures,
      view,
      size,
      bedType,
      petPolicy,
      restrictions,
      images
    };
    
    // Remove undefined fields
    Object.keys(input).forEach(key => input[key] === undefined && delete input[key]);
    
    const data = await fetchGraphQL(mutation, { id, input });
    return NextResponse.json(data.updateRoom);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  
  if (!id) return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
  
  const mutation = `
    mutation DeleteRoom($id: ID!) {
      deleteRoom(id: $id) {
        id
      }
    }
  `;

  try {
    const data = await fetchGraphQL(mutation, { id });
    return NextResponse.json(data.deleteRoom);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
