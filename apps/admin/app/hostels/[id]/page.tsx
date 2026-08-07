'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const GET_HOSTEL = gql`
  query GetHostel($id: ID!) {
    hostel(id: $id) {
      id
      name
      slug
      description
      contact {
        email
        phone
      }
      location {
        address {
          city
          state
          country
        }
      }
      rooms {
        id
        number
        type
        price
        capacity
        status
      }
    }
  }
`;

const UPDATE_HOSTEL = gql`
  mutation UpdateHostel($id: ID!, $input: HostelInput!) {
    updateHostel(id: $id, input: $input) {
      id
      name
      slug
      description
      contact {
        email
        phone
      }
    }
  }
`;

export default function EditHostel({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_HOSTEL, {
    variables: { id },
    skip: !id,
  });

  const [updateHostel] = useMutation(UPDATE_HOSTEL, {
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    },
    refetchQueries: ['GetHostel'],
  });

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    'contact.email': '',
    'contact.phone': '',
    'location.address.city': '',
    'location.address.state': '',
    'location.address.country': '',
  });

  useEffect(() => {
    if (data?.hostel) {
      const hostel = data.hostel;
      setFormData({
        name: hostel.name || '',
        slug: hostel.slug || '',
        description: hostel.description || '',
        'contact.email': hostel.contact?.email || '',
        'contact.phone': hostel.contact?.phone || '',
        'location.address.city': hostel.location?.address?.city || '',
        'location.address.state': hostel.location?.address?.state || '',
        'location.address.country': hostel.location?.address?.country || '',
      });
    }
  }, [data]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatePayload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        contact: {
          email: formData['contact.email'],
          phone: formData['contact.phone'],
        },
        location: {
          address: {
            city: formData['location.address.city'],
            state: formData['location.address.state'],
            country: formData['location.address.country'],
          },
        },
      };

      await updateHostel({
        variables: {
          id,
          input: updatePayload,
        },
      });

      router.push('/hostels');
    } catch (err) {
      console.error('Error updating hostel:', err);
    } finally {
      setLoading(false);
    }
  };

  if (queryLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          Error loading hostel: {queryError.message}
        </div>
        <Link href="/hostels" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Hostels
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Hostel</h1>
        <Link href="/hostels" className="text-blue-600 hover:underline">
          Back to Hostels
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4">
          Hostel updated successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData['contact.email']}
                onChange={(e) => handleChange('contact.email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData['contact.phone']}
                onChange={(e) => handleChange('contact.phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData['location.address.city']}
                onChange={(e) => handleChange('location.address.city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={formData['location.address.state']}
                onChange={(e) => handleChange('location.address.state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={formData['location.address.country']}
                onChange={(e) => handleChange('location.address.country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Hostel'}
            </button>
            <Link
              href="/hostels"
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {data?.hostel?.rooms && data.hostel.rooms.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Rooms ({data.hostel.rooms.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Number</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Capacity</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.hostel.rooms.map((room) => (
                  <tr key={room.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{room.number}</td>
                    <td className="px-4 py-2">{room.type}</td>
                    <td className="px-4 py-2">₹{room.price}</td>
                    <td className="px-4 py-2">{room.capacity}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${room.status === 'available' ? 'bg-green-100 text-green-800' : room.status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {room.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
