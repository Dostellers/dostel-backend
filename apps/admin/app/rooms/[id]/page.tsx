'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const GET_ROOM = gql`
  query GetRoom($id: ID!) {
    room(id: $id) {
      id
      number
      type
      price
      capacity
      status
      description
      features
      bedType
      view
      size
      petPolicy
      restrictions
      hostel {
        id
        name
      }
      roomType {
        id
        name
      }
      amenities {
        id
        name
      }
      images {
        id
        url
        altText
      }
      accessibilityFeatures
    }
  }
`;

const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: ID!, $input: RoomInput!) {
    updateRoom(id: $id, input: $input) {
      id
      number
      type
      price
      capacity
      status
      description
      features
      bedType
      view
      size
      petPolicy
      restrictions
    }
  }
`;

export default function EditRoom({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_ROOM, {
    variables: { id },
    skip: !id,
  });

  const [updateRoom] = useMutation(UPDATE_ROOM, {
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    },
    refetchQueries: ['GetRoom'],
  });

  const [formData, setFormData] = useState({
    number: '',
    type: '',
    price: '',
    capacity: '',
    status: '',
    description: '',
    features: '',
    bedType: '',
    view: '',
    size: '',
    petPolicy: '',
    restrictions: '',
    hostelId: '',
    roomTypeId: '',
    amenityIds: '',
    imageIds: '',
    accessibilityFeatures: '',
  });

  useEffect(() => {
    if (data?.room) {
      const room = data.room;
      setFormData({
        number: room.number || '',
        type: room.type || '',
        price: room.price?.toString() || '',
        capacity: room.capacity?.toString() || '',
        status: room.status || '',
        description: room.description || '',
        features: Array.isArray(room.features) ? room.features.join(', ') : '',
        bedType: room.bedType || '',
        view: room.view || '',
        size: room.size?.toString() || '',
        petPolicy: room.petPolicy || '',
        restrictions: Array.isArray(room.restrictions) ? room.restrictions.join(', ') : '',
        hostelId: room.hostel?.id || '',
        roomTypeId: room.roomType?.id || '',
        amenityIds: Array.isArray(room.amenities) ? room.amenities.map(a => a.id).join(',') : '',
        imageIds: Array.isArray(room.images) ? room.images.map(i => i.id).join(',') : '',
        accessibilityFeatures: Array.isArray(room.accessibilityFeatures) ? room.accessibilityFeatures.join(', ') : '',
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
        number: formData.number,
        type: formData.type,
        price: formData.price ? parseFloat(formData.price) : undefined,
        capacity: formData.capacity ? parseInt(formData.capacity, 10) : undefined,
        status: formData.status,
        description: formData.description,
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        bedType: formData.bedType,
        view: formData.view,
        size: formData.size ? parseInt(formData.size, 10) : undefined,
        petPolicy: formData.petPolicy,
        restrictions: formData.restrictions ? formData.restrictions.split(',').map(r => r.trim()) : [],
        hostel: formData.hostelId,
        roomType: formData.roomTypeId,
        amenities: formData.amenityIds ? formData.amenityIds.split(',').map(id => id.trim()) : [],
        images: formData.imageIds ? formData.imageIds.split(',').map(id => id.trim()) : [],
        accessibilityFeatures: formData.accessibilityFeatures ? formData.accessibilityFeatures.split(',').map(f => f.trim()) : [],
      };

      await updateRoom({
        variables: {
          id,
          input: updatePayload,
        },
      });

      router.push('/rooms');
    } catch (err) {
      console.error('Error updating room:', err);
      setError('Failed to update room. Please try again.');
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
          Error loading room: {queryError.message}
        </div>
        <Link href="/rooms" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Room</h1>
        <Link href="/rooms" className="text-blue-600 hover:underline">
          Back to Rooms
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4">
          Room updated successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => handleChange('number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (per night)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="out_of_order">Out of Order</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => handleChange('features', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bed Type</label>
              <input
                type="text"
                value={formData.bedType}
                onChange={(e) => handleChange('bedType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
              <input
                type="text"
                value={formData.view}
                onChange={(e) => handleChange('view', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size (sq ft)</label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) => handleChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Policy</label>
              <input
                type="text"
                value={formData.petPolicy}
                onChange={(e) => handleChange('petPolicy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restrictions (comma separated)</label>
              <input
                type="text"
                value={formData.restrictions}
                onChange={(e) => handleChange('restrictions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Accessibility Features (comma separated)</label>
            <input
              type="text"
              value={formData.accessibilityFeatures}
              onChange={(e) => handleChange('accessibilityFeatures', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Room'}
            </button>
            <Link
              href="/rooms"
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
