"use client";

import Image from "next/image";
import SocialProof from "./SocialProof";
import { useBooking } from "./BookingProvider";

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
  dostellerPrice?: number;
  capacity: number;
  image: string;
  amenities: string[];
  available: boolean;
  bookedThisWeek?: number;
}

export interface RoomSelection {
  roomId: string;
  name: string;
  quantity: number;
  pricePerNight: number;
  total: number;
}

interface RoomSelectorProps {
  rooms: Room[];
  checkIn: string;
  checkOut: string;
  isDosteller?: boolean;
}

/* 24px grid, 2px stroke, currentColor. Emoji are not icons: they render
   differently per platform and screen readers announce them by unicode name
   ("snowflake" for AC), which is noise inside an amenity list. */
const amenityIcons: Record<string, string> = {
  Locker: "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5z",
  "Reading Light": "M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5V16H8v-2.5A6 6 0 0 1 12 3z",
  "Power Socket": "M4 5h16v14H4zM9 10v4M15 10v4",
  "Privacy Curtain": "M4 4h16v16H4zM12 4v16M8 4c0 5 0 11 0 16M16 4c0 5 0 11 0 16",
  "Hot Shower": "M6 21V8a4 4 0 0 1 8 0M14 8h6M10 14h.01M13 17h.01M17 13h.01",
  "Female Only": "M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 13v8M9 18h6",
  AC: "M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9",
  TV: "M4 7h16v11H4zM9 3l3 4 3-4",
  "Attached Bath": "M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM7 12V6a2 2 0 0 1 4 0",
  WiFi: "M5 12.5a10 10 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0M12 19.5h.01",
  Housekeeping: "M12 3v9M8 12h8l1 9H7zM10 16h4",
  "Mountain View": "m3 18 6-9 4 5.5L15.5 11 21 18z",
  Balcony: "M4 10h16M6 10v10M18 10v10M10 10v10M14 10v10M4 20h16M5 10 12 4l7 6",
};
const AMENITY_FALLBACK = "M5 12h14";

export default function RoomSelector({
  rooms,
  checkIn,
  checkOut,
  isDosteller = false,
}: RoomSelectorProps) {
  const { state, actions } = useBooking();
  const selectedRooms = state.selectedRooms;
  const nights = state.nights;

  const getSelectedQuantity = (roomId: string) => {
    const existing = selectedRooms.find((r) => r.roomId === roomId);
    return existing ? existing.quantity : 0;
  };

  const handleSelect = (room: Room) => {
    const currentQty = selectedRooms.find((r) => r.roomId === room.id)?.quantity || 0;
    const newQty = currentQty >= room.capacity ? 0 : currentQty + 1;
    
    const roomPrice = isDosteller && room.originalPrice ? room.originalPrice : room.price;
    
    actions.selectRoom({
      roomId: room.id,
      name: room.name,
      quantity: newQty,
      pricePerNight: roomPrice,
      total: roomPrice * nights * newQty,
    });
  };

  const getDostellerPrice = (room: Room) => {
    if (!room.dostellerPrice && !room.originalPrice) return null;
    return room.dostellerPrice || room.originalPrice;
  };

  const hasSelection = selectedRooms.length > 0;

  return (
    <div className="space-y-3">
      {rooms.map((room) => {
        const selectedQty = selectedRooms.find((r) => r.roomId === room.id)?.quantity ?? 0;
        const isSelected = selectedQty > 0;
        const dostellerPrice = getDostellerPrice(room);

        return (
          <div
            key={room.id}
            className={`rounded-xl border-2 bg-white transition-all duration-150 ${
              isSelected
                ? "border-forest-500 ring-1 ring-forest-100"
                : room.available
                ? "border-stone-200 hover:border-stone-400"
                : "border-stone-200 opacity-60 cursor-not-allowed"
            }`}
          >
            <div className="flex gap-4 p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
                {!room.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-xs font-semibold text-white">Sold out</span>
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-forest-900">{room.name}</p>
                      <p className="text-xs text-ink-600">Up to {room.capacity} guests</p>
                    </div>
{room.available && (
                       <div
                         className={`flex h-8 min-w-[80px] cursor-pointer items-center justify-center rounded-md text-xs font-semibold transition-all duration-150 ${
                           isSelected
                             ? "bg-sunset text-white"
                             : "bg-forest-500 text-white hover:brightness-95"
                         }`}
                         onClick={() => handleSelect(room)}
                         role="button"
                         tabIndex={0}
                         onKeyDown={(e) => {
                           if (e.key === "Enter" || e.key === " ") {
                             e.preventDefault();
                             handleSelect(room);
                           }
                         }}
                         aria-label={`${isSelected ? "Deselect" : "Select"} ${room.name}`}
                      >
                        {isSelected ? (
                          <span className="flex items-center gap-1">
                            Selected
                            {selectedQty > 1 && <span>({selectedQty})</span>}
                          </span>
                        ) : (
                          "Select"
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1.5">
                    {room.amenities.slice(0, 5).map((a) => (
                      <span key={a} className="inline-flex items-center gap-1.5 text-xs text-ink-600">
                        <svg
                          className="h-3.5 w-3.5 shrink-0 text-ink-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d={amenityIcons[a] || AMENITY_FALLBACK} />
                        </svg>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-forest-900">₹{room.price}</span>
                      <span className="text-xs text-ink-600">/night</span>
                      {dostellerPrice && isDosteller && (
                        <span className="text-xs font-medium text-forest-500">
                          Dosteller ₹{dostellerPrice}
                        </span>
                      )}
                      {room.originalPrice && room.originalPrice > room.price && (
                        <span className="text-xs text-ink-600 line-through">
                          ₹{room.originalPrice}
                        </span>
                      )}
                    </div>
                    {room.bookedThisWeek && (
                      <SocialProof count={room.bookedThisWeek} label="booked this week" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {hasSelection && (
        <div className="border-t border-stone-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-stone-600">Total for {nights} nights</span>
            <span className="text-xl font-bold text-forest-900">₹{state.total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
