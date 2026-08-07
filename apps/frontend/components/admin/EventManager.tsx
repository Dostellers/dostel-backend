import { useState } from 'react';
import EventForm from './EventForm';
import EventCalendar from './EventCalendar';

const mockEvents = [
  {
    id: '1',
    title: 'Welcome Circle',
    date: '2026-08-10',
    type: 'Welcome Circle',
    location: 'Common Area',
    capacity: 20,
    price: { amount: 0, isFree: true },
    safetyNotes: 'Social distancing encouraged',
    meetingPoint: 'Lobby',
    owner: 'staff_1',
    cancellationStatus: 'Active',
  },
  {
    id: '2',
    title: 'Shared Table Dinner',
    date: '2026-08-15',
    type: 'Shared Table',
    location: 'Dining Hall',
    capacity: 30,
    price: { amount: 10, isFree: false },
    safetyNotes: 'Mask required when not eating',
    meetingPoint: 'Dining Hall Entrance',
    owner: 'staff_2',
    cancellationStatus: 'Active',
  },
];

export default function EventManager() {
  const [events, setEvents] = useState(mockEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'calendar'

  const handleCreate = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleSave = (eventData: any) => {
    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map((e) =>
        e.id === editingEvent.id ? { ...e, ...eventData } : e
      );
      setEvents(updatedEvents);
    } else {
      // Create new event
      const newEvent = {
        id: Date.now().toString(),
        ...eventData,
      };
      setEvents([...events, newEvent]);
    }
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Staff Event Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1 rounded ${view === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            Calendar
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            New Event
          </button>
        </div>
      </div>

      {view === 'list' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Capacity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">{event.title}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{event.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{event.type}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{event.location}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{event.capacity}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {event.price.isFree ? 'Free' : `$${event.price.amount}`}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'calendar' && (
        <EventCalendar events={events} />
      )}

      {showForm && (
        <EventForm
          event={editingEvent}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}