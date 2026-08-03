'use client';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Protected from '@/app/protected';
import Link from 'next/link';

const CREATE_BOOKING = gql`
  mutation CreateBooking({
    startDate: Date!
    endDate: Date!
    customerId: ID!
    roomId: ID!
    roomTypeId: ID
    totalPrice: Float!
  }) {
    createBooking(
      startDate: $startDate
      endDate: $endDate
      customerId: $customerId
      roomId: $roomId
      roomTypeId: $roomTypeId
      totalPrice: $totalPrice
    ) {
      id
      startDate
      endDate
      customer {
        id
        name
      }
      room {
        id
        number
        type
      }
    }
  }
`;

export default function BookingCreate() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [confirmation, setConfirmation] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [createBookingMutation, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_BOOKING);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createBookingMutation({
        variables: {
          startDate,
          endDate,
          customerId,
          roomId,
          roomTypeId,
          totalPrice
        }
      });
      setConfirmation(true);
    } catch (err) {
      setError('Error creating booking: ' + err.message);
    }
  };

  return (
    <Protected>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Booking</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Customer ID"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Room ID"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <input
                type="text"
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Room Type ID"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
              <input
                type="number"
                step="0.01"
                value={totalPrice}
                onChange={(e) => setTotalPrice(parseFloat(e.target.value))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={confirmation || mutationLoading || Boolean(error)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {confirmation ? 'Booking Confirmed' : mutationLoading ? 'Creating...' : error ? 'Error' : 'Create Booking'}
            </button>
            {confirmation && <p className="text-green-500 text-sm mb-2">Booking confirmed successfully!</p>}
          </form>
          <Link href="/bookings"
            className="mt-4 block text-blue-500 hover:underline"
          >
            Back to Bookings List
          </Link>
        </div>
      </div>
    </Protected>
  );
}
