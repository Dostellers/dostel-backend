interface TierCardProps {
  tier: { id: string; name: string; price: number; period: "free" | "/yr"; description: string; benefits: string[]; ctaLabel: string; highlighted: boolean; color: string };
  selected: boolean;
  onSelect: () => void;
}

export default function TierCard({ tier, selected, onSelect }: TierCardProps) {
  const isFree = tier.price === 0;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-1 flex-col rounded-2xl border-2 p-5 text-left transition-all duration-250 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2 ${
        selected
          ? "border-forest-500 bg-white shadow-md"
          : tier.highlighted
            ? "border-sunset/40 bg-white shadow-sm"
            : "border-stone-200 bg-white hover:border-stone-400"
      }`}
    >
      {tier.highlighted && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-sunset px-3 py-0.5 text-xs font-semibold text-white">
          Most popular
        </span>
      )}
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-semibold text-forest-900">{tier.name}</span>
        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
          selected ? "border-forest-500 bg-forest-500" : "border-stone-300"
        }`}>
          {selected && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        </div>
      </div>
      <div className="mb-2">
        <span className="text-3xl font-bold text-forest-900">{isFree ? "Free" : `₹${tier.price}`}</span>
        {!isFree && <span className="text-sm text-stone-400">{tier.period}</span>}
      </div>
      <p className="text-xs text-stone-400 mb-4">{tier.description}</p>
      <ul className="space-y-2 mb-5">
        {tier.benefits.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm text-stone-600">
            <svg className="h-4 w-4 shrink-0 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {b}
          </li>
        ))}
      </ul>
      <div className={`mt-auto rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-all duration-150 active:scale-[0.97] ${
        selected ? "bg-forest-500 text-white" : "bg-stone-100 text-forest-900 hover:bg-stone-200"
      }`}>
        {tier.ctaLabel}
      </div>
    </button>
  );
}
