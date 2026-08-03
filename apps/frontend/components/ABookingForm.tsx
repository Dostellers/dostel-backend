'use client';

import { useState } from 'react';

export interface BookingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
}

type Props = {
  session: { customer: unknown };
  onSubmit: (values: BookingFormValues) => void;
};

export default function ABookingForm({
  session,
  onSubmit,
}: Props) {
  const [formData, setFormData] = useState<BookingFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          First Name
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Last Name
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Check-In
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Check-Out
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <button type="submit" disabled={!session?.customer}>
        Submit Booking
      </button>
    </form>
  );
}