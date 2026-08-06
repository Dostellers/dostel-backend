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

const amenityIcons: Record<string, string> = {
  Locker: "🔒",
  "Reading Light": "💡",
  "Power Socket": "🔌",
  "Privacy Curtain": "🪟",
  "Hot Shower": "🚿",
  "Female Only": "👩",
  AC: "❄️",
  TV: "📺",
  "Attached Bath": "🚽",
  WiFi: "📶",
  Housekeeping: "🧹",
  "Mountain View": "🏔️",
  Balcony: "🏗️",
};

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
        const isSelected = selectedRooms.find((r) => r.roomId === room.id)?.quantity > 0;
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
                      <p className="text-xs text-stone-400">Up to {room.capacity} guests</p>
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
                            ✓ Selected
                            {selectedQty > 1 && <span>({selectedQty})</span>}
                          </span>
                        ) : (
                          "Select"
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap gap-1">
                    {room.amenities.slice(0, 5).map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-0.5 text-xs text-stone-400"
                        title={a}
                      >
                        {amenityIcons[a] || "•"} {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-forest-900">₹{room.price}</span>
                      <span className="text-xs text-stone-400">/night</span>
                      {dostellerPrice && isDosteller && (
                        <span className="text-xs font-medium text-forest-500">
                          Dosteller ₹{dostellerPrice}
                        </span>
                      )}
                      {room.originalPrice && room.originalPrice > room.price && (
                        <span className="text-xs text-stone-400 line-through">
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
