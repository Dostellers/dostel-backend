'use client';

import Image from 'next/image';

export interface RoomCardRoom {
  id: string;
  name: string;
  type: 'dorm-mixed' | 'dorm-female' | 'private' | 'deluxe';
  price: number;
  originalPrice?: number;
  capacity: number;
  image: string;
  amenities: string[];
  available: boolean;
  bookedThisWeek?: number;
}

export interface RoomCardProps {
  room: RoomCardRoom;
  selected: boolean;
  onSelect: (roomId: string) => void;
  checkIn: string;
  checkOut: string;
  loading?: boolean;
  className?: string;
}

function stayNights(checkIn: string, checkOut: string) {
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.round((end - start) / 86_400_000);
}

export default function RoomCard({ room, selected, onSelect, checkIn, checkOut, loading = false, className = '' }: RoomCardProps) {
  if (loading) {
    return (
      <div className={`room-card-skeleton overflow-hidden ${className}`} role="status" aria-label="Loading room option">
        <div className="skeleton aspect-[4/3] w-full" />
        <div className="space-y-3 p-4">
          <div className="skeleton h-5 w-2/3 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="skeleton h-11 w-full rounded-lg" />
        </div>
        <span className="sr-only">Loading room option</span>
        <style jsx>{`
          .room-card-skeleton { border: 1px solid var(--ds-color-stone-200); border-radius: var(--ds-radius-lg); background: var(--ds-color-white); }
          .skeleton { background: linear-gradient(90deg, var(--ds-color-stone-200) 25%, var(--ds-color-snow) 50%, var(--ds-color-stone-200) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
          @keyframes shimmer { to { background-position-x: -200%; } }
          @media (prefers-reduced-motion: reduce) { .skeleton { animation: none; } }
        `}</style>
      </div>
    );
  }

  const nights = stayNights(checkIn, checkOut);
  const total = nights * room.price;
  const action = selected ? 'Selected' : 'Select';

  return (
    <button
      type="button"
      disabled={!room.available}
      aria-pressed={selected}
      aria-label={`${action} ${room.name}, ₹${room.price} per night`}
      onClick={() => onSelect(room.id)}
      className={`room-card group w-full overflow-hidden text-left ${selected ? 'room-card-selected' : ''} ${className}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image src={room.image} alt="" fill className="object-cover" sizes="(max-width: 767px) 100vw, 33vw" />
        {!room.available && <span className="absolute inset-0 flex items-center justify-center bg-forest-900/70 text-sm font-semibold text-white">Sold out</span>}
        {room.bookedThisWeek && room.bookedThisWeek > 5 ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-sunset px-3 py-1 text-xs font-semibold text-forest-900">
            {room.bookedThisWeek} booked this week
          </span>
        ) : null}
      </div>
      <span className="block p-4">
        <span className="flex items-start justify-between gap-3">
          <span>
            <span className="block font-heading text-lg font-semibold text-forest-900">{room.name}</span>
            <span className="mt-1 block text-sm text-stone-600">Up to {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</span>
          </span>
          <span className={`inline-flex min-h-11 shrink-0 items-center rounded-lg px-4 text-sm font-semibold ${selected ? 'bg-forest-500 text-white' : 'bg-sunset text-forest-900'}`}>
            {action}
          </span>
        </span>
        <span className="mt-3 flex flex-wrap gap-2" aria-label="Room amenities">
          {room.amenities.slice(0, 5).map((amenity) => (
            <span key={amenity} className="rounded-full bg-forest-100 px-2.5 py-1 text-xs font-medium text-forest-900">{amenity}</span>
          ))}
        </span>
        <span className="mt-4 flex items-end justify-between gap-3 border-t border-stone-200 pt-3">
          <span>
            <span className="text-lg font-bold text-forest-900">₹{room.price.toLocaleString('en-IN')}</span>
            <span className="text-sm text-stone-600"> / night</span>
            {room.originalPrice && room.originalPrice > room.price ? <span className="ml-2 text-sm text-stone-400 line-through">₹{room.originalPrice.toLocaleString('en-IN')}</span> : null}
          </span>
          {nights > 0 ? <span className="text-sm font-medium text-stone-600">₹{total.toLocaleString('en-IN')} total</span> : null}
        </span>
      </span>
      <style jsx>{`
        .room-card { border: 1px solid var(--ds-color-stone-200); border-radius: var(--ds-radius-lg); background: var(--ds-color-white); transition: border-color var(--ds-motion-base) var(--ds-ease-out), box-shadow var(--ds-motion-base) var(--ds-ease-out), transform var(--ds-motion-base) var(--ds-ease-out); }
        .room-card:hover:not(:disabled) { border-color: var(--ds-color-forest-500); box-shadow: var(--ds-shadow-md); transform: translateY(-2px); }
        .room-card:focus-visible { outline: 2px solid var(--ds-color-sky); outline-offset: 2px; }
        .room-card:active:not(:disabled) { transform: scale(0.98); transition-duration: var(--ds-motion-fast); }
        .room-card-selected { border: 2px solid var(--ds-color-forest-500); background: color-mix(in srgb, var(--ds-color-forest-500) 5%, var(--ds-color-white)); }
        .room-card:disabled { cursor: not-allowed; opacity: 0.6; }
        @media (prefers-reduced-motion: reduce) { .room-card { transition: none; } .room-card:hover:not(:disabled), .room-card:active:not(:disabled) { transform: none; } }
      `}</style>
    </button>
  );
}
