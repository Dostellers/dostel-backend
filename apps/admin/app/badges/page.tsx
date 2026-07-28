export default function AdminBadgesPage() {
  const badges = [
    { name: "Trailblazer", icon: "🥾", unlocked: 45, total: 120 },
    { name: "Storyteller", icon: "✍️", unlocked: 32, total: 120 },
    { name: "Social Butterfly", icon: "🦋", unlocked: 28, total: 120 },
    { name: "Remote Pro", icon: "💻", unlocked: 18, total: 120 },
    { name: "Hometown Hero", icon: "🏠", unlocked: 7, total: 120 },
    { name: "Early Adopter", icon: "⭐", unlocked: 89, total: 120 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold text-forest-900">Badges</h1>
        <p className="text-sm text-stone-400 mt-0.5">Community achievement badges</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => (
          <div key={badge.name} className="rounded-xl border border-stone-200 bg-white p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <p className="text-sm font-semibold text-forest-900">{badge.name}</p>
                <p className="text-xs text-stone-400">{badge.unlocked} of {badge.total} unlocked</p>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-sunset transition-all"
                style={{ width: `${Math.round((badge.unlocked / badge.total) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-stone-400">
              {Math.round((badge.unlocked / badge.total) * 100)}% adoption
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
