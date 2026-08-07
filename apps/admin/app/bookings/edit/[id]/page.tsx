'use client';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const GET_BOOKING = gql`
  query GetBooking($id: ID!) {
    booking(id: $id) {
      id
      reference
      customer
      hostel
      room
      checkInDate
      checkOutDate
      totalAmount
      status
    }
  }
`;

const UPDATE_BOOKING = gql`
  mutation UpdateBooking($id: ID!, $input: BookingInput!) {
    updateBooking(id: $id, input: $input) {
      id
      reference
    }
  }
`;

export default function EditBooking() {
  const params = useParams();
  const id = params?.id as string;
  const [updateBooking] = useMutation(UPDATE_BOOKING);
  const { data, loading, error } = useQuery(GET_BOOKING, {
    variables: { id },
  });
  const router = useRouter();
  const [formData, setFormData] = useState({
    reference: '',
    customer: '',
    hostel: '',
    room: '',
    checkInDate: '',
    checkOutDate: '',
    totalAmount: 0,
    status: '',
  });

  useEffect(() => {
    if (data?.booking) {
      const booking = data.booking;
      setFormData({
        reference: booking.reference,
        customer: booking.customer?.id || booking.customer || '',
        hostel: booking.hostel?.id || booking.hostel || '',
        room: booking.room?.id || booking.room || '',
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        totalAmount: booking.totalAmount,
        status: booking.status,
      });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No booking found</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBooking({ variables: { id, input: formData } });
    router.push('/admin/bookings');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Booking</h1>
      <label>Reference: <input name="reference" value={formData.reference} onChange={handleChange} required /></label>
      <label>Customer ID: <input name="customer" value={formData.customer} onChange={handleChange} required /></label>
      <label>Hostel ID: <input name="hostel" value={formData.hostel} onChange={handleChange} required /></label>
      <label>Room ID: <input name="room" value={formData.room} onChange={handleChange} required /></label>
      <label>Check‑In: <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required /></label>
      <label>Check‑Out: <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required /></label>
      <label>Total Amount: <input type="number" step="0.01" name="totalAmount" value={formData.totalAmount} onChange={handleChange} required /></label>
      <label>Status: <input name="status" value={formData.status} onChange={handleChange} required /></label>
      <button type="submit">Update</button>
    </form>
  );
}