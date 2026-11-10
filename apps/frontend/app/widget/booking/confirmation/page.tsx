"use client";

import { Suspense } from "react";
import { gql, useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { calculateNights } from "@/lib/booking-widget";

const BOOKING_QUERY = gql`
  query WidgetBookingConfirmation($id: ID!) {
    booking(id: $id) {
      id
      reference
      roomType
      checkInDate
      checkOutDate
      guests
      totalAmount
      status
      customer {
        fullName
        email
        phone
      }
      hostel {
        name
        location
      }
      payment {
        status
        method
        amount
      }
    }
  }
`;

interface BookingConfirmationData {
  booking: {
    id: string;
    reference: string;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    totalAmount: number;
    status: string;
    customer: {
      fullName: string;
      email?: string | null;
      phone: string;
    };
    hostel: {
      name?: string | null;
      location: string;
    };
    payment: {
      status: string;
      method?: string | null;
      amount: number;
    };
  };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function ConfirmationContent() {
  const bookingId = useSearchParams().get("id") || "";
  const { data, loading, error } = useQuery<BookingConfirmationData>(BOOKING_QUERY, {
    variables: { id: bookingId },
    skip: !bookingId,
  });

  if (!bookingId) {
    return <p className="text-center text-red-600">Missing booking confirmation ID.</p>;
  }

  if (loading) {
    return <p className="text-center text-stone-600">Loading confirmation...</p>;
  }

  if (error || !data?.booking) {
    return <p className="text-center text-red-600">Unable to load this booking.</p>;
  }

  const { booking } = data;
  const nights = calculateNights(booking.checkInDate.slice(0, 10), booking.checkOutDate.slice(0, 10));

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-semibold text-forest-900">Booking received</h1>
        <p className="mt-2 text-sm text-stone-500">
          Reference: <span className="font-mono font-medium text-forest-700">{booking.reference}</span>
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-5">
        <div>
          <p className="font-semibold text-forest-900">{booking.hostel.name || "Hostel booking"}</p>
          <p className="text-sm text-stone-500">{booking.hostel.location}</p>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-stone-500">Check-in</dt>
            <dd className="font-medium text-forest-900">{formatDate(booking.checkInDate)}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Check-out</dt>
            <dd className="font-medium text-forest-900">{formatDate(booking.checkOutDate)}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Stay</dt>
            <dd className="font-medium text-forest-900">{nights} {nights === 1 ? "night" : "nights"}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Guests</dt>
            <dd className="font-medium text-forest-900">{booking.guests}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Inventory</dt>
            <dd className="font-medium text-forest-900">{booking.roomType}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Total</dt>
            <dd className="font-semibold text-forest-900">₹{booking.totalAmount.toLocaleString("en-IN")}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm">
        <h2 className="font-semibold text-amber-900">Mock UPI payment</h2>
        <p className="text-amber-800">
          This prototype recorded {booking.payment.method || "UPI"} with status {booking.payment.status}. No real payment was processed.
        </p>
      </div>

      <div className="text-center text-sm text-stone-500">
        <p>{booking.customer.fullName}</p>
        <p>{booking.customer.email || booking.customer.phone}</p>
      </div>
    </div>
  );
}

export default function WidgetBookingConfirmation() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Suspense fallback={<p className="text-center text-stone-600">Loading confirmation...</p>}>
        <ConfirmationContent />
      </Suspense>
    </main>
  );
}
