'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const GET_HOSTELS = gql`
  query GetHostelsForRoom {
    hostels {
      id
      name
    }
  }
`;

const CREATE_ROOM = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
      id
      number
    }
  }
`;

type Hostel = {
  id: string;
  name?: string | null;
};

export default function CreateRoom() {
  const router = useRouter();
  const { data, loading: hostelsLoading, error: hostelsError } = useQuery<{ hostels: Hostel[] }>(GET_HOSTELS);
  const [createRoom, { loading }] = useMutation(CREATE_ROOM);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const input = {
      hostel: String(formData.get('hostel') ?? ''),
      number: String(formData.get('number') ?? '').trim(),
      type: String(formData.get('type') ?? '').trim(),
      floor: Number(formData.get('floor')),
      capacity: Number(formData.get('capacity')),
      price: Number(formData.get('price')),
    };

    try {
      await createRoom({ variables: { input } });
      router.push('/rooms');
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to create room.');
    }
  };

  if (hostelsLoading) return <p className="page-state">Loading hostels...</p>;
  if (hostelsError) return <p className="page-alert">Unable to load hostels: {hostelsError.message}</p>;

  const hostels = data?.hostels ?? [];

  return (
    <main className="admin-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Inventory</span>
          <h1>Create room</h1>
          <p>Add a numbered room to an existing hostel.</p>
        </div>
      </div>

      {error && <p className="page-alert">{error}</p>}

      {hostels.length === 0 ? (
        <div className="empty-state">
          <strong>A hostel is required</strong>
          <p>Create a hostel before adding room inventory.</p>
          <Link className="primary-action action-link" href="/hostels/new">Create hostel</Link>
        </div>
      ) : (
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Hostel
            <select name="hostel" required defaultValue="">
              <option value="" disabled>Select a hostel</option>
              {hostels.map(hostel => <option key={hostel.id} value={hostel.id}>{hostel.name || 'Unnamed hostel'}</option>)}
            </select>
          </label>
          <label>
            Room number
            <input name="number" required placeholder="101" />
          </label>
          <label>
            Type
            <input name="type" required placeholder="Private double" />
          </label>
          <label>
            Floor
            <input name="floor" type="number" min="0" required />
          </label>
          <label>
            Capacity
            <input name="capacity" type="number" min="1" required />
          </label>
          <label>
            Nightly price
            <input name="price" type="number" min="0" step="0.01" required />
          </label>
          <div className="form-actions">
            <button className="primary-action" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create room'}</button>
            <Link className="secondary-action action-link" href="/rooms">Cancel</Link>
          </div>
        </form>
      )}
    </main>
  );
}
