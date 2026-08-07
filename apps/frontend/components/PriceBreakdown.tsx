import { CheckIcon, ShieldIcon, LockIcon } from "./Icons";

interface PriceBreakdownProps {
  subtotal: number;
  taxes: number;
  serviceFee: number;
  total: number;
  currency?: string;
}

export default function PriceBreakdown({
  subtotal,
  taxes,
  serviceFee,
  total,
  currency = "₹",
}: PriceBreakdownProps) {
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
        <span className="font-semibold text-forest-900">Total</span>
        <span className="font-bold text-forest-900 text-lg">
          {currency}{total.toLocaleString()}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
          <CheckIcon className="h-3 w-3" />
          Free cancellation
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-sky/10 px-2.5 py-0.5 text-xs font-medium text-sky">
          <ShieldIcon className="h-3 w-3" />
          No booking fees
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-medium text-forest-700">
          <LockIcon className="h-3 w-3" />
          Secure payment
        </span>
      </div>
    </div>
  );
}
