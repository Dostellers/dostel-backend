"use client";

import { categories } from "@/lib/data";

export default function CategoryTicker() {
  const repeated = [...categories, ...categories, ...categories];
  return (
    <div className="overflow-hidden py-5 border-b border-[var(--color-border)]">
      <div className="flex animate-marquee gap-4 whitespace-nowrap">
        {repeated.map((cat, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] shrink-0 hover:bg-[var(--color-brand-secondary)] hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="ml-1">{cat.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
