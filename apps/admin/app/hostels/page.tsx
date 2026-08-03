'use client';
import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';

const GET_HOSTELS = gql`
  query GetHostels {
    hostels {
      id
      name
      city
      tagline
      totalRooms
      basePrice
      amenities {
        name
      }
    }
  }
`;

const CREATE_HOSTEL = gql`
  mutation CreateHostel($input: HostelInput!) {
    createHostel(input: $input) {
      id
      name
      city
      tagline
      totalRooms
      basePrice
      amenities {
        name
      }
    }
  }
`;

const UPDATE_HOSTEL = gql`
  mutation UpdateHostel($id: ID!, $input: HostelInput!) {
    updateHostel(id: $id, input: $input) {
      id
      name
      city
      tagline
      totalRooms
      basePrice
      amenities {
        name
      }
    }
  }
`;

const DELETE_HOSTEL = gql`
  mutation DeleteHostel($id: ID!) {
    deleteHostel(id: $id)
  }
`;

export default function HostelsPage() {
  const { data, loading, error, refetch } = useQuery(GET_HOSTELS);
  const [createHostel] = useMutation(CREATE_HOSTEL);
  const [updateHostel] = useMutation(UPDATE_HOSTEL);
  const [deleteHostel] = useMutation(DELETE_HOSTEL);
  const [hostels, setHostels] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newHostel, setNewHostel] = useState({
    name: '',
    tagline: '',
    totalRooms: '',
    basePrice: '',
    amenities: ''
  });

  if (loading) return <p>Loading hostels...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Process hostels data to handle nested amenities array
  const processedHostels = data?.hostels.map((hostel: any) => ({
    ...hostel,
    amenities: hostel.amenities.map((amenity: any) => amenity.name).join(', ')
  })) || [];

  const handleEdit = (hostel: any) => {
    setEditingId(hostel.id);
    setNewHostel({
      name: hostel.name,
      tagline: hostel.tagline || '',
      totalRooms: hostel.totalRooms?.toString() || '',
      basePrice: hostel.basePrice?.toString() || '',
      amenities: hostel.amenities || ''
    });
  };

  const handleSave = async () => {
    try {
      const input = {
        name: newHostel.name,
        tagline: newHostel.tagline,
        totalRooms: parseInt(newHostel.totalRooms) || 0,
        basePrice: parseFloat(newHostel.basePrice) || 0,
        amenities: newHostel.amenities.split(',').map((a: string) => a.trim()).filter(Boolean)
      };

      if (editingId) {
        await updateHostel({ variables: { id: editingId, input } });
      } else {
        await createHostel({ variables: { input } });
      }
      
      setEditingId(null);
      setNewHostel({
        name: '',
        tagline: '',
        totalRooms: '',
        basePrice: '',
        amenities: ''
      });
      await refetch();
    } catch (err) {
      console.error('Error saving hostel:', err);
      alert('Failed to save hostel');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewHostel({
      name: '',
      tagline: '',
      totalRooms: '',
      basePrice: '',
      amenities: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this hostel?')) {
      try {
        await deleteHostel({ variables: { id } });
        await refetch();
      } catch (err) {
        console.error('Error deleting hostel:', err);
        alert('Failed to delete hostel');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hostels Management</h1>
      
      {/* Add Hostel Form */}
      {!editingId && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Hostel</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={newHostel.name}
                onChange={(e) => setNewHostel({...newHostel, name: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tagline</label>
              <input
                type="text"
                value={newHostel.tagline}
                onChange={(e) => setNewHostel({...newHostel, tagline: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Total Rooms</label>
              <input
                type="number"
                value={newHostel.totalRooms}
                onChange={(e) => setNewHostel({...newHostel, totalRooms: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Base Price</label>
              <input
                type="number"
                value={newHostel.basePrice}
                onChange={(e) => setNewHostel({...newHostel, basePrice: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amenities (comma-separated)</label>
              <input
                type="text"
                value={newHostel.amenities}
                onChange={(e) => setNewHostel({...newHostel, amenities: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Hostel
            </button>
          </form>
        </div>
      )}
      
      {/* Edit Hostel Form */}
      {editingId && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Hostel</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={newHostel.name}
                onChange={(e) => setNewHostel({...newHostel, name: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tagline</label>
              <input
                type="text"
                value={newHostel.tagline}
                onChange={(e) => setNewHostel({...newHostel, tagline: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Total Rooms</label>
              <input
                type="number"
                value={newHostel.totalRooms}
                onChange={(e) => setNewHostel({...newHostel, totalRooms: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Base Price</label>
              <input
                type="number"
                value={newHostel.basePrice}
                onChange={(e) => setNewHostel({...newHostel, basePrice: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amenities (comma-separated)</label>
              <input
                type="text"
                value={newHostel.amenities}
                onChange={(e) => setNewHostel({...newHostel, amenities: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Save Changes
              </button>
              <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Hostels List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Hostels List</h2>
        {processedHostels.length === 0 ? (
          <p className="text-center py-8">No hostels found</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tagline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Rooms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amenities</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {processedHostels.map((hostel: any) => (
                <tr key={hostel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{hostel.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hostel.tagline}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hostel.totalRooms}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hostel.basePrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hostel.amenities}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(hostel)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(hostel.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}