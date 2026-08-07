"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  variant?: "home" | "sticky" | "compact";
  dark?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function SearchBarInner({
  variant = "home",
  placeholder,
  value: _value,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState(searchParams?.get("destination") || _value || "");
  const [checkIn, setCheckIn] = useState(searchParams?.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams?.get("checkOut") || "");
  const [guests, setGuests] = useState(searchParams?.get("guests") || "1");
  const [expanded, setExpanded] = useState(variant !== "compact");

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const params = new URLSearchParams();
      if (destination) params.set("destination", destination);
      if (checkIn) params.set("checkIn", checkIn);
      if (checkOut) params.set("checkOut", checkOut);
      if (guests) params.set("guests", guests);
      router.push(`/hostels?${params.toString()}`);
    },
    [destination, checkIn, checkOut, guests, router]
  );

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-400 shadow-sm transition-all duration-150 hover:shadow-md"
      >
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {destination ? (
          <span className="flex-1 truncate text-left text-forest-900">{destination}</span>
        ) : (
          <span className="flex-1 text-left">Where to?</span>
        )}
        {checkIn && <span className="text-xs text-stone-400">{checkIn}</span>}
      </button>
    );
  }

  if (variant === "sticky") {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm shadow-sm"
        >
          <span className="font-medium text-forest-900">{destination || "Anywhere"}</span>
          {checkIn && <span className="text-stone-400">· {checkIn}</span>}
          {checkOut && <span className="text-stone-400">· {checkOut}</span>}
          <span className="text-stone-400">· {guests} {Number(guests) === 1 ? "guest" : "guests"}</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto w-full max-w-4xl">
      {/* max-w-2xl could not fit destination + 2 dates + guests + button, so the
          button overflowed the card. Wider shell, and every group may shrink. */}
      <div className="flex flex-col gap-3 rounded-sm bg-white p-3 shadow-[0_24px_60px_-28px_rgba(11,11,12,0.55)] sm:flex-row sm:items-center sm:gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
          <svg className="h-5 w-5 shrink-0 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={placeholder || "Where to?"}
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink-1000 outline-none placeholder:text-ink-500"
            aria-label="Destination"
          />
        </div>

        <div className="flex min-w-0 shrink gap-2 sm:gap-1.5">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="min-w-0 flex-1 rounded-sm border border-ink-200 px-2.5 py-2 text-sm text-ink-1000"
            aria-label="Check-in date"
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="min-w-0 flex-1 rounded-sm border border-ink-200 px-2.5 py-2 text-sm text-ink-1000"
            aria-label="Check-out date"
          />
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="min-w-0 shrink-0 rounded-sm border border-ink-200 px-2 py-2 text-sm text-ink-1000"
            aria-label="Number of guests"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="flex h-11 shrink-0 items-center justify-center rounded-sm bg-coral-600 px-7 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-700 active:scale-[0.97]"
        >
          Search
        </button>
      </div>
    </form>
  );
}
