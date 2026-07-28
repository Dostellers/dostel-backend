interface StatusBadgeProps {
  status: string;
  config: Record<string, { label: string; color: string }>;
}

export default function StatusBadge({ status, config }: StatusBadgeProps) {
  const c = config[status] || { label: status, color: "bg-stone-100 text-stone-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.color}`}>
      {c.label}
    </span>
  );
}
