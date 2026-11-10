// src/pages/BookingPage.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '@/lib/hooks/auth.hook';
import RoomSelector from 'components/RoomSelector';
import BookingSummary from 'components/BookingSummary';
import ConfirmationCard from 'components/ConfirmationCard';
import CheckoutWizard from '@/components/CheckoutWizard';
import { GET_HOSTEL_DETAILS, GET_HOSTELS } from '@/lib/queries';

const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
      reference
      status
      checkInDate
      checkOutDate
      totalAmount
      depositPercentage
      depositRequired
      amountPaid
      balanceDue
    }
  }
`;

export default function BookingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [createBooking, { loading, error: bookingError, data: bookingData }] = useMutation(CREATE_BOOKING);

  const [booking, setBooking] = useState<{
    hostelId: string | null;
    roomId: string | null;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    totalAmount: number;
    paymentMethod: string;
    transactionId?: string;
    chargeId?: string;
  }>({
    hostelId: null,
    roomId: null,
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    totalAmount: 0,
    paymentMethod: '',
  });

  const handleRoomSelect = (roomId: string, price: number) => {
    if (!booking.checkInDate || !booking.checkOutDate) {
      alert('Please select check-in and check-out dates first');
      return;
    }
    const days = Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24));
    setBooking(prev => ({
      ...prev,
      roomId,
      totalAmount: price * days,
    }));
  };

  const handleSubmit = async () => {
    if (!booking.hostelId || !booking.roomId || !isAuthenticated || !user) {
      alert('Please complete all booking details and ensure you are logged in');
      return;
    }

    const customerId = (user as any)?.id || user?.email;

    try {
      const result = await createBooking({
        variables: {
          input: {
            customerId,
            hostelId: booking.hostelId,
            roomType: booking.roomId,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            guests: booking.guests,
            totalAmount: booking.totalAmount,
            payment: {
              method: booking.paymentMethod,
              amount: booking.amountPaid || 0,
              transactionId: booking.transactionId || 'pending',
            },
          },
        },
      });

      if (result.data?.createBooking) {
        router.push(`/booking-success?reference=${result.data.createBooking.reference}`);
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      alert('Failed to create booking. Please try again.');
    }
  };

  const { data: hostelsData } = useQuery(GET_HOSTELS);

  if (bookingData?.createBooking) {
    return (
      <ConfirmationCard
        booking={bookingData.createBooking}
        onNewBooking={() => setBooking({ ...booking, hostelId: null, roomId: null })}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {bookingError && <p className="text-red-500">Error: {(bookingError as any).message}</p>}
      {!booking.hostelId ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Select a Hostel</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostelsData?.hostels?.map((h: any) => (
              <div
                key={h.id}
                className="border rounded p-4 cursor-pointer hover:shadow-lg"
                onClick={() => setBooking(prev => ({ ...prev, hostelId: h.id }))}
              >
                <h3 className="font-bold">{h.name}</h3>
                <p className="text-sm text-gray-600">{h.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Book Your Stay</h1>
            <p className="text-gray-600">Hostel ID: {booking.hostelId}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Check-in Date</label>
              <input
                type="date"
                className="input"
                value={booking.checkInDate}
                onChange={e => setBooking(p => ({ ...p, checkInDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-medium">Check-out Date</label>
              <input
                type="date"
                className="input"
                value={booking.checkOutDate}
                onChange={e => setBooking(p => ({ ...p, checkOutDate: e.target.value }))}
                required
              />
            </div>
          </div>

          {booking.checkInDate && booking.checkOutDate && (
            <>
              <RoomSelector
                hostelId={booking.hostelId}
                checkIn={booking.checkInDate}
                checkOut={booking.checkOutDate}
                onSelect={handleRoomSelect}
              />
              {booking.roomId && (
                <BookingSummary
                  checkInDate={booking.checkInDate}
                  checkOutDate={booking.checkOutDate}
                  roomId={booking.roomId}
                  hostelId={booking.hostelId}
                  guests={booking.guests}
                  totalAmount={booking.totalAmount}
                />
              )}
            </>
          )}

          {booking.roomId && (
            <>
              <div className="border-t pt-4">
                <h2 className="text-lg font-bold mb-2">Process Payment</h2>
                <CheckoutWizard
                  totalAmount={booking.totalAmount}
                  onPaymentSelect={method => setBooking(p => ({ ...p, paymentMethod: method }))}
                />
                <button
                  className="btn btn-primary w-full mt-4"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}