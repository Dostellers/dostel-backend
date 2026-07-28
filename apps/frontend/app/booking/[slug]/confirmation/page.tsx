"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationCard from "@/components/ConfirmationCard";
import { getConfirmationData, clearConfirmation } from "@/components/BookingProvider";
import type { BookingState } from "@/components/BookingProvider";

function generateRef(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DOS-${y}-${m}-${random}`;
}

function buildConfirmation(
  data: BookingState,
): {
  ref: string;
  hostelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomName: string;
  total: number;
} {
  return {
    ref: generateRef(),
    hostelName: data.hostel?.name || "Dostel Property",
    location: data.hostel?.location || "",
    checkIn: data.checkIn || "",
    checkOut: data.checkOut || "",
    nights: data.nights || 0,
    roomName: data.selectedRooms.map((r) => `${r.name} x${r.quantity}`).join(", ") || "Selected room",
    total: data.total || 0,
  };
}

export default function BookingConfirmationPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [booking, setBooking] = useState<ReturnType<typeof buildConfirmation> | null>(null);
  const [guestEmail, setGuestEmail] = useState("");

  useEffect(() => {
    const data = getConfirmationData();
    if (!data) {
      router.replace(`/hostels/${params.slug}`);
      return;
    }
    setBooking(buildConfirmation(data));
    setGuestEmail(data.guestInfo?.email || "your@email.com");
    clearConfirmation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!booking) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-6 sm:px-6 lg:pb-12">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest-100 border-t-forest-500" role="status">
            <span className="sr-only">Loading confirmation...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-6 sm:px-6 lg:pb-12">
      <ConfirmationCard
        booking={booking}
        contactEmail={guestEmail}
        contactPhone={"+91 XXXXX-XXXXX"}
      />
    </div>
  );
}
