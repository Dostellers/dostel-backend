"use client";

import { createContext, useContext, useCallback, useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  buildRateOffers,
  getRatePlan,
  resolvePaymentSchedule,
  type RateType,
} from "@/lib/rate-plans";

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
  workweekDiscount?: number;
  originalSubtotal?: number;
  paymentMethod?: string;
  paymentIntentId?: string;
  paymentStatus?: 'pending' | 'processing' | 'succeeded' | 'failed';
  rateType: RateType;
  depositPercentage: number;
  depositDue: number;
  balanceDue: number;
  payAtProperty: number;
  balanceCollection: 'AT_PROPERTY' | 'PREPAID';
  refundable: boolean;
  cancellationDeadlineHours: number;
  rateLabel: string;
  rateDescription: string;
}

export interface BookingActions {
  updateSearch: (params: Partial<Pick<BookingState, "destination" | "checkIn" | "checkOut" | "guests">>) => void;
  setHostel: (hostel: BookingState["hostel"]) => void;
  selectRoom: (room: RoomSelection) => void;
  removeRoom: (roomId: string) => void;
  updateGuestInfo: (info: BookingState["guestInfo"]) => void;
  selectRate: (rateType: RateType) => void;
  confirmBooking: () => void;
  resetBooking: () => void;
  setPaymentMethod: (method: string) => void;
  setPaymentIntent: (intentId: string) => void;
  updatePaymentStatus: (status: BookingState["paymentStatus"]) => void;
  processPayment: (paymentData: { method: string; transactionId: string; chargeId: string }) => Promise<void>;
}

const defaultPlan = getRatePlan('FREE_CANCELLATION');

const initialState: BookingState = {
  destination: "", checkIn: "", checkOut: "", guests: 1, hostel: null, selectedRooms: [],
  subtotal: 0, taxes: 0, serviceFee: 0, total: 0, nights: 0,
  rateType: defaultPlan.id,
  depositPercentage: defaultPlan.depositPercentage,
  depositDue: 0,
  balanceDue: 0,
  payAtProperty: 0,
  balanceCollection: defaultPlan.balanceCollection,
  refundable: defaultPlan.refundable,
  cancellationDeadlineHours: defaultPlan.cancellationDeadlineHours,
  rateLabel: defaultPlan.label,
  rateDescription: defaultPlan.description,
};

const BookingContext = createContext<{ state: BookingState; actions: BookingActions } | null>(null);

function computeNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  return Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
}

