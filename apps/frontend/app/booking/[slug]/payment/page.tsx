"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";
import BookingSummary from "@/components/BookingSummary";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import StickyBottomBar from "@/components/StickyBottomBar";
import { useBooking } from "@/components/BookingProvider";

export default function BookingPaymentPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { state, actions } = useBooking();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"upi" | "card" | "netbanking">("upi");

  const handlePay = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    actions.confirmBooking();
    router.push(`/booking/${params.slug}/confirmation`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-6 sm:px-6 lg:pb-0">
      <div className="mb-6">
        <StepIndicator currentStep={3} basePath={`/booking/${params.slug}`} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <h1 className="font-heading text-xl font-semibold text-forest-900">Complete payment</h1>

          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-400">Amount to pay</p>
                <p className="text-2xl font-bold text-forest-900">₹{state.total.toLocaleString()}</p>
              </div>
              <div className="text-right text-xs text-stone-400">
                <p>{state.hostel?.name}</p>
                <p>{state.checkIn} → {state.checkOut}</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePay();
            }}
          >
            <PaymentMethodSelector
              selected={method}
              onChange={setMethod}
              loading={loading}
            />
          </form>
        </div>

        <aside className="lg:w-80 lg:shrink-0">
          <div className="hidden lg:block">
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
          ctaLabel={loading ? "Processing..." : `Pay ₹${state.total}`}
          onCtaClick={handlePay}
          disabled={loading}
          show
        />
      </div>
    </div>
  );
}
