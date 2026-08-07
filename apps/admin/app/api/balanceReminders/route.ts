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
    const data = await fetchGraphQL(`query { bookings { id reference status checkInDate checkOutDate roomType guests totalAmount payment { status method amount } balanceDue } }`);
    const reminders = data.bookings.filter((b: any) => b.balanceDue > 0 && b.payment.status !== 'Completed');
    return NextResponse.json({ reminders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
