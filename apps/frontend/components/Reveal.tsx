'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Scroll-triggered reveal. One shared primitive so motion stays consistent
 * instead of every section inventing its own entrance.
 *
 * Reveals once and then stops observing — content that re-animates every time
 * it re-enters the viewport reads as a gimmick on a long marketing page.
 * `prefers-reduced-motion` is handled in CSS, so the element is always visible
 * even if this never runs.
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
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Already in view on load (above the fold) — show immediately, no flash.
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
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
      data-shown={shown ? 'true' : 'false'}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
