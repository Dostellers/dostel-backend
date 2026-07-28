import Link from "next/link";

interface QuickAction {
  label: string;
  icon: string;
  href: string;
  desc?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="flex flex-col items-center gap-2 rounded-xl border border-stone-200 bg-white p-4 text-center transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2"
        >
          <span className="text-2xl">{a.icon}</span>
          <span className="text-sm font-semibold text-forest-900">{a.label}</span>
          {a.desc && <span className="text-xs text-stone-400">{a.desc}</span>}
        </Link>
      ))}
    </div>
  );
}
