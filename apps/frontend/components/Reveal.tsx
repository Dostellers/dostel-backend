'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Scroll-triggered reveal that FAILS OPEN.
 *
 * The server renders content fully visible. Only after hydration do below-fold
 * elements get hidden and observed; above-fold elements are never touched.
 * If client JS never runs — blocked dev origin, failed chunk, crawler, JS off —
 * the page stays completely readable.
 *
 * The previous version did the opposite (CSS hid everything, JS un-hid it) and
 * shipped a blank page to a real browser the moment hydration failed. Never
 * reintroduce a pattern where broken JS means missing content.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  // 'visible' (SSR default, no styles) -> 'pending' (hidden, observed) -> 'shown'
  const [state, setState] = useState<'visible' | 'pending' | 'shown'>('visible');

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Above the fold: never hide what the visitor may already be reading.
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState('pending');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-reveal={state}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
