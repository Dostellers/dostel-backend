"use client";
import { useRouter } from "next/navigation";
import { useBooking } from '@/components/BookingProvider';
import StepIndicator from '@/components/StepIndicator';
import RoomAvailability from '@/components/RoomAvailability';
import StickyBottomBar from '@/components/StickyBottomBar';

export default function BookingDatesPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { state, actions } = useBooking();

  // Validate that we have at least 1 night stay
  const isValidStay = state.nights >= 1;

  const handleNext = () => {
    if (state.selectedRooms.length > 0 && isValidStay) {
      router.push(`/booking/${params.slug}/details`);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-6 sm:px-6 lg:pb-0">
      <div className="mb-6">
        <StepIndicator currentStep={1} basePath={`/booking/${params.slug}`} />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-xl font-semibold text-forest-900">
            {state.hostel?.name || "Select dates"}
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            Choose your stay dates to see available rooms
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-4">
          <RoomAvailability />
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
          <h3 className="font-semibold text-forest-900">Your stay</h3>

          <div className="flex gap-4 text-sm">
            {state.checkIn && (
              <div>
                <p className="text-xs text-stone-400">Check-in</p>
                <p className="font-medium text-forest-900">
                  {new Date(state.checkIn).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                  })} • 2 PM
                </p>
              </div>
            )}

            {state.checkOut && (
              <div>
                <p className="text-xs text-stone-400">Check-out</p>
                <p className="font-medium text-forest-900">
                  {new Date(state.checkOut).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                  })} • 11 AM
                </p>
              </div>
            )}

            <div className="ml-auto">
              <p className="text-xs text-stone-400">Duration</p>
              <p className="font-medium text-forest-900">
                {state.nights} {state.nights === 1 ? "night" : "nights"}
              </p>
            </div>

            {!
isValidStay && (
              <div className="mt-4 text-red-500">
                Please select at least 1 night stay
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden mt-6">
          <StickyBottomBar
            price={state.selectedRooms[0]?.pricePerNight || 0}
            total={state.total}
            ctaLabel={state.selectedRooms.length > 0 ? "Continue to guest details" : "Select a room to continue"}
            onCtaClick={handleNext}
            disabled={!isValidStay || state.selectedRooms.length === 0}
            show
          />
        </div>

        <div className="hidden lg:block mt-6">
          <button
            type="button"
            onClick={handleNext}
            disabled={!isValidStay || state.selectedRooms.length === 0}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-sunset text-sm font-semibold text-white transition-all duration-150 active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed hover:brightness-95 focus-visible:outline-2 focus-visible:outline-sky"
          >
            {state.selectedRooms.length > 0 ? "Continue to guest details" : "Select a room to continue"}
          </button>
        </div>
      </div>
    </div>
  );
}