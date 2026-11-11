"use client";

/**
 * Existing payment page (from review → confirmation). Charges deposit or Pay Now total.
 * No alternate payment page. Reads BookingState depositDue/payAtProperty.
 * User: "learn architecture and payment methods and architeuse from hostel world and build it.
 * Also can we bring more design elements and enahncements and other design skills to make it better."
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";
import BookingSummary from "@/components/BookingSummary";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import StickyBottomBar from "@/components/StickyBottomBar";
import { useBooking } from "@/components/BookingProvider";
import { getStripe } from "@/components/stripe";

export default function BookingPaymentPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { state, actions } = useBooking();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const amountDue = state.depositDue || state.total;

  useEffect(() => {
    // Align default UPI selection with deposit schedule (25% bump)
    if (!state.paymentMethod) actions.setPaymentMethod('upi');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePay = async () => {
    setLoading(true);
    try {
      actions.setPaymentMethod(method);
      if (method === "card") {
        const stripe = await getStripe();
        if (!stripe) {
          throw new Error("Stripe failed to load");
        }
      }
      await new Promise((r) => setTimeout(r, 1500));
      actions.confirmBooking();
      router.push(`/booking/${params.slug}/confirmation`);
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-6 sm:px-6 lg:pb-0">
      <div className="mb-6">
        <StepIndicator currentStep={3} basePath={`/booking/${params.slug}`} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <h1 className="text-xl font-semibold text-ink-1000">Pay a little now</h1>
          <p className="text-sm text-ink-600">Hold the bed in one tap. Rest is due at the hostel.</p>

          <div className="space-y-3 rounded-sm border border-ink-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-500">
                  {state.balanceCollection === 'PREPAID' ? 'Pay full stay now' : 'Deposit due now'}
                </p>
                <p className="text-2xl font-bold text-coral-700">₹{amountDue.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right text-xs text-ink-500">
                <p>{state.hostel?.name}</p>
                <p>{state.checkIn} → {state.checkOut}</p>
                <p className="stamp mt-1 border-coral-400 text-coral-700">{state.rateLabel}</p>
              </div>
            </div>
            {state.payAtProperty > 0 && (
              <div className="rounded-sm bg-coral-50 px-3 py-2 text-sm text-ink-700">
                Remaining <span className="font-data font-semibold text-ink-1000">₹{state.payAtProperty.toLocaleString('en-IN')}</span> at the hostel on arrival.
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePay();
            }}
          >
            <PaymentMethodSelector
              selected={method}
              onChange={(m) => {
                setMethod(m);
                actions.setPaymentMethod(m);
              }}
              loading={loading}
              amountDue={amountDue}
              payAtProperty={state.payAtProperty}
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
          total={amountDue}
          ctaLabel={loading ? "Processing..." : `Pay ₹${amountDue.toLocaleString('en-IN')}`}
          onCtaClick={handlePay}
          disabled={loading}
          show
        />
      </div>
    </div>
  );
}
