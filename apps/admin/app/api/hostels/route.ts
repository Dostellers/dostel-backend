import { NextResponse } from 'next/server';

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
    const data = await fetchGraphQL(`query { hostels { id name tagline basePrice location { address { city } } images { thumbnail { url } } } }`);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name, tagline, basePrice, location, images } = await req.json();
  
  const mutation = `
    mutation CreateHostel($input: HostelInput!) {
      createHostel(input: $input) {
        id name tagline
      }
    }
  `;
  
  try {
    const data = await fetchGraphQL(mutation, { input: { name, tagline, basePrice, location, images } });
    return NextResponse.json(data.createHostel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { id, name, tagline, basePrice, location, images } = await req.json();
  
  if (!id) return NextResponse.json({ error: 'Hostel ID is required' }, { status: 400 });
  
  const mutation = `
    mutation UpdateHostel($id: ID!, $input: HostelInput!) {
      updateHostel(id: $id, input: $input) {
        id name tagline basePrice
      }
    }
  `;
  
  try {
    const input: any = { name, tagline, basePrice, location, images };
    Object.keys(input).forEach(key => input[key] === undefined && delete input[key]);
    
    const data = await fetchGraphQL(mutation, { id, input });
    return NextResponse.json(data.updateHostel);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  
  if (!id) return NextResponse.json({ error: 'Hostel ID is required' }, { status: 400 });
  
  const mutation = `
    mutation DeleteHostel($id: ID!) {
      deleteHostel(id: $id) {
        id
      }
    }
  `;
  
  try {
    const data = await fetchGraphQL(mutation, { id });
    return NextResponse.json(data.deleteHostel);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
