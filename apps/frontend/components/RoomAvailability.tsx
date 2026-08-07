"use client";

import { useEffect, useState } from "react";
import { useBooking } from "@/components/BookingProvider";
import client from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import Image from "next/image";

const ROOM_AVAILABILITY_QUERY = gql`
  query RoomAvailability($hostelId: ID!, $checkIn: Date!, $checkOut: Date!) {
    roomAvailability(hostelId: $hostelId, checkIn: $checkIn, checkOut: $checkOut) {
      roomType
      totalRooms
      availableRooms
      price
      roomId
    }
  }
`;

interface RoomAvailabilityResult {
  roomType: string;
  totalRooms: number;
  availableRooms: number;
  price: number;
  roomId: string;
}

const RoomAvailability = () => {
  const { state } = useBooking();
  const [availableRooms, setAvailableRooms] = useState<RoomAvailabilityResult[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!state.checkIn || !state.checkOut || !state.hostel) return;

    const fetchAvailableRooms = async () => {
      if (!state.hostel) return;
      try {
        setLoading(true);
        const { data } = await client.query<{ roomAvailability: RoomAvailabilityResult[] }>({
          query: ROOM_AVAILABILITY_QUERY,
          variables: {
            hostelId: state.hostel.slug,
            checkIn: state.checkIn,
            checkOut: state.checkOut
          }
        });
        setAvailableRooms(data.roomAvailability || []);
        setError("");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch availability");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRooms();
  }, [state.checkIn, state.checkOut, state.hostel]);

  return (
    <div className="space-y-4">
      {loading && <p className="text-sm text-stone-600">Loading availability...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {availableRooms.length > 0 ? (
        <AvailableRooms rooms={availableRooms} />
      ) : !loading && !error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">No rooms available for the selected dates.</p>
        </div>
      ) : null}
    </div>
  );
};

interface AvailableRoomsProps {
  rooms: RoomAvailabilityResult[];
}

const AvailableRooms = ({ rooms }: AvailableRoomsProps) => {
  const { actions } = useBooking();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map(room => (
        <button
          key={room.roomId}
          type="button"
          onClick={() => actions.selectRoom({
            roomId: room.roomId,
            name: room.roomType,
            quantity: 1,
            pricePerNight: room.price,
            total: room.price
          })}
          className="w-full text-left rounded-xl border-2 border-stone-200 bg-white p-4 transition-all duration-150 hover:border-sunset hover:bg-stone-50"
        >
          <div className="relative aspect-[5/4] mb-3 overflow-hidden rounded-lg">
            <Image
              src="/images/room-available.jpg"
              alt={room.roomType}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-forest-900">{room.roomType}</p>
            <p className="text-xs text-stone-400">₹{room.price}/night</p>
            <p className="text-xs text-green-600">
              {room.availableRooms} {room.availableRooms === 1 ? "room" : "rooms"} available
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RoomAvailability;