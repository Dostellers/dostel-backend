'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';

const GET_HOSTELS = gql`
  query AvailabilityHostels {
    hostels {
      id
      name
    }
  }
`;

const GET_INVENTORY_CALENDAR = gql`
  query InventoryCalendar($hostelId: ID!, $startDate: Date!, $endDate: Date!) {
    inventoryCalendar(hostelId: $hostelId, startDate: $startDate, endDate: $endDate) {
      inventoryTypeId
      roomType
      date
      total
      sold
      held
      blocked
      available
    }
  }
`;

type Hostel = { id: string; name?: string | null };
type AvailabilityDay = {
  inventoryTypeId: string;
  roomType: string;
  date: string;
  total: number;
  sold: number;
  held: number;
  blocked: number;
  available: number;
};

const dateKey = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKey(date);
};

export default function AvailabilityPage() {
  const initialStart = dateKey(new Date());
  const [hostelId, setHostelId] = useState('');
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(addDays(initialStart, 7));
  const hostelsQuery = useQuery<{ hostels: Hostel[] }>(GET_HOSTELS);
  const calendarQuery = useQuery<{ inventoryCalendar: AvailabilityDay[] }>(GET_INVENTORY_CALENDAR, {
    variables: { hostelId, startDate, endDate },
    skip: !hostelId || !startDate || !endDate || startDate >= endDate,
  });

  useEffect(() => {
    if (!hostelId && hostelsQuery.data?.hostels.length) setHostelId(hostelsQuery.data.hostels[0].id);
  }, [hostelId, hostelsQuery.data]);

  const days = calendarQuery.data?.inventoryCalendar ?? [];
  const dates = useMemo(() => Array.from(new Set(days.map((day) => day.date))), [days]);
  const inventoryTypes = useMemo(() => {
    const types = new Map<string, string>();
    days.forEach((day) => types.set(day.inventoryTypeId, day.roomType));
    return Array.from(types.entries());
  }, [days]);
  const dayMap = useMemo(() => new Map(days.map((day) => [`${day.inventoryTypeId}:${day.date}`, day])), [days]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Availability</h1>
        <p className="mt-1 text-sm text-gray-600">Room-night inventory by hostel and date.</p>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <label className="text-sm font-medium text-gray-700">
          Hostel
          <select value={hostelId} onChange={(event) => setHostelId(event.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2">
            {hostelsQuery.data?.hostels.map((hostel) => <option key={hostel.id} value={hostel.id}>{hostel.name || 'Unnamed hostel'}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          Start date
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </label>
        <label className="text-sm font-medium text-gray-700">
          End date
          <input type="date" min={addDays(startDate, 1)} value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </label>
      </div>

      {startDate >= endDate && <p className="mb-4 rounded-md bg-red-50 p-3 text-red-700">End date must be after start date.</p>}
      {hostelsQuery.error && <p className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{hostelsQuery.error.message}</p>}
      {calendarQuery.error && <p className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{calendarQuery.error.message}</p>}
      {(hostelsQuery.loading || calendarQuery.loading) && <p className="text-gray-600">Loading availability...</p>}

      {!hostelsQuery.loading && !hostelsQuery.data?.hostels.length && <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">Create a hostel to view availability.</div>}
      {hostelId && !calendarQuery.loading && !calendarQuery.error && inventoryTypes.length === 0 && <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">No active inventory types exist for this hostel.</div>}

      {inventoryTypes.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="sticky left-0 z-10 min-w-44 border-b border-r bg-gray-100 px-4 py-3">Inventory type</th>
                {dates.map((date) => <th key={date} className="min-w-28 border-b px-3 py-3 text-center">{new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })}</th>)}
              </tr>
            </thead>
            <tbody>
              {inventoryTypes.map(([typeId, roomType]) => (
                <tr key={typeId} className="border-b last:border-b-0">
                  <th className="sticky left-0 border-r bg-white px-4 py-4 text-left font-medium text-gray-900">{roomType}</th>
                  {dates.map((date) => {
                    const day = dayMap.get(`${typeId}:${date}`);
                    const tone = !day?.available ? 'bg-red-50 text-red-700' : day.available <= Math.ceil(day.total / 3) ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700';
                    return <td key={date} className="px-2 py-2 text-center"><div className={`rounded-md px-3 py-2 ${tone}`}><div className="text-lg font-bold">{day?.available ?? 0}</div><div className="text-xs">of {day?.total ?? 0} free</div></div></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
