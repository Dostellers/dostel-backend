"use client";

import { useState } from "react";
import type { BookingState } from "./BookingProvider";

interface BookingSummaryProps {
  booking: BookingState;
  compact?: boolean;
}

export default function BookingSummary({ booking, compact = false }: BookingSummaryProps) {
  const [open, setOpen] = useState(false);

  const { hostel, nights, total: totalPrice } = booking;

  if (compact) {
    return (
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between rounded-lg bg-stone-200/50 px-4 py-3 text-sm transition-colors duration-150 hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-sky"
          aria-expanded={open}
        >
          <span className="font-medium text-forest-900">
            {hostel?.name || "Booking"} · {nights} {nights === 1 ? "night" : "nights"}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-forest-900">₹{totalPrice.toLocaleString()}</span>
            <svg
              className={`h-4 w-4 text-stone-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {open && <SummaryContent booking={booking} />}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
      <h3 className="font-semibold text-forest-900 text-sm">Your booking</h3>
      <SummaryContent booking={booking} />
    </div>
  );
}

function SummaryContent({ booking }: { booking: BookingState }) {
  const { hostel, checkIn, checkOut, nights, selectedRooms, total: totalPrice, guestInfo } = booking;

  const formatDate = (d: string) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-2 pt-2 text-sm">
      {hostel && (
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-forest-900">{hostel.name}</p>
            <p className="text-xs text-stone-400">{hostel.location}</p>
          </div>
        </div>
      )}

      {(checkIn || checkOut) && (
        <div className="flex gap-3 text-xs text-stone-600">
          {checkIn && (
            <div>
              <span className="text-stone-400">Check-in</span>
              <p className="font-medium text-forest-900">{formatDate(checkIn)}</p>
            </div>
          )}
          {checkOut && (
            <div>
              <span className="text-stone-400">Check-out</span>
              <p className="font-medium text-forest-900">{formatDate(checkOut)}</p>
            </div>
          )}
          {nights > 0 && (
            <div className="ml-auto">
              <span className="text-stone-400">Nights</span>
              <p className="font-medium text-forest-900">{nights}</p>
            </div>
          )}
        </div>
      )}

      {selectedRooms.length > 0 && (
        <div className="border-t border-stone-200 pt-2 space-y-1">
          {selectedRooms.map((room) => (
            <div key={room.roomId} className="flex justify-between text-xs">
              <span className="text-stone-600">
                {room.name} x{room.quantity}
              </span>
              <span className="text-forest-900 font-medium">₹{room.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {guestInfo && (
        <div className="border-t border-stone-200 pt-2 text-xs text-stone-600">
          <p>{guestInfo.fullName}</p>
          <p>{guestInfo.email}</p>
        </div>
      )}

      {totalPrice > 0 && (
        <div className="border-t border-stone-200 pt-2 flex justify-between font-semibold">
          <span className="text-forest-900">Total</span>
          <span className="text-forest-900">₹{totalPrice.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
