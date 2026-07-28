import { TrendingIcon } from "./Icons";

interface SocialProofProps {
  count: number;
  label: string;
  variant?: "card" | "detail" | "badge";
}

export default function SocialProof({ count, label, variant = "card" }: SocialProofProps) {
  if (count < 5) return null;

  if (variant === "badge") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sunset/10 px-2.5 py-0.5 text-xs font-semibold text-sunset">
        <TrendingIcon className="h-3 w-3" />
        {count} {label}
      </span>
    );
  }

  if (variant === "detail") {
    return (
      <p className="text-sm text-forest-500 font-medium flex items-center gap-1.5">
        <TrendingIcon className="h-3.5 w-3.5" />
        <span>{count} {label}</span>
      </p>
    );
  }

  return (
    <p className="text-xs text-stone-400 flex items-center gap-1">
      <TrendingIcon className="h-3 w-3" />
      <span>{count} {label}</span>
    </p>
  );
}
