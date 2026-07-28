interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
}

export default function MetricCard({ label, value, change, changeType }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-forest-900">{value}</p>
      {change && (
        <p className={`mt-1 text-xs font-medium ${changeType === "positive" ? "text-success" : "text-error"}`}>
          {change} vs last week
        </p>
      )}
    </div>
  );
}
