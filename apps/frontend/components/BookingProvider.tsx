"use client";

import { createContext, useContext, useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface RoomSelection {
  roomId: string;
  name: string;
  quantity: number;
  pricePerNight: number;
  total: number;
}

export interface BookingState {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  hostel: { slug: string; name: string; location: string } | null;
  selectedRooms: RoomSelection[];
  guestInfo?: { fullName: string; email: string; phone: string; specialRequests?: string; govtIdType?: string; govtIdNumber?: string };
  subtotal: number;
  taxes: number;
  serviceFee: number;
  total: number;
  nights: number;
}

export interface BookingActions {
  updateSearch: (params: Partial<Pick<BookingState, "destination" | "checkIn" | "checkOut" | "guests">>) => void;
  setHostel: (hostel: BookingState["hostel"]) => void;
  selectRoom: (room: RoomSelection) => void;
  removeRoom: (roomId: string) => void;
  updateGuestInfo: (info: BookingState["guestInfo"]) => void;
  confirmBooking: () => void;
  resetBooking: () => void;
}

const initialState: BookingState = {
  destination: "", checkIn: "", checkOut: "", guests: 1, hostel: null, selectedRooms: [],
  subtotal: 0, taxes: 0, serviceFee: 0, total: 0, nights: 0,
};

const BookingContext = createContext<{ state: BookingState; actions: BookingActions } | null>(null);

function computeNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  return Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
}

function computeFinancials(rooms: RoomSelection[], nights: number) {
  const subtotal = rooms.reduce((sum, r) => sum + r.total, 0);
  return { subtotal, taxes: Math.round(subtotal * 0.12), serviceFee: subtotal > 0 ? 49 : 0, total: subtotal + Math.round(subtotal * 0.12) + (subtotal > 0 ? 49 : 0) };
}

const STORAGE_KEY = "dostel-booking";
const CONFIRMATION_KEY = "dostel-confirmation";

export function getConfirmationData(): BookingState | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(CONFIRMATION_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export function clearConfirmation(): void {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(CONFIRMATION_KEY); } catch {}
}

function initializeFromStorage(): BookingState {
  if (typeof window === "undefined") return initialState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...initialState, ...JSON.parse(saved) };
  } catch {}
  return initialState;
}

function BookingHydrator({ onHydrate }: { onHydrate: (state: BookingState) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const initial = initializeFromStorage();
    const dest = searchParams.get("destination");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = searchParams.get("guests");
    if (dest || checkIn || checkOut || guests) {
      onHydrate({
        ...initial,
        destination: dest || initial.destination,
        checkIn: checkIn || initial.checkIn,
        checkOut: checkOut || initial.checkOut,
        guests: guests ? Number(guests) : initial.guests,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(initializeFromStorage);

  const handleHydrate = useCallback((hydrated: BookingState) => {
    setState(hydrated);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), 500);
    return () => clearTimeout(timer);
  }, [state]);

  const actions: BookingActions = {
    updateSearch: useCallback((params) => setState((prev) => {
      const next = { ...prev, ...params };
      const n = computeNights(next.checkIn, next.checkOut);
      return { ...next, nights: n, ...computeFinancials(next.selectedRooms, n) };
    }), []),
    setHostel: useCallback((hostel) => setState((prev) => ({ ...prev, hostel })), []),
    selectRoom: useCallback((room) => setState((prev) => {
      const exists = prev.selectedRooms.find((r) => r.roomId === room.roomId);
      const selectedRooms = exists ? prev.selectedRooms.map((r) => r.roomId === room.roomId ? room : r) : [...prev.selectedRooms, room];
      return { ...prev, selectedRooms, ...computeFinancials(selectedRooms, prev.nights) };
    }), []),
    removeRoom: useCallback((roomId) => setState((prev) => {
      const selectedRooms = prev.selectedRooms.filter((r) => r.roomId !== roomId);
      return { ...prev, selectedRooms, ...computeFinancials(selectedRooms, prev.nights) };
    }), []),
    updateGuestInfo: useCallback((info) => setState((prev) => ({ ...prev, guestInfo: info })), []),
    confirmBooking: useCallback(() => {
      setState((prev) => {
        localStorage.setItem(CONFIRMATION_KEY, JSON.stringify(prev));
        localStorage.removeItem(STORAGE_KEY);
        return initialState;
      });
    }, []),
    resetBooking: useCallback(() => { localStorage.removeItem(STORAGE_KEY); setState(initialState); }, []),
  };

  return (
    <BookingContext.Provider value={{ state, actions }}>
      <Suspense fallback={null}>
        <BookingHydrator onHydrate={handleHydrate} />
      </Suspense>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}
