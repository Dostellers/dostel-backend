import { NextApiRequest, NextApiResponse } from 'next';

export default async function hostelsApi(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const gqlQuery = 'query { hostels { id name tagline location } }';
      
      const response = await fetch('http://65.109.113.80:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: gqlQuery })
      });
      
      const data = await response.json();
      return res.status(200).json(data);
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}