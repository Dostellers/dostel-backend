import { gql, useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Suspense } from 'react';

const GET_HOSTELS = gql`
  query GetHostels {
    hostels {
      id
      name
      city
      tagline
      pricePerNight
      isActive
      createdAt
      rooms {
        id
        roomType
        price
      }
    }
  }
`;

const DELETE_HOSTEL = gql`
  mutation DeleteHostel($id: ID!) {
    deleteHostel(id: $id) {
      id
    }
  }
`;

function HostelsList() {
  const { data, loading, error, refetch } = useQuery(GET_HOSTELS);
  const [deleteHostel] = useMutation(DELETE_HOSTEL);

  if (loading) return <div>Loading hostels...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const hostels = data?.hostels || [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hostel?')) {
      try {
        await deleteHostel({ variables: { id } });
        refetch();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Hostels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hostels.map((hostel) => (
          <div key={hostel.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/hostels/${hostel.id}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800">{hostel.name}</h2>
            </Link>
            <div className="mt-2 space-y-1 flex flex-col md:flex-row justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">City:</span> {hostel.city || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tagline:</span> {hostel.tagline || ''}
                </p>
                <p className="text-sm font-semibold text-green-600">
                  Price: {hostel.pricePerNight ? `₹${hostel.pricePerNight}` : '₹0'}
                </p>
              </div>
              <div className="space-y-1 flex space-x-2 items-start">
                <p className="text-sm text-gray-500">
                  Status: <span className={hostel.isActive ? 'text-green-600' : 'text-red-600'}>
                    {hostel.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(hostel.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Created: {new Date(hostel.createdAt).toLocaleDateString()}
            </p>
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