"use client";

import { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import { calculateNights } from "@/lib/booking-widget";
import { FIND_OR_CREATE_CUSTOMER } from "@/lib/queries";

const ROOM_AVAILABILITY_QUERY = gql`
  query RoomAvailability($hostelId: ID!, $checkIn: Date!, $checkOut: Date!) {
    roomAvailability(hostelId: $hostelId, checkIn: $checkIn, checkOut: $checkOut) {
      roomType
      pricePerNight
      availableRooms
      roomId
    }
  }
`;

interface AvailableRoom {
  roomId: string;
  roomType: string;
  pricePerNight: number;
  availableRooms: number;
}

const CREATE_BOOKING_MUTATION = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
      reference
      status
    }
  }
`;

export default function BookingWidget() {
  const router = useRouter();
  const params = useParams();
  const hostelIdFromUrl = params.hostelId as string || "";

  // Form state
  const [hostelId, setHostelId] = useState(hostelIdFromUrl);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<{
    roomId: string;
    roomType: string;
    pricePerNight: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createBooking] = useMutation(CREATE_BOOKING_MUTATION);
  const [findOrCreateCustomer] = useMutation(FIND_OR_CREATE_CUSTOMER);

  // Sync URL param with state
  useEffect(() => {
    if (hostelIdFromUrl && hostelIdFromUrl !== hostelId) {
      setHostelId(hostelIdFromUrl);
    }
  }, [hostelIdFromUrl, hostelId]);

  // Compute derived values
  const nights = calculateNights(checkIn, checkOut);
  const totalAmount = nights > 0 && selectedRoom ? selectedRoom.pricePerNight * nights : 0;

  // Handle date changes
  const handleDateChange = (field: "checkIn" | "checkOut", value: string) => {
    if (field === "checkIn") setCheckIn(value);
    if (field === "checkOut") setCheckOut(value);
  };

  // Submit booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    if (nights < 1) {
      setError("Check-out must be after check-in");
      return;
    }

    try {
      setLoading(true);

      // Live guest flow: find or create customer
      const customerVars = { email, fullName, phone };
      const customerResult = await findOrCreateCustomer({
        variables: customerVars,
      });
      const customerId = customerResult.data.findOrCreateCustomer.id;

      const input = {
        reference: `DIRECT-${Date.now()}`,
        customerId,
        hostelId,
        roomType: selectedRoom?.roomType,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests,
        totalAmount,
        payment: {
          status: "Pending",
          method: "Mock UPI",
          amount: totalAmount,
        },
        source: {
          name: "Direct Booking Widget",
        },
        status: "Draft" as const,
      };

      await createBooking({
        variables: { input },
      });
      router.push("/widget/booking/confirmation");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError(String(err.message));
      } else {
        setError("Booking failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Apollo query hook for room availability
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(
    ROOM_AVAILABILITY_QUERY,
    {
      variables: { hostelId, checkIn, checkOut },
      skip: !(hostelId && checkIn && checkOut),
    }
  );
  const rooms: AvailableRoom[] = queryData?.roomAvailability || [];
  const fetchError = queryError?.message ?? "";

  const isBookingReady = selectedRoom && hostelId && checkIn && checkOut && nights >= 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Direct Booking Widget</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm">
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
            <input
              type="text"
              value={hostelId}
              onChange={(e) => setHostelId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Hostel ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check‑In</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => handleDateChange("checkIn", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check‑Out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => handleDateChange("checkOut", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {hostelId && checkIn && checkOut && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Room</label>
              <select
                value={selectedRoom?.roomId || ""}
                onChange={(e) => {
                  const roomId = e.target.value;
                  if (roomId) {
                    const selected = rooms.find((r) => r.roomId === roomId);
                    if (selected) {
                      setSelectedRoom({
                        roomId: selected.roomId,
                        roomType: selected.roomType,
                        pricePerNight: selected.pricePerNight,
                      });
                    }
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose --</option>
                {rooms.map((r) => (
                  <option key={r.roomId} value={r.roomId}>
                    {r.roomType} - ₹{r.pricePerNight}/night
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              {queryLoading ? (
                <p className="text-sm text-stone-500">Loading...</p>
              ) : queryError ? (
                <p className="text-sm text-red-600">{fetchError}</p>
              ) : rooms.length === 0 ? (
                <p className="text-sm text-amber-700">No rooms available for the selected dates.</p>
              ) : (
                <p className="text-sm text-green-600">{rooms.length} rooms available</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {selectedRoom && (
          <div className="mt-4 rounded-md border border-stone-200 p-3 bg-stone-50">
            <p className="text-sm">Selected: {selectedRoom.roomType} - ₹{selectedRoom.pricePerNight}/night</p>
            <p className="text-sm">
              Nights: {nights}
            </p>
            <p className="text-sm">
              Guests: <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="ml-2 px-2 py-1 border border-gray-300 rounded-md"
              />
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isBookingReady}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-sm text-stone-600">
          * Payment will be processed via UPI after confirmation. This is a prototype flow.
        </p>
      </div>
    </div>
  );
}