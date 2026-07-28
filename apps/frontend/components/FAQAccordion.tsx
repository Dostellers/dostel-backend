"use client";

import { useState } from "react";

interface Props {
  faqs: { q: string; a: string }[];
  className?: string;
}

export default function FAQAccordion({ faqs, className = "" }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={`space-y-3 ${className}`}>
      {faqs.map((faq, i) => (
        <div key={i} className="border border-stone-200 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex items-center justify-between w-full px-6 py-4 text-left text-forest-700 font-medium hover:bg-forest-100/50 transition-colors duration-150"
            aria-expanded={open === i}
          >
            {faq.q}
            <svg
              className={`w-5 h-5 text-forest-500 shrink-0 ml-3 transition-transform duration-150 ${open === i ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-stone-600 text-sm leading-relaxed bg-snow">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
