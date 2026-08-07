'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      number
      roomType {
        name
      }
      status
      capacity
      description
    }
  }
`;

const CREATE_ROOM = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
      id
      number
      status
    }
  }
`;

const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: ID!, $input: RoomUpdateInput!) {
    updateRoom(id: $id, input: $input) {
      id
      number
      status
    }
  }
`;

const DELETE_ROOM = gql`
  mutation DeleteRoom($id: ID!) {
    deleteRoom(id: $id)
  }
`;

const GET_HOSTELS = gql`
  query GetHostels {
    hostels {
      id
      name
    }
  }
`;

const GET_ROOM_TYPES = gql`
  query GetRoomTypes {
    roomTypes {
      id
      name
      hostel {
        id
        name
      }
    }
  }
`;

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    available: 'bg-green-100 text-green-800',
    occupied: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-gray-100 text-gray-800',
    out_of_order: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status as keyof typeof statusStyles] || statusStyles.available}`}>
      {status}
    </span>
  );
};

export default function RoomsPage() {
  const { data: roomsData, loading: roomsLoading, error: roomsError, refetch } = useQuery(GET_ROOMS);
  const { data: hostelsData } = useQuery(GET_HOSTELS);
  const { data: roomTypesData } = useQuery(GET_ROOM_TYPES);
  
  const [createRoom] = useMutation(CREATE_ROOM);
  const [updateRoom] = useMutation(UPDATE_ROOM);
  const [deleteRoom] = useMutation(DELETE_ROOM);
  
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [formData, setFormData] = useState({
    number: '',
    hostel: '',
    roomType: '',
    status: 'available',
    capacity: 1,
    description: '',
  });

  if (roomsLoading) return <Card className="max-w-5xl mx-auto p-6"><CardHeader><CardTitle>Loading rooms...</CardTitle></CardHeader></Card>;
  if (roomsError) return <Card className="max-w-5xl mx-auto p-6"><CardHeader><CardTitle>Error</CardTitle></CardHeader><CardContent>{roomsError.message}</CardContent></Card>;

  const rooms = roomsData?.rooms || [];

  const handleEdit = (room: any) => {
    setEditingRoom(room);
    setFormData({
      number: room.number || '',
      hostel: room.hostel?.id || '',
      roomType: room.roomType?.id || '',
      status: room.status || 'available',
      capacity: room.capacity || 1,
      description: room.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom({ variables: { id } });
        refetch();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleCreate = () => {
    setEditingRoom(null);
    setFormData({
      number: '',
      hostel: '',
      roomType: '',
      status: 'available',
      capacity: 1,
      description: '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRoom) {
        await updateRoom({
          variables: {
            id: editingRoom.id,
            input: formData
          }
        });
      } else {
        await createRoom({
          variables: {
            input: formData
          }
        });
      }
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  return (
    <div className="p-6">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Rooms Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Rooms</h2>
            <button 
              onClick={handleCreate}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Room
            </button>
          </div>

          {rooms.length === 0 ? (
            <p className="text-center py-8">No rooms found</p>
          ) : (
            <div className="grid gap-4">
              {rooms.map((room: any) => (
                <div key={room.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Room {room.number}</h3>
                    <div className="text-sm text-gray-500">
                      {room.roomType?.name && <span>{room.roomType.name} • </span>}
                      <span>Capacity: {room.capacity}</span>
                    </div>
                    {room.description && (
                      <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={room.status} />
                    <button 
                      onClick={() => handleEdit(room)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(room.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold">{editingRoom ? 'Edit Room' : 'Add Room'}</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Room Number</label>
              <input
                type="text"
                value={formData.number}
                onChange={e => setFormData({...formData, number: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="e.g., 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_order">Out of Order</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 1})}
                min="1"
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows="2"
                placeholder="Room description"
              />
            </div>

            <div className="flex space-x-2">
              <button type="submit" className="flex-1 bg-blue-500 text-white px-4 py-2 rounded">
                {editingRoom ? 'Save' : 'Create'}
              </button>
              <button type="button" onClick={handleCancel} className="flex-1 bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}