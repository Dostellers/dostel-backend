"use client";

interface StickyBottomBarProps {
  price: number;
  total: number;
  ctaLabel: string;
  subtitle?: string;
  onCtaClick: () => void;
  disabled?: boolean;
  show?: boolean;
  currency?: string;
}

export default function StickyBottomBar({
  price,
  total,
  ctaLabel,
  subtitle,
  onCtaClick,
  disabled = false,
  show = true,
  currency = "₹",
}: StickyBottomBarProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 transition-transform duration-250 ease-out lg:static lg:border-none ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ boxShadow: "0 -4px 12px rgba(15,26,20,0.08)" }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 lg:h-auto lg:flex-col lg:gap-3 lg:p-0">
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-sm text-stone-600">
            {currency}{price}<span className="text-xs text-stone-400">/night</span>
          </span>
          <span className="text-xs text-stone-400">
            {currency}{total} total{subtitle ? ` · ${subtitle}` : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={onCtaClick}
          disabled={disabled}
          className="flex h-11 min-w-[140px] items-center justify-center rounded-lg bg-sunset px-6 text-sm font-semibold text-white transition-all duration-150 active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed hover:brightness-95 focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
