"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeliveryBookingFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    deliveryDate: '',
    deliveryWindow: '',
    price: 0,
    status: 'PENDING',
    deliveryNotes: '',
    deliveryFee: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/delivery-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create delivery booking');
      }

      router.push('/admin/bookings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Delivery Booking</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Date
          </label>
          <input
            type="datetime-local"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-forest-500 focus:border-forest-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Window
          </label>
          <input
            type="text"
            name="deliveryWindow"
            value={formData.deliveryWindow}
            onChange={handleChange}
            placeholder="e.g., Morning (8-12), Afternoon (12-5)"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-forest-500 focus:border-forest-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-forest-500 focus:border-forest-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Fee (₹)
          </label>
          <input
            type="number"
            name="deliveryFee"
            value={formData.deliveryFee}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-forest-500 focus:border-forest-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-forest-500 focus:border-forest-500"
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Notes
          </label>
          <textarea
            name="deliveryNotes"
            value={formData.deliveryNotes}
            onChange={handleChange}
            rows={3}
            placeholder="Special instructions, delivery preferences, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-forest-500 focus:border-forest-500"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-forest-500 text-white rounded hover:bg-forest-600 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Delivery Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}