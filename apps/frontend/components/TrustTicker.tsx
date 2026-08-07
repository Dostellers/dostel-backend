"use client";

import { trustBadges } from "@/lib/data";

export default function TrustTicker({ className = "" }: { className?: string }) {
  const repeated = [...trustBadges, ...trustBadges, ...trustBadges];
  return (
    <div className={`overflow-hidden bg-stone-200/30 border-t border-stone-200 backdrop-blur-sm py-4 ${className}`}>
      <div className="flex animate-marquee gap-10 whitespace-nowrap">
        {repeated.map((b, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[var(--color-text-primary)] text-sm font-medium shrink-0 opacity-80 hover:opacity-100 transition-opacity duration-200">
            <span className="text-xl">{b.icon}</span>
            <span className="ml-1">{b.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
