import { CheckIcon, ShieldIcon, LockIcon } from "./Icons";

// Callers: booking/[slug]/review/page.tsx. Existing totals UI — extended for
// Hostelworld deposit vs pay-at-property. User: build Hostelworld payment arch + design.
interface PriceBreakdownProps {
  subtotal: number;
  taxes: number;
  serviceFee: number;
  total: number;
  currency?: string;
  depositDue?: number;
  payAtProperty?: number;
  rateLabel?: string;
  refundable?: boolean;
}

export default function PriceBreakdown({
  subtotal,
  taxes,
  serviceFee,
  total,
  currency = "₹",
  depositDue,
  payAtProperty,
  rateLabel,
  refundable,
}: PriceBreakdownProps) {
  const dueNow = depositDue != null ? depositDue : total;
  const dueAtProperty = payAtProperty != null ? payAtProperty : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-stone-600">Room total</span>
        <span className="text-forest-900 font-medium">
          {currency}{subtotal.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-stone-600">Taxes (12%)</span>
        <span className="text-forest-900 font-medium">
          {currency}{taxes.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-stone-600">Service fee</span>
        <span className="text-forest-900 font-medium">
          {currency}{serviceFee.toLocaleString()}
        </span>
      </div>
      <div className="border-t border-stone-200 pt-2" />
      <div className="flex justify-between">
        <span className="font-semibold text-forest-900">Stay total</span>
        <span className="font-bold text-forest-900 text-lg">
          {currency}{total.toLocaleString()}
        </span>
      </div>
      <div className="rounded-lg bg-coral-50 px-3 py-2 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-coral-700">
            {dueAtProperty > 0 ? 'Pay now (deposit)' : 'Pay now (full stay)'}
          </span>
          <span className="font-data font-semibold text-coral-700">
            {currency}{dueNow.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-600">Due at property</span>
          <span className="font-data font-medium text-forest-900">
            {currency}{dueAtProperty.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
          <CheckIcon className="h-3 w-3" />
          {rateLabel || (refundable === false ? 'Non-refundable' : 'Free cancellation')}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-2.5 py-0.5 text-xs font-medium text-sky">
          <ShieldIcon className="h-3 w-3" />
          Deposit secures bed
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-medium text-forest-700">
          <LockIcon className="h-3 w-3" />
          Secure payment
        </span>
      </div>
    </div>
  );
}
