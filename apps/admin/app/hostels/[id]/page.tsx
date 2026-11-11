'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'

// GraphQL client is already set up in the provider, but we can create a new one or use the same.
// Since we are in a client component, we can use the same Apollo Client instance as in the dashboard.
// However, to avoid creating multiple clients, we can use the same one by importing from a central place.
// For simplicity, we'll create a new client here (it's okay for this small page).
// Alternatively, we can use the same URI and create a new client each time (it's lightweight).

const clientURI = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://65.109.113.80:4000/graphql';

const GET_ALL_HOSTELS = gql`
  query GetAllHostels {
    hostels {
      id
      name
      tagline
      pricePerNight
      location {
        address {
          city
        }
      }
      images {
        thumbnail {
          url
        }
      }
      amenities
      rooms {
        number
        price
        capacity
      }
    }
  }
`;

const UPDATE_HOSTEL = gql`
  mutation UpdateHostel($id: ID!, $input: HostelInput!) {
    updateHostel(id: $id, input: $input) {
      id
      name
      tagline
      pricePerNight
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

type Hostel = {
  id: string;
  name: string;
  tagline?: string;
  pricePerNight: number;
  location: {
    address: {
      city: string;
    };
  };
  images: {
    thumbnail: {
      url: string;
    };
  }[];
  amenities: string[];
  rooms: {
    number: string;
    price: number;
    capacity: number;
  }[];
};

export default function HostelDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, refetch: refetchHostels } = useQuery(GET_ALL_HOSTELS);
  const [updateHostel] = useMutation(UPDATE_HOSTEL);
  const [deleteHostel] = useMutation(DELETE_HOSTEL);

  useEffect(() => {
    if (data) {
      const foundHostel = data.hostels.find((h: Hostel) => h.id === id);
      if (foundHostel) {
        setHostel(foundHostel);
        setLoading(false);
      } else {
        setError(`Hostel with id ${id} not found`);
        setLoading(false);
      }
    }
  }, [data, id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostel) return;

    // We'll create a simple form data object from the hostel (for now, we just update a few fields)
    // In a real app, we would have a form with inputs.
    // For simplicity, we'll just update the tagline and pricePerNight from the form state.
    // But we don't have form state yet. Let's skip the form and just show the data for now.
    // We'll implement a simple form in the next step.

    // For now, we'll just show an alert that the update is not implemented.
    alert('Update functionality not implemented yet.');
  };

  const handleDelete = async () => {
    if (!hostel) return;
    setIsDeleting(true);
    try {
      await deleteHostel({ variables: { id } });
      // Refetch the hostel list to update the cache
      await refetchHostels();
      setSuccessMessage('Hostel deleted successfully');
      // Redirect to the hostel list page (we don't have it yet, so we'll go back to the dashboard)
      // We'll change this once we have a hostel list page.
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to delete hostel');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading hostel...</div>;
  if (error) return <div className="p-6 rounded-lg bg-red-50 text-red-800">{error}</div>;
  if (!hostel) return <div className="p-6 text-gray-600">No hostel data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-stone-900">Hostel Details</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
          {successMessage && (
            <span className="px-4 py-2 bg-green-200 text-green-800 rounded">
              {successMessage}
            </span>
          )}
        </div>
      </div>

      {successMessage && !isDeleting && (
        <div className="mb-4 p-4 bg-green-100 border border-green-200 rounded">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Hostel Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700">Name</h3>
            <p className="text-lg">{hostel.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Tagline</h3>
            <p className="text-lg">{hostel.tagline || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Price per Night</h3>
            <p className="text-lg font-bold text-green-600">₹{hostel.pricePerNight}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Location</h3>
            <p className="text-lg">{hostel.location?.address?.city || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hostel.amenities.map((amenity) => (
                <span key={amenity} className="px-3 py-1 bg-gray-200 text-sm rounded">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Rooms</h3>
            <div className="space-y-2">
              {hostel.rooms.map((room) => (
                <div key={room.number} className="p-3 bg-gray-50 rounded">
                  <p className="font-medium">Room {room.number}</p>
                  <p className="text-sm">Price: ₹{room.price}</p>
                  <p className="text-sm">Capacity: {room.capacity} persons</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleUpdate}
          disabled={isDeleting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Hostel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Hostel
        </button>
      </div>
    </div>
  );
}