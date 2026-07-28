"use client";

import { categories } from "@/lib/data";

interface CategoryFilterProps {
  onSelect: (category: string) => void;
  selected: string;
}

export default function CategoryFilter({ onSelect, selected }: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            selected === cat.id
              ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]"
              : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-light)] hover:text-[var(--color-brand-primary)] border-[var(--color-border)]"
          }`}
        >
          <span className="text-xl">{cat.icon}</span>
          <span className="ml-1">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