function computeFinancials(
  rooms: RoomSelection[],
  nights: number,
  isWorkweek = false,
  rateType: RateType = 'FREE_CANCELLATION',
  paymentMethod?: string,
) {
  const subtotal = rooms.reduce((sum, r) => sum + r.total, 0);
  const workweekDiscount = isWorkweek ? Math.round(subtotal * 0.2) : 0;
  const discountedSubtotal = subtotal - workweekDiscount;
  const taxes = Math.round(discountedSubtotal * 0.12);
  const serviceFee = discountedSubtotal > 0 ? 49 : 0;
  const baseTotal = discountedSubtotal + taxes + serviceFee;
  const offers = buildRateOffers(baseTotal);
  const offer = offers.find((o) => o.rateType === rateType) || offers[0];
  const schedule = resolvePaymentSchedule(rateType, offer.totalAmount, paymentMethod);

  return {
    subtotal: discountedSubtotal,
    taxes,
    serviceFee,
    total: offer.totalAmount,
    workweekDiscount,
    originalSubtotal: subtotal,
    rateType: schedule.rateType,
    depositPercentage: schedule.depositPercentage,
    depositDue: schedule.depositRequired,
    balanceDue: schedule.balanceDue,
    payAtProperty: schedule.payAtProperty,
    balanceCollection: schedule.balanceCollection,
    refundable: schedule.refundable,
    cancellationDeadlineHours: schedule.cancellationDeadlineHours,
    rateLabel: schedule.label,
    rateDescription: schedule.description,
  };
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
    const dest = searchParams?.get("destination");
    const checkIn = searchParams?.get("checkIn");
    const checkOut = searchParams?.get("checkOut");
    const guests = searchParams?.get("guests");
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

  const updateSearch = useCallback((params) => setState((prev) => {
    const next = { ...prev, ...params };
    const n = computeNights(next.checkIn, next.checkOut);
    const isWorkweek = Boolean(next.checkIn && next.checkOut && n >= 5);
    return {
      ...next,
      nights: n,
      ...computeFinancials(next.selectedRooms, n, isWorkweek, next.rateType, next.paymentMethod),
    };
  }), []);
  const setHostel = useCallback((hostel) => setState((prev) => ({ ...prev, hostel })), []);
  const selectRoom = useCallback((room) => setState((prev) => {
    const exists = prev.selectedRooms.find((r) => r.roomId === room.roomId);
    const selectedRooms = exists ? prev.selectedRooms.map((r) => r.roomId === room.roomId ? room : r) : [...prev.selectedRooms, room];
    const n = computeNights(prev.checkIn, prev.checkOut);
    const isWorkweek = Boolean(prev.checkIn && prev.checkOut && n >= 5);
    return {
      ...prev,
      selectedRooms,
      ...computeFinancials(selectedRooms, n, isWorkweek, prev.rateType, prev.paymentMethod),
    };
  }), []);
  const removeRoom = useCallback((roomId) => setState((prev) => {
    const selectedRooms = prev.selectedRooms.filter((r) => r.roomId !== roomId);
    const n = computeNights(prev.checkIn, prev.checkOut);
    const isWorkweek = Boolean(prev.checkIn && prev.checkOut && n >= 5);
    return {
      ...prev,
      selectedRooms,
      ...computeFinancials(selectedRooms, n, isWorkweek, prev.rateType, prev.paymentMethod),
    };
  }), []);
  const updateGuestInfo = useCallback((info) => setState((prev) => ({ ...prev, guestInfo: info })), []);
  const selectRate = useCallback((rateType: RateType) => setState((prev) => {
    const n = computeNights(prev.checkIn, prev.checkOut);
    const isWorkweek = Boolean(prev.checkIn && prev.checkOut && n >= 5);
    return {
      ...prev,
      ...computeFinancials(prev.selectedRooms, n, isWorkweek, rateType, prev.paymentMethod),
    };
  }), []);
  const confirmBooking = useCallback(() => {
    setState((prev) => {
      localStorage.setItem(CONFIRMATION_KEY, JSON.stringify(prev));
      localStorage.removeItem(STORAGE_KEY);
      return initialState;
    });
  }, []);
  const resetBooking = useCallback(() => { localStorage.removeItem(STORAGE_KEY); setState(initialState); }, []);
  const setPaymentMethod = useCallback((method) => setState((prev) => {
    const n = computeNights(prev.checkIn, prev.checkOut);
    const isWorkweek = Boolean(prev.checkIn && prev.checkOut && n >= 5);
    return {
      ...prev,
      paymentMethod: method,
      ...computeFinancials(prev.selectedRooms, n, isWorkweek, prev.rateType, method),
    };
  }), []);
  const setPaymentIntent = useCallback((intentId) => setState((prev) => ({ ...prev, paymentIntentId: intentId })), []);
  const updatePaymentStatus = useCallback((status) => setState((prev) => ({ ...prev, paymentStatus: status })), []);
  const processPayment = useCallback(async (paymentData) => {
    if (typeof window === "undefined") return;

    const paymentState = {
      ...state,
      paymentMethod: paymentData.method,
      transactionId: paymentData.transactionId,
      chargeId: paymentData.chargeId,
      paymentStatus: 'processing' as BookingState['paymentStatus']
    };

    localStorage.setItem(CONFIRMATION_KEY, JSON.stringify(paymentState));
    localStorage.removeItem(STORAGE_KEY);
    setState(prev => ({ ...prev, paymentStatus: 'succeeded' }));
  }, [state]);
  const actions: BookingActions = useMemo(() => ({
    updateSearch, setHostel, selectRoom, removeRoom, updateGuestInfo, selectRate, confirmBooking,
    resetBooking, setPaymentMethod, setPaymentIntent, updatePaymentStatus, processPayment
  }), [updateSearch, setHostel, selectRoom, removeRoom, updateGuestInfo, selectRate, confirmBooking, resetBooking, setPaymentMethod, setPaymentIntent, updatePaymentStatus, processPayment]);

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
