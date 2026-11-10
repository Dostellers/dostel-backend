'use client';

import { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Link from 'next/link';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://65.109.113.80:4000/graphql',
  cache: new InMemoryCache(),
});

const GET_ALL_HOSTELS = gql`
  query GetAllHostels {
    hostels {
      id
      name
      pricePerNight
    }
  }
`;

export default function AdminDashboard() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const { data } = await client.query({ query: GET_ALL_HOSTELS });
        setHostels(data?.hostels || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading hostels...</div>;
  if (error) return <div className="p-6 rounded-lg bg-red-50 text-red-800">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-stone-900">Admin Dashboard</h1>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Hostels</h2>
        <ul className="space-y-2">
          {hostels.map((hostel) => (
            <li key={hostel.id} className="border-b border-stone-200 pb-2">
              <Link href={`/admin/hostels/${hostel.id}`}>
                <span className="font-medium">{hostel.name}</span> - ₹{hostel.pricePerNight}/night
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}