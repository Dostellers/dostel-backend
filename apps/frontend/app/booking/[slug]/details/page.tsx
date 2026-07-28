"use client";

import { useRouter } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";
import GuestDetailsForm from "@/components/GuestDetailsForm";
import BookingSummary from "@/components/BookingSummary";
import StickyBottomBar from "@/components/StickyBottomBar";
import { useBooking } from "@/components/BookingProvider";
import type { BookingState } from "@/components/BookingProvider";

export default function BookingDetailsPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { state, actions } = useBooking();

  const handleSubmit = (data: BookingState["guestInfo"]) => {
    actions.updateGuestInfo(data);
    router.push(`/booking/${params.slug}/review`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-6 sm:px-6 lg:pb-0">
      <div className="mb-6">
        <StepIndicator currentStep={1} basePath={`/booking/${params.slug}`} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="font-heading text-xl font-semibold text-forest-900">Guest details</h1>
            <p className="mt-1 text-sm text-stone-400">We need these for check-in</p>
          </div>
          <GuestDetailsForm
            onSubmit={handleSubmit}
            initialData={state.guestInfo}
          />
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
          ctaLabel="Continue to review"
          onCtaClick={() => {
            const form = document.querySelector("form");
            form?.requestSubmit();
          }}
          show
        />
      </div>
    </div>
  );
}
