import { gql, useMutation } from '@apollo/client';
import { useAuth } from '@/lib/hooks/auth.hook';

import ABookingForm, { type BookingFormValues } from './ABookingForm';

const BOOKING_MUTATION = gql`
mutation CreateBooking(
  $bookingData: BookingInput!
) {
  createBooking(input: $bookingData) {
    id
    reference
    status
    checkInDate
    checkOutDate
    totalAmount
  }
}
`;

const BookingForm: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const session = { customer: user, isAuthenticated };

  const [mutation, { loading }] = useMutation(BOOKING_MUTATION);

  const handleSubmit = (values: BookingFormValues) => {
    mutation({ variables: { bookingData: values } });
  };

  return (
    <>
      <ABookingForm
        session={session}
        onSubmit={handleSubmit}
      />
      <button
        disabled={loading || !session || !session.customer}
        className="banner"
      >
        Submit Booking
      </button>
    </>
  );
};

export default BookingForm;