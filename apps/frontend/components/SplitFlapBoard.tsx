'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Split-flap departure board — the landing page's signature element.
 *
 * The animation is the content, not decoration: a mechanical board is the
 * actual artifact of leaving somewhere, and it is the noticeboard concept
 * (.paperclip/design/brand-platform.md §3) in its most kinetic form.
 *
 * Each cell cycles through a charset and settles, staggered left-to-right so
 * the row resolves like real hardware. Rows re-flip on an interval to cycle
 * through what is actually happening at the property this week.
 */

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ·₹';
const FLIP_MS = 42;     // per-character tick
const STAGGER_MS = 26;  // delay between adjacent cells
const SETTLE_TICKS = 7; // how many characters flick past before landing

export type BoardRow = {
  what: string;
  where: string;
  when: string;
  status: string;
  /** Highlights the status cell — use for the row a guest can still act on. */
  live?: boolean;
};

function Cell({ target, index, run }: { target: string; index: number; run: number }) {
  const [char, setChar] = useState(target);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setChar(target);
      return;
    }

    timers.current.forEach(clearTimeout);
    timers.current = [];

    const start = index * STAGGER_MS;
    for (let tick = 0; tick < SETTLE_TICKS; tick += 1) {
      timers.current.push(
        setTimeout(() => {
          setChar(CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? target);
        }, start + tick * FLIP_MS),
      );
    }
    timers.current.push(
      setTimeout(() => setChar(target), start + SETTLE_TICKS * FLIP_MS),
    );

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [target, index, run]);

  return (
    <span className="flap" aria-hidden="true">
      {char === ' ' ? ' ' : char}
    </span>
  );
}

function Word({ text, width, offset, run }: { text: string; width: number; offset: number; run: number }) {
  const padded = text.toUpperCase().slice(0, width).padEnd(width, ' ');
  return (
    <span className="flex gap-[2px]">
      {padded.split('').map((c, i) => (
        <Cell key={i} target={c} index={offset + i} run={run} />
      ))}
    </span>
  );
}

export default function SplitFlapBoard({ rows }: { rows: BoardRow[] }) {
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  // Only start flipping once the board is actually on screen, so the animation
  // is not already over by the time a visitor scrolls to it.
  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const t = setInterval(() => setRun((r) => r + 1), 9000);
    return () => clearInterval(t);
  }, [started]);

  return (
    <div ref={hostRef} className="board-frame">
      <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 sm:px-6">
        <p className="data text-[0.6875rem] uppercase tracking-[0.28em] text-yellow-300">
          Vattakanal · this week
        </p>
        <span className="flex items-center gap-2">
          <span className="board-pulse" aria-hidden="true" />
          <span className="data text-[0.6875rem] uppercase tracking-[0.18em] text-white/50">Live</span>
        </span>
      </div>

      {/* Screen readers get the real table; the flaps are decorative. */}
      <table className="sr-only">
        <caption>What is happening at Dostel Vattakanal this week</caption>
        <thead>
          <tr><th>What</th><th>Where</th><th>When</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.what}><td>{r.what}</td><td>{r.where}</td><td>{r.when}</td><td>{r.status}</td></tr>
          ))}
        </tbody>
      </table>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="min-w-[45rem] px-4 py-4 sm:px-6 sm:py-5">
          <div className="data mb-3 grid grid-cols-[13rem_13rem_4.5rem_1fr] gap-3 text-[0.625rem] uppercase tracking-[0.2em] text-white/35">
            <span>What</span><span>Where</span><span>When</span><span>Status</span>
          </div>

          {rows.map((row, r) => (
            <div
              key={row.what}
              className="grid grid-cols-[13rem_13rem_4.5rem_1fr] items-center gap-3 border-t border-white/10 py-2.5"
            >
              <Word text={row.what} width={14} offset={r * 3} run={run} />
              <Word text={row.where} width={14} offset={r * 3 + 5} run={run} />
              <Word text={row.when} width={5} offset={r * 3 + 9} run={run} />
              <span className={row.live ? 'flap-live' : 'flap-muted'}>
                <Word text={row.status} width={10} offset={r * 3 + 12} run={run} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
