interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  criteria: string;
}

interface BadgeGridProps {
  badges: Badge[];
  max?: number;
}

export default function BadgeGrid({ badges, max }: BadgeGridProps) {
  const display = max ? badges.slice(0, max) : badges;
  return (
    <div className="grid grid-cols-3 gap-3">
      {display.map((badge) => (
        <div
          key={badge.id}
          className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-250 ${
            badge.unlocked
              ? "border-stone-200 bg-white"
              : "border-stone-100 bg-stone-50 opacity-50"
          }`}
        >
          <span className={`text-2xl ${badge.unlocked ? "" : "grayscale"}`}>{badge.icon}</span>
          <span className={`text-xs font-medium ${badge.unlocked ? "text-forest-900" : "text-stone-400"}`}>
            {badge.name}
          </span>
          {!badge.unlocked && (
            <span className="text-[10px] text-stone-400 leading-tight">{badge.criteria}</span>
          )}
        </div>
      ))}
    </div>
  );
}
