'use client';

import { useEffect, useRef, useState } from 'react';

export type PolicyPillTone = 'neutral' | 'positive' | 'informative';

export interface PolicyPillItem {
  id: string;
  label: string;
  detail: string;
  tone: PolicyPillTone;
  icon: 'calendar-check' | 'clock' | 'id-card' | 'shield-check';
}

export interface PolicyPillsProps {
  items: readonly [PolicyPillItem, PolicyPillItem, PolicyPillItem];
  label?: string;
  onOpen?: (item: PolicyPillItem) => void;
  className?: string;
}

function PolicyIcon({ icon }: { icon: PolicyPillItem['icon'] }) {
  if (icon === 'clock') {
    return <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>;
  }

  if (icon === 'id-card') {
    return <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="11" r="2" /><path d="M5.5 16c.7-1.5 1.5-2 2.5-2s1.8.5 2.5 2M13 10h5M13 14h4" /></>;
  }

  if (icon === 'shield-check') {
    return <><path d="M12 3l8 3v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3z" /><path d="M8.5 12l2.2 2.2 4.8-5" /></>;
  }

  return <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 9h18M8 15l2 2 5-5" /></>;
}

export default function PolicyPills({ items, label = 'Important booking policies', onOpen, className = '' }: PolicyPillsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function toggle(item: PolicyPillItem) {
    const opening = expandedId !== item.id;
    setExpandedId(opening ? item.id : null);
    if (opening) onOpen?.(item);
  }

  return (
    <div ref={containerRef} className={`policy-list ${visible ? 'policy-list-visible' : ''} ${className}`}>
      <ul role="list" aria-label={label} className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
        {items.map((item) => {
          const expanded = expandedId === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`${item.id}-detail`}
                onClick={() => toggle(item)}
                className={`policy-pill policy-pill-${item.tone} inline-flex min-h-11 items-center gap-2 whitespace-nowrap px-4 text-sm font-semibold`}
              >
                <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <PolicyIcon icon={item.icon} />
                </svg>
                {item.label}
              </button>
              {expanded && (
                <div id={`${item.id}-detail`} role="region" className="policy-detail mt-2 max-w-72 p-3 text-sm text-stone-600">
                  {item.detail}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        .policy-list {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity var(--ds-motion-base) var(--ds-ease-out), transform var(--ds-motion-base) var(--ds-ease-out);
        }
        .policy-list-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .policy-pill {
          border: 1px solid var(--ds-color-stone-200);
          border-radius: var(--ds-radius-full);
          color: var(--ds-color-forest-900);
          transition: filter var(--ds-motion-fast), transform var(--ds-motion-fast) var(--ds-ease-in);
        }
        .policy-pill-neutral { background: var(--ds-color-white); }
        .policy-pill-positive { background: var(--ds-color-forest-100); border-color: var(--ds-color-forest-500); }
        .policy-pill-informative { background: #eaf2fb; border-color: var(--ds-color-sky); }
        .policy-pill:hover { filter: brightness(0.96); }
        .policy-pill:active { transform: scale(0.97); }
        .policy-pill:focus-visible { outline: 2px solid var(--ds-color-sky); outline-offset: 2px; }
        .policy-detail {
          background: var(--ds-color-white);
          border: 1px solid var(--ds-color-stone-200);
          border-radius: var(--ds-radius-md);
          animation: reveal var(--ds-motion-base) var(--ds-ease-out);
        }
        @keyframes reveal { from { opacity: 0; transform: translateY(-4px); } }
        @media (prefers-reduced-motion: reduce) {
          .policy-list, .policy-pill, .policy-detail { animation: none; transition: none; transform: none; }
        }
      `}</style>
    </div>
  );
}
