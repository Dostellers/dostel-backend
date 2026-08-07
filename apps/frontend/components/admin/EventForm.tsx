import { useState, useEffect } from 'react';

interface EventFormProps {
  event: any;
  onSave: (event: any) => void;
  onCancel: () => void;
}

interface EventData {
  title: string;
  date: string;
  type: string;
  location: string;
  capacity: number;
  price: { amount: number; isFree: boolean };
  safetyNotes: string;
  meetingPoint: string;
}

const eventTypes = [
  'Welcome Circle',
  'Shared Table',
  'Skillshare',
  'Nature Contribution',
  'Low-key Social',
];

export default function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [form, setForm] = useState<EventData>({
    title: event?.title || '',
    date: event?.date || '',
    type: event?.type || '',
    location: event?.location || '',
    capacity: event?.capacity || 0,
    price: { amount: event?.price?.amount || 0, isFree: event?.price?.isFree ?? false },
    safetyNotes: event?.safetyNotes || '',
    meetingPoint: event?.meetingPoint || '',
  });

  useEffect(() => {
    if (event) {
      setForm((f) => ({
        ...f,
        title: event.title,
        date: event.date,
        type: event.type,
        location: event.location,
        capacity: event.capacity,
        price: { amount: event.price.amount, isFree: event.price.isFree },
        safetyNotes: event.safetyNotes,
        meetingPoint: event.meetingPoint,
      }));
    }
  }, [event]);

  const handleChange = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.date || !form.type || !form.location) {
      return;
    }

    onSave(form);
  };

  const handleDelete = () => {
    onCancel();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{event ? 'Edit Event' : 'New Event'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select type</option>
                {eventTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity *
              </label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (Free)
              </label>
              <select
                value={form.price.isFree ? 'free' : 'paid'}
                onChange={(e) =>
                  handleChange('price', { ...form.price, isFree: e.target.value === 'free' })
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Amount
            </label>
            <input
              type="number"
              value={form.price.amount}
              onChange={(e) => handleChange('price', { ...form.price, amount: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safety Notes *
            </label>
            <textarea
              value={form.safetyNotes}
              onChange={(e) => handleChange('safetyNotes', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Point *
            </label>
            <input
              type="text"
              value={form.meetingPoint}
              onChange={(e) => handleChange('meetingPoint', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {event ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}