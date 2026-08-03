import { NextApiRequest, NextApiResponse } from 'next';

export default async function balanceRemindersApi(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const gqlQuery = `query { bookings { id reference status checkInDate checkOutDate roomType guests totalAmount payment { status method amount } balanceDue } }`;
    const response = await fetch('http://65.109.113.80:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: gqlQuery })
    });
    const data = await response.json();
    if (data.errors) {
      return res.status(500).json({ error: 'GraphQL Error', details: data.errors });
    }
    const reminders = data.data.bookings.filter((b: any) => b.balanceDue > 0 && b.payment.status !== 'Completed');
    return res.status(200).json({ reminders });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' });
  }
}
