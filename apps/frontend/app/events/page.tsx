'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { events } from '@/lib/data';
import SplitFlapBoard, { type BoardRow } from '@/components/SplitFlapBoard';
import Reveal from '@/components/Reveal';

/* The events page is where the split-flap board is most literal: a departures
   board of things about to happen. Rows derive from the same data as the
   cards below — the board is never decoration with different facts. */

const shortDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return `${String(d.getDate()).padStart(2, '0')}${d.toLocaleString('en', { month: 'short' }).toUpperCase().slice(0, 3)}`;
};

export default function EventsPage() {
  const [cat, setCat] = useState('all');

  const cats = useMemo(() => {
    const seen = new Map<string, string>();
    events.forEach((e) => seen.set(e.category, e.categoryLabel));
    return [...seen.entries()];
  }, []);

  const list = useMemo(
    () => (cat === 'all' ? events : events.filter((e) => e.category === cat)),
    [cat],
  );

  const boardRows: BoardRow[] = events.slice(0, 6).map((e) => ({
    what: e.title,
    where: e.location.split(',')[0]?.trim() ?? '',
    when: shortDate(e.startDate),
    status: e.spotsLeft <= 0 ? 'Full' : `${e.spotsLeft} left`,
    live: e.spotsLeft > 0 && e.spotsLeft <= 40,
  }));

  return (
    <div className="min-h-screen bg-paper pb-16 lg:pb-0">
      {/* ── Board hero ───────────────────────────────────────── */}
      <section className="bg-ink-1000 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="min-w-0">
              <Reveal>
                <span className="stamp text-yellow-300">Events</span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-5 text-[2.75rem] leading-[0.95] tracking-[-0.035em] text-white sm:text-6xl">
                  What&apos;s about<br />to happen
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 max-w-md text-lg leading-8 text-white/70">
                  Treks, walks, workshops and the occasional very loud night — run by the
                  houses and the people staying in them.
                </p>
              </Reveal>
            </div>
            <Reveal delay={200} className="min-w-0">
              <SplitFlapBoard
                rows={boardRows}
                title="Departures · events"
                columns={['Event', 'Where', 'On', 'Spots']}
                caption="Upcoming events across the Dostel network"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Filter ───────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 border-b border-ink-200 bg-paper/95 backdrop-blur-md">
        <div className="scrollbar-hide mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {[['all', `All ${events.length}`], ...cats].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setCat(id)}
              aria-pressed={cat === id}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-sm border px-4 text-sm font-medium transition-colors duration-150 ${
                cat === id
                  ? 'border-coral-600 bg-coral-600 text-white'
                  : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Cards ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e, i) => (
            <Reveal key={e.slug} delay={(i % 3) * 80}>
              <article className="flex h-full flex-col overflow-hidden rounded-sm border border-ink-200 bg-white">
                <div className="relative">
                  <div
                    className="aspect-[16/9] w-full bg-ink-100 bg-cover bg-center"
                    style={{ backgroundImage: `url(${e.image})` }}
                    role="presentation"
                  />
                  <span className="absolute left-0 top-4 bg-ink-1000 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white">
                    {e.categoryLabel}
                  </span>
                  {e.spotsLeft > 0 && e.spotsLeft <= 40 && (
                    <span className="absolute right-0 top-4 bg-coral-600 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white">
                      {e.spotsLeft} spots left
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="data text-[0.6875rem] uppercase tracking-[0.14em] text-ink-500">
                    {e.date} · {e.duration}
                  </p>
                  <h2 className="mt-2 text-lg leading-tight text-ink-1000">{e.title}</h2>
                  <p className="mt-1 text-sm text-ink-600">{e.location}</p>
                  <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-ink-700">{e.description}</p>
                  <div className="mt-4 flex items-end justify-between border-t border-ink-200 pt-4">
                    <div>
                      <span className="data text-xl font-semibold text-ink-1000">₹{e.price.toLocaleString('en-IN')}</span>
                      {e.originalPrice > e.price && (
                        <span className="data ml-2 text-xs text-ink-500 line-through">₹{e.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <Link
                      href={`/hostels/${e.hostel}`}
                      className="text-sm font-semibold text-coral-700 underline-offset-4 hover:underline"
                    >
                      Stay nearby
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="data mt-8 text-xs leading-5 text-ink-600">
          Events are run by properties and guests. Dates and spot counts are the
          organiser&apos;s numbers — confirm with the house before travelling for one.
        </p>
      </section>
    </div>
  );
}
