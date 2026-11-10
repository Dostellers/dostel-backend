import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';

const GET_BOOKINGS = gql`
  query GetBookings {
    bookings {
      id
      reference
      status
      checkInDate
      checkOutDate
      totalAmount
      guestCount
      customer {
        id
        fullName
        email
        phone
      }
      hostel {
        id
        name
      }
      roomType
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_BOOKING_STATUS = gql`
  mutation ChangeBookingStatus($id: ID!, $status: String!) {
    changeBookingStatus(id: $id, status: $status) {
      id
      reference
      status
      checkInDate
      checkOutDate
      totalAmount
      guestCount
      customer {
        id
        fullName
      }
      hostel {
        id
        name
      }
    }
  }
`;

const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id)
  }
`;

const STATUSES = ['Draft', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Completed', 'Abandoned'];

export default function BookingsPage() {
  const { data, loading, error, refetch } = useQuery(GET_BOOKINGS);
  const [deleteBooking] = useMutation(DELETE_BOOKING);
  const [changeStatus] = useMutation(UPDATE_BOOKING_STATUS);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const bookings = data?.bookings || [];

  const filtered = bookings.filter((b: any) => {
    const matchesStatus = filterStatus ? b.status === filterStatus : true;
    const matchesSearch = searchTerm
      ? b.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this booking?')) {
      try {
        await deleteBooking({ variables: { id } });
        refetch();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await changeStatus({ variables: { id, status } });
      refetch();
    } catch (err) {
      console.error('Status change failed:', err);
    }
  };

  const formatDate = (dateStr: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : '-';

  const totalRevenue = filtered.reduce(
    (sum: number, b: any) => sum + (b.totalAmount || 0),
    0
  );

  if (loading) return <div className="p-6">Loading bookings...</div>;
  if (error)
    return (
      <div className="p-6 text-red-500">
        Error: {(error as any).message}
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bookings Management</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search reference or guest…"
            className="border px-3 py-1 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border px-3 py-1 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => (window.location.href = '/bookings/new')}
        >
          + New Booking
        </button>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        Total Revenue: <strong>₹{totalRevenue.toFixed(2)}</strong> | Showing{' '}
        <strong>{filtered.length}</strong> bookings
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-10">No bookings found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Reference</th>
              <th className="p-3">Guest</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b: any) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.reference}</td>
                <td className="p-3">
                  {b.customer ? (
                    <>
                      <strong>{b.customer.fullName}</strong>
                      <br />
                      {b.customer.email}
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-3">
                  {formatDate(b.checkInDate)} – {formatDate(b.checkOutDate)}
                </td>
                <td className="p-3">₹{(b.totalAmount || 0).toFixed(2)}</td>
                <td className="p-3">
                  <select
                    className="border px-2 py-1 rounded"
                    value={b.status || ''}
                    onChange={(e) =>
                      handleStatusChange(b.id, e.target.value)
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => (window.location.href = `/bookings/edit/${b.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}