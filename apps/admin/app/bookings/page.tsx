'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';

const GET_BOOKINGS = gql`
  query GetBookings {
    bookings {
      id
      reference
      roomType
      checkInDate
      checkOutDate
      guests
      totalAmount
      amountPaid
      balanceDue
      status
      customer {
        fullName
        email
      }
      hostel {
        name
      }
    }
  }
`;

const CHANGE_BOOKING_STATUS = gql`
  mutation ChangeBookingStatus($id: ID!, $status: String!) {
    changeBookingStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

type Booking = {
  id: string;
  reference: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: string;
  customer: { fullName?: string; email?: string };
  hostel: { name?: string };
};

const nextActions: Record<string, { label: string; status: string }[]> = {
  Draft: [{ label: 'Confirm', status: 'Confirmed' }],
  Confirmed: [{ label: 'Check in', status: 'CheckedIn' }],
  CheckedIn: [{ label: 'Check out', status: 'CheckedOut' }],
  CheckedOut: [{ label: 'Complete', status: 'Completed' }]
};

const formatMoney = (amount: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(amount || 0);

export default function BookingsPage() {
  const { data, loading, error, refetch } = useQuery<{ bookings: Booking[] }>(GET_BOOKINGS);
  const [changeStatus] = useMutation(CHANGE_BOOKING_STATUS);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    setActionError(null);

    try {
      await changeStatus({ variables: { id, status } });
      await refetch();
    } catch (mutationError) {
      setActionError(mutationError instanceof Error ? mutationError.message : 'Could not update booking');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="page-state">Loading bookings…</div>;
  if (error) return <div className="page-state page-error">Could not load bookings: {error.message}</div>;

  const bookings = data?.bookings ?? [];

  return (
    <main className="admin-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Bookings</h1>
          <p>Confirm arrivals and move guests through check-in and check-out.</p>
        </div>
        <div className="booking-count">{bookings.length} bookings</div>
      </div>

      {actionError && <div className="page-alert" role="alert">{actionError}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">No bookings found.</div>
      ) : (
        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Guest</th>
                <th>Stay</th>
                <th>Guests</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.reference}</strong>
                    <span>{booking.hostel?.name || 'Hostel unavailable'}</span>
                  </td>
                  <td>
                    <strong>{booking.customer?.fullName || 'Guest unavailable'}</strong>
                    <span>{booking.customer?.email}</span>
                  </td>
                  <td>
                    <strong>{booking.roomType}</strong>
                    <span>
                      {new Date(booking.checkInDate).toLocaleDateString('en-IN')} – {new Date(booking.checkOutDate).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td>{booking.guests}</td>
                  <td>
                    <strong>{formatMoney(booking.amountPaid)} paid</strong>
                    <span>{formatMoney(booking.balanceDue)} due</span>
                  </td>
                  <td><span className={`status-pill status-${booking.status.toLowerCase()}`}>{booking.status}</span></td>
                  <td>
                    <div className="booking-actions">
                      {(nextActions[booking.status] ?? []).map((action) => (
                        <button
                          key={action.status}
                          type="button"
                          className="primary-action"
                          disabled={updatingId === booking.id}
                          onClick={() => handleStatusChange(booking.id, action.status)}
                        >
                          {updatingId === booking.id ? 'Updating…' : action.label}
                        </button>
                      ))}
                      {!['Completed', 'Abandoned'].includes(booking.status) && (
                        <button
                          type="button"
                          className="secondary-action"
                          disabled={updatingId === booking.id}
                          onClick={() => handleStatusChange(booking.id, 'Abandoned')}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
