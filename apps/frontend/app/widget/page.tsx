"use client";

import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
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

  // Form state
  const [hostelId, setHostelId] = useState("");
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
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: search, 2: select room, 3: payment
  const [createBooking] = useMutation(CREATE_BOOKING_MUTATION);
  const [findOrCreateCustomer] = useMutation(FIND_OR_CREATE_CUSTOMER);

  // Compute derived values
  const nights = calculateNights(checkIn, checkOut);
  const totalAmount = nights > 0 && selectedRoom ? selectedRoom.pricePerNight * nights : 0;

  // Handle date changes
  const handleDateChange = (field: "checkIn" | "checkOut", value: string) => {
    if (field === "checkIn") setCheckIn(value);
    if (field === "checkOut") setCheckOut(value);
  };

  // Step navigation
  const goToStep = (stepNumber: number) => {
    setStep(stepNumber);
    setError("");
  };

  const goToNextStep = () => {
    if (step === 1) {
      // Validate step 1
      if (!hostelId || !checkIn || !checkOut || guests < 1) {
        setError("Please fill in all required fields");
        return;
      }
      if (nights < 1) {
        setError("Check-out must be after check-in");
        return;
      }
      goToStep(2);
    } else if (step === 2) {
      // Validate step 2
      if (!selectedRoom) {
        setError("Please select a room");
        return;
      }
      goToStep(3);
    }
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
    setError("");
  };

  // Submit booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;

    if (!upiId) {
      setError("Please enter your UPI ID");
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
          status: "Partial", // Updated to reflect partial payment state
          method: "UPI",
          amount: totalAmount * 0.25, // 25% deposit as per flexible payment model
          depositPercentage: 25,
          upiId: upiId,
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
      skip: !(hostelId && checkIn && checkOut) || step !== 2, // Only run in step 2
    }
  );
  const rooms: AvailableRoom[] = queryData?.roomAvailability || [];
  const fetchError = queryError?.message ?? "";

  const isStep1Complete =
    !!hostelId && !!checkIn && !!checkOut && guests >= 1 && nights >= 1;
  const isStep2Complete = !!selectedRoom;
  const isStep3Complete = !!upiId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Direct Booking Widget</h1>

      {/* Progress Indicator */}
      <div className="flex justify-between mb-6">
        <div
          className={`flex-1 text-center px-3 py-2 ${
            step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          } rounded-lg`}
        >
          Step 1: Search
        </div>
        <div className="w-1/12">
          <div className="h-0.5 bg-gray-300"></div>
        </div>
        <div
          className={`flex-1 text-center px-3 py-2 ${
            step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          } rounded-lg`}
        >
          Step 2: Select Room
        </div>
        <div className="w-1/12">
          <div className="h-0.5 bg-gray-300"></div>
        </div>
        <div
          className={`flex-1 text-center px-3 py-2 ${
            step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          } rounded-lg`}
        >
          Step 3: Payment
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Find Availability</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel ID</label>
              <input
                type="text"
                value={hostelId}
                onChange={(e) => setHostelId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check‑In Date</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => handleDateChange("checkIn", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check‑Out Date</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => handleDateChange("checkOut", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => goToNextStep()}
              disabled={loading || !isStep1Complete}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {loading ? "Searching..." : "Next"}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Select Your Room</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}

          {queryLoading ? (
            <p className="text-center text-sm text-stone-500">Loading room availability...</p>
          ) : fetchError ? (
            <p className="text-center text-sm text-red-600">{fetchError}</p>
          ) : rooms.length === 0 ? (
            <p className="text-center text-sm text-amber-700">
              No rooms available for the selected dates. Please try different dates.
            </p>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-600">
                {rooms.length} room{rooms.length !== 1 ? "s" : ""} available
              </p>
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div
                    key={room.roomId}
                    className={`border rounded-lg p-4 ${
                      selectedRoom?.roomId === room.roomId
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    } cursor-pointer hover:border-gray-300`}
                    onClick={() =>
                      setSelectedRoom({
                        roomId: room.roomId,
                        roomType: room.roomType,
                        pricePerNight: room.pricePerNight,
                      })
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{room.roomType}</h3>
                        <p className="text-sm text-gray-500">
                          ₹{room.pricePerNight}/night
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {room.availableRooms} available
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => goToPreviousStep()}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => goToNextStep()}
              disabled={loading || !isStep2Complete}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {loading ? "Loading..." : "Next"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Review & Pay</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}

          {/* Booking Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Hostel:</span>
                <span>{hostelId}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span>{checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span>{checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights:</span>
                <span>{nights}</span>
              </div>
              <div className="flex justify-between">
                <span>Room Type:</span>
                <span>{selectedRoom?.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per night:</span>
                <span>₹{selectedRoom?.pricePerNight}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Guests:</span>
                <span>{guests}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Guest Details (Optional) */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Guest Details (Optional)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* UPI Payment */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">UPI Payment</h3>
            <p className="text-sm text-gray-500 mb-2">
              Pay a 25% deposit via UPI to secure your booking. Balance due on check-in.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Amount:</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div>
                  <span className="font-medium">Deposit (25%):</span>
                  <span>₹{(totalAmount * 0.25).toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-medium">Balance Due:</span>
                  <span>₹{(totalAmount * 0.75).toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-medium">Payment Method:</span>
                  <span>UPI</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => goToPreviousStep()}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !isStep3Complete}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {loading ? "Processing Payment..." : "Pay ₹{totalAmount} via UPI"}
            </button>
          </div>

          {/* Notice */}
          <div className="mt-4 text-sm text-gray-500">
            <p>
              * This is a prototype. In a real implementation, the payment would be processed
              * securely via UPI gateway. For now, we're simulating the flow.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}