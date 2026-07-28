interface PointsBarProps {
  current: number;
  nextThreshold: number;
  tier: string;
  rewardValue: number;
}

export default function PointsBar({ current, nextThreshold, tier, rewardValue }: PointsBarProps) {
  const progress = Math.min((current / nextThreshold) * 100, 100);
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-forest-900">Your rewards</span>
        <span className="text-lg font-bold text-forest-500">₹{rewardValue}</span>
      </div>
      <p className="text-xs text-stone-400 mb-3">
        {current} points earned · <span className="text-forest-500">{nextThreshold - current} points</span> to {tier}
      </p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-forest-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
        <span>Earn 10 pts per ₹100 spent</span>
        <span>100 pts = ₹100 off</span>
      </div>
    </div>
  );
}
