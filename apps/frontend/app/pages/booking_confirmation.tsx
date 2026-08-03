import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';

const GET_BOOKING_DETAILS = gql(
  `query GetBooking($id: ID!) {
    booking(id: $id) {
      id
      reference
      checkInDate
      checkOutDate
      totalAmount
      payment {
        status
        method
        transactionId
      }
    }
  }
`
);

const BookingConfirmation: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id') || '';
  const { data: bookingData, loading, error, refetch } = useQuery(GET_BOOKING_DETAILS, {
    variables: { id: bookingId },
    skip: !bookingId,
  });

  if (loading) return <div>Loading confirmation...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!bookingData?.booking) return <div>Booking not found.</div>;

  return (
    <div className="confirmation-container">
      <h1>Your Booking Confirmation</h1>
      <div className="booking-details">
        <p><strong>Reference:</strong> {bookingData.booking.reference}</p>
        <p><strong>Dates:</strong> {bookingData.booking.checkInDate} to {bookingData.booking.checkOutDate}</p>
        <p><strong>Total Amount:</strong> {bookingData.booking.totalAmount}</p>
        <p><strong>Status:</strong> {bookingData.booking.status}</p>
      </div>
      <div className="payment-details">
        <h2>Payment Information</h2>
        <p><strong>Method:</strong> {bookingData.booking.payment.method}</p>
        <p><strong>Transaction ID:</strong> {bookingData.booking.payment.transactionId}</p>
        <p>Payment was processed successfully on {new Date().toLocaleDateString()}</p>
      </div>
      <div className="actions">
        <button onClick={() => refetch()}>Refresh Details</button>
        <a href="/bookings">View All Bookings</a>
      </div>
    </div>
  );
};

export default BookingConfirmation;