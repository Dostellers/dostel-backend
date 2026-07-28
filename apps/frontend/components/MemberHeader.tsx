interface MemberHeaderProps {
  name: string;
  tier: string;
  avatar?: string;
}

export default function MemberHeader({ name, tier, avatar }: MemberHeaderProps) {
  const tierColor = tier === "Gold" ? "text-sunset" : tier === "Silver" ? "text-stone-400" : "text-stone-600";
  const tierBg = tier === "Gold" ? "bg-sunset/10" : tier === "Silver" ? "bg-stone-100" : "bg-stone-100";
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-2xl">
        {avatar || "👤"}
      </div>
      <div>
        <h1 className="font-heading text-xl font-semibold text-forest-900">Welcome back, {name.split(" ")[0]}</h1>
        <div className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full ${tierBg} px-3 py-0.5`}>
          <span className={`text-xs font-semibold ${tierColor}`}>{tier} Dosteller</span>
        </div>
      </div>
    </div>
  );
}
