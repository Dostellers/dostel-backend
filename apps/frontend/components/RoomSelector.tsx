"use client";

import Image from "next/image";
import SocialProof from "./SocialProof";

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
  capacity: number;
  image: string;
  amenities: string[];
  available: boolean;
  bookedThisWeek?: number;
}

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoomIds: string[];
  onSelect: (roomId: string) => void;
  checkIn: string;
  checkOut: string;
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
  selectedRoomIds,
  onSelect,
}: RoomSelectorProps) {
  return (
    <div className="space-y-3">
      {rooms.map((room) => {
        const isSelected = selectedRoomIds.includes(room.id);

        return (
          <button
            key={room.id}
            type="button"
            onClick={() => room.available && onSelect(room.id)}
            disabled={!room.available}
            className={`w-full rounded-xl border-2 bg-white text-left transition-all duration-150 ${
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
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-forest-900">{room.name}</p>
                      <p className="text-xs text-stone-400">Up to {room.capacity} guests</p>
                    </div>
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

                  <span
                    className={`flex h-8 min-w-[80px] items-center justify-center rounded-md text-xs font-semibold transition-all duration-150 ${
                      isSelected
                        ? "bg-sunset text-white"
                        : room.available
                        ? "bg-forest-500 text-white"
                        : "bg-stone-200 text-stone-400"
                    }`}
                  >
                    {!room.available ? "Sold out" : isSelected ? "Selected ✓" : "Select"}
                  </span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
