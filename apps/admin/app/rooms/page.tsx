'use client';

/* Callers: Next.js /rooms; Sidebar nav. Fix Apollo Client 4 hooks import +
   Dostel coral CTAs. Schema: rooms, createRoom, updateRoom, deleteRoom.
   User: "review and build admin dashboard end to end in dostellers colors" */

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';

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
    available: 'stamp text-success border-success/40',
    occupied: 'stamp text-warning border-warning/40',
    maintenance: 'stamp text-ink-600 border-ink-300',
    out_of_order: 'stamp text-error border-error/40',
  };
  
  return (
    <span className={statusStyles[status as keyof typeof statusStyles] || statusStyles.available}>
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
    <main className="min-h-dvh px-5 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Rooms"
          description="Inventory status across hostels — available, occupied, or offline."
          actions={
            <Button type="button" onClick={handleCreate}>Add room</Button>
          }
        />
      <Card>
        <CardContent className="pt-5">
          <div className="mb-6" />

          {rooms.length === 0 ? (
            <p className="text-center py-8">No rooms found</p>
          ) : (
            <div className="grid gap-4">
              {rooms.map((room: any) => (
                <div key={room.id} className="flex items-center justify-between gap-4 rounded-xl border border-ink-200 bg-ink-50/40 p-4">
                  <div>
                    <h3 className="font-medium text-ink-1000">Room {room.number}</h3>
                    <div className="text-sm text-ink-500">
                      {room.roomType?.name && <span>{room.roomType.name} · </span>}
                      <span>Capacity: {room.capacity}</span>
                    </div>
                    {room.description && (
                      <p className="mt-1 text-sm text-ink-600">{room.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={room.status} />
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleEdit(room)}>
                      Edit
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="text-error" onClick={() => handleDelete(room.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-1000/50 p-4" role="dialog" aria-modal="true" aria-labelledby="room-form-title">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl border border-ink-200 bg-white p-6 shadow-xl">
            <h3 id="room-form-title" className="font-[family-name:var(--font-display)] text-xl font-bold text-ink-1000">
              {editingRoom ? 'Edit room' : 'Add room'}
            </h3>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-700" htmlFor="room-number">Room number</label>
              <input
                id="room-number"
                type="text"
                value={formData.number}
                onChange={e => setFormData({...formData, number: e.target.value})}
                required
                className="flex h-11 w-full rounded-lg border border-ink-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-600"
                placeholder="e.g., 101"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-700" htmlFor="room-status">Status</label>
              <select
                id="room-status"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="flex h-11 w-full rounded-lg border border-ink-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-600"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_order">Out of Order</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-700" htmlFor="room-capacity">Capacity</label>
              <input
                id="room-capacity"
                type="number"
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 1})}
                min="1"
                required
                className="flex h-11 w-full rounded-lg border border-ink-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-700" htmlFor="room-description">Description</label>
              <textarea
                id="room-description"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-600"
                rows={2}
                placeholder="Room description"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingRoom ? 'Save' : 'Create'}
              </Button>
              <Button type="button" variant="secondary" className="flex-1" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      </div>
    </main>
  );
}