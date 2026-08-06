import { GraphQLClient } from 'graphql-request';
import Link from 'next/link';
import { Suspense } from 'react';

const graphcms = new GraphQLClient('http://65.109.113.80:4000/graphql');

async function getHostels() {
  const query = `
    query {
      hostels {
        id
        name
        contact {
          email
          phone
        }
        rooms {
          id
          type
          price
        }
      }
    }
  `;
  const res = await graphcms.request(query);
  return res.hostels;
}

async function HostelsList() {
  const hostels = await getHostels();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Hostels</h1>
      <div className="space-y-4">
        {hostels.map((hostel) => (
          <div key={hostel.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <Link href={`/hostels/${hostel.id}`}>
              <h2 className="text-xl font-semibold text-blue-600">{hostel.name}</h2>
            </Link>
            <p className="text-gray-600">ID: {hostel.id}</p>
            {hostel.contact && (
              <div className="mt-2 text-sm text-gray-500">
                Contact: {hostel.contact.email} | {hostel.contact.phone}
              </div>
            )}
            {hostel.rooms && hostel.rooms.length > 0 && (
              <div className="mt-2 text-sm">
                Rooms: {hostel.rooms.length} | Starting from ₹{hostel.rooms[0].price}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HostelsPage() {
  return (
    <Suspense fallback={<div>Loading hostels...</div>}>
      <HostelsList />
    </Suspense>
  );
}
