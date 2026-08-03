'use client';

import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Protected from '@/app/protected';
import Link from 'next/link';

const CREATE_ROOM = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
      id
      number
      type
      price
      hostel {
        name
      }
      roomType {
        name
      }
    }
  }
`;

export default function RoomCreate() {
  const [formData, setFormData] = useState({
    number: '',
    type: '',
    price: '',
    hostel: '',
    roomType: '',
    description: '',
    features: [] as string[],
    status: 'available' as const,
  });

  const [createRoom, { loading, error }] = useMutation(CREATE_ROOM, {
    onCompleted: () => {
      router.push('/admin/rooms');
    },
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const features = [...formData.features];
      if (checked) {
        features.push(name);
      } else {
        features.splice(features.indexOf(name), 1);
      }
      setFormData({ ...formData, features });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRoom({
      variables: {
        input: {
          number: formData.number,
          type: formData.type,
          price: parseFloat(formData.price),
          hostel: formData.hostel,
          roomType: formData.roomType,
          status: formData.status,
          description: formData.description,
          features: formData.features,
        }
      }
    });
  };

  const featureOptions = ['WiFi', 'Air Conditioning', 'Private Bathroom', 'Locker', 'Kitchen'];

  return (
    <Protected>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">Create Room</h1>
            {error && <p className="text-red-500 mb-4">Error: {error.message}</p>}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="private">Private Room</option>
                    <option value="dorm">Dormitory Bed</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hostel ID</label>
                <input
                  type="text"
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MongoDB ObjectId of hostel"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type ID</label>
                <input
                  type="text"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MongoDB ObjectId of room type (optional)"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {featureOptions.map(feature => (
                    <div key={feature}>
                      <input
                        type="checkbox"
                        name={feature}
                        checked={formData.features.includes(feature)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Room'}
                </button>
                <Link href="/admin/rooms">
                  <button
                    type="button"
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Protected>
  );
}