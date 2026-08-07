"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";
import BookingSummary from "@/components/BookingSummary";
import PriceBreakdown from "@/components/PriceBreakdown";
import StickyBottomBar from "@/components/StickyBottomBar";
import { useBooking } from "@/components/BookingProvider";

export default function BookingReviewPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { state } = useBooking();
  const [agreed, setAgreed] = useState(false);
  const [agreedPolicy, setAgreedPolicy] = useState(false);

  const canProceed = agreed && agreedPolicy && state.selectedRooms.length > 0 && state.guestInfo;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-6 sm:px-6 lg:pb-0">
      <div className="mb-6">
        <StepIndicator currentStep={2} basePath={`/booking/${params.slug}`} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <h1 className="font-heading text-xl font-semibold text-forest-900">Review your booking</h1>

          <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-forest-900">{state.hostel?.name || "Property"}</p>
                <p className="text-xs text-stone-400">{state.hostel?.location}</p>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              {state.checkIn && (
                <div>
                  <p className="text-xs text-stone-400">Check-in</p>
                  <p className="font-medium text-forest-900">
                    {new Date(state.checkIn).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} · 2 PM
                  </p>
                </div>
              )}
              {state.checkOut && (
                <div>
                  <p className="text-xs text-stone-400">Check-out</p>
                  <p className="font-medium text-forest-900">
                    {new Date(state.checkOut).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} · 11 AM
                  </p>
                </div>
              )}
              <div className="ml-auto">
                <p className="text-xs text-stone-400">Duration</p>
                <p className="font-medium text-forest-900">{state.nights} {state.nights === 1 ? "night" : "nights"}</p>
              </div>
            </div>
          </div>

          {state.selectedRooms.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-forest-900">Rooms</p>
              {state.selectedRooms.map((room) => (
                <div key={room.roomId} className="flex justify-between text-sm">
                  <span className="text-stone-600">{room.name} x{room.quantity}</span>
                  <span className="font-medium text-forest-900">₹{room.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {state.guestInfo && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-1">
              <p className="text-sm font-semibold text-forest-900">Guest details</p>
              <p className="text-sm text-stone-600">{state.guestInfo.fullName}</p>
              <p className="text-sm text-stone-600">{state.guestInfo.email}</p>
              <p className="text-sm text-stone-600">{state.guestInfo.phone}</p>
            </div>
          )}

          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <PriceBreakdown
              subtotal={state.subtotal}
              taxes={state.taxes}
              serviceFee={state.serviceFee}
              total={state.total}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-200 text-forest-500 accent-forest-500"
              />
              <span className="text-sm text-stone-600">
                I agree to the house rules and terms of stay
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedPolicy}
                onChange={(e) => setAgreedPolicy(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-200 text-forest-500 accent-forest-500"
              />
              <span className="text-sm text-stone-600">
                I agree to the cancellation policy
              </span>
            </label>
          </div>
        </div>

        <aside className="lg:w-80 lg:shrink-0">
          <div className="hidden lg:block space-y-4">
            <BookingSummary booking={state} />
          </div>
          <div className="lg:hidden">
            <BookingSummary booking={state} compact />
          </div>
        </aside>
      </div>

      <div className="lg:hidden">
        <StickyBottomBar
          price={state.selectedRooms[0]?.pricePerNight || 0}
          total={state.total}
          ctaLabel={canProceed ? `Confirm & pay ₹${state.total}` : "Accept terms to continue"}
          onCtaClick={() => canProceed && router.push(`/booking/${params.slug}/payment`)}
          disabled={!canProceed}
          show
        />
      </div>

      <div className="hidden lg:block mt-6">
        <button
          type="button"
          onClick={() => canProceed && router.push(`/booking/${params.slug}/payment`)}
          disabled={!canProceed}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-sunset text-sm font-semibold text-white transition-all duration-150 active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed hover:brightness-95 focus-visible:outline-2 focus-visible:outline-sky"
        >
          {canProceed ? `Confirm & pay ₹${state.total}` : "Accept terms to continue"}
        </button>
        <p className="mt-2 text-center text-xs text-stone-400">Secured by Razorpay</p>
      </div>
    </div>
  );
}
