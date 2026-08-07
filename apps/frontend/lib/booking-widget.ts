export interface WidgetRoom {
  roomId: string;
  roomType: string;
  pricePerNight: number;
  availableRooms: number;
}

export interface SearchValues {
  hostelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface BookingInputValues extends SearchValues {
  customerId: string;
  room: WidgetRoom;
  specialRequests?: string;
  reference?: string;
}

export function calculateNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
}

export function validateSearch({ hostelId, checkIn, checkOut, guests }: SearchValues) {
  if (!hostelId) return "Choose a hostel.";
  if (!checkIn || !checkOut) return "Choose check-in and check-out dates.";
  if (calculateNights(checkIn, checkOut) < 1) return "Check-out must be after check-in.";
  if (!Number.isInteger(guests) || guests < 1) return "Guests must be at least 1.";
  return "";
}

export function buildBookingInput({
  customerId,
  hostelId,
  room,
  checkIn,
  checkOut,
  guests,
  specialRequests,
  reference = `DIRECT-${Date.now()}`,
}: BookingInputValues) {
  const nights = calculateNights(checkIn, checkOut);
  const totalAmount = Math.round(room.pricePerNight * nights * 100) / 100;

  return {
    reference,
    customerId,
    hostelId,
    roomType: room.roomType,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    guests,
    totalAmount,
    payment: {
      status: "Pending",
      method: "Mock UPI",
      amount: 0,
    },
    specialRequests: specialRequests || undefined,
    source: {
      name: "Direct Booking Widget",
    },
    status: "Draft",
  };
}
