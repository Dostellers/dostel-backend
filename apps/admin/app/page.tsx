'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [stats, setStats] = useState({
    totalHostels: 0,
    hostelsWithRooms: 0,
    averageRoomsPerHostel: 0,
    loading: true,
  });

  useEffect(() => {
    const query = `
      {
        hostels {
          id
          name
          rooms {
            id
            type
            price
          }
        }
      }
    `;

    fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((result) => {
        const hostels = result.data?.hostels || [];
        const totalHostels = hostels.length;
        const hostelsWithRooms = hostels.filter(h => h.rooms?.length > 0).length;
        const averageRoomsPerHostel = totalHostels > 0
          ? hostels.reduce((sum, h) => sum + (h.rooms?.length ?? 0), 0) / totalHostels
          : 0;

        setStats({
          ...stats,
          totalHostels,
          hostelsWithRooms,
          averageRoomsPerHostel: Number(averageRoomsPerHostel.toFixed(1)),
          loading: false,
        });
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setStats({ ...stats, loading: false });
      });
  }, []);

  if (stats.loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Total Hostels</h2>
          <p className="text-3xl font-bold">{stats.totalHostels}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h2 className="text-lg font-semibold">With Rooms</h2>
          <p className="text-3xl font-bold">{stats.hostelsWithRooms}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Avg Rooms/Hostel</h2>
          <p className="text-3xl font-semibold">{stats.averageRoomsPerHostel}</p>
        </div>
      </div>
    </div>
  );
}