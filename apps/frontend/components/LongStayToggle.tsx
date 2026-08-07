"use client";

interface LongStayToggleProps {
  onToggle: (active: boolean) => void;
  active: boolean;
  dostellerDiscount?: number;
  isDosteller?: boolean;
  weeklyPrice?: number;
  monthlyPrice?: number;
}

export default function LongStayToggle({
  onToggle,
  active,
  dostellerDiscount = 40,
}: LongStayToggleProps) {
  return (
    <div className="rounded-xl border border-forest-100 bg-forest-100/30 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-forest-900">Staying 7+ nights?</p>
          <p className="text-xs text-forest-700">
            Dostellers save up to {dostellerDiscount}% on long stays
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={active}
          onClick={() => onToggle(!active)}
          className={`relative h-7 w-12 rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2 ${
            active ? "bg-forest-500" : "bg-stone-200"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-150 ${
              active ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      {active && (
        <p className="mt-2 text-xs text-forest-700">
          You&apos;re saving ₹— with long-stay pricing. Join Dostellers for even bigger discounts.
        </p>
      )}
    </div>
  );
}
