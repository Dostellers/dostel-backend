interface PolicyPillsProps {
  policies: string[];
}

const policyIcons: Record<string, string> = {
  cancel: "🔄",
  "check-in": "🕐",
  id: "🆔",
  fee: "💰",
  curfew: "🌙",
  age: "🔞",
};

export default function PolicyPills({ policies }: PolicyPillsProps) {
  if (!policies.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4" role="list" aria-label="Policies">
      {policies.slice(0, 3).map((policy) => {
        const key = Object.keys(policyIcons).find((k) => policy.toLowerCase().includes(k));
        const icon = key ? policyIcons[key] : "📋";

        return (
          <span
            key={policy}
            role="listitem"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 whitespace-nowrap"
          >
            <span aria-hidden="true">{icon}</span>
            {policy}
          </span>
        );
      })}
    </div>
  );
}
