'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { hostels } from '@/lib/data';
import { KNOWN_FOR } from '@/lib/circuits';
import Reveal from '@/components/Reveal';

/**
 * The Exchange — a market board for beds.
 *
 * The stock-market metaphor works for a hostel network because rates and
 * scarcity are real market facts. The line it must not cross is the brand
 * line: every number here is a real field (rate, review volume, capacity,
 * trending flag). No fabricated ticks, no fake sparklines — a chart we
 * invented would cost us the only thing the site sells, which is being
 * believed.
 *
 * The watchlist lives in localStorage; alert intents are stored the same
 * way and say plainly that delivery starts when accounts land.
 */

const TICKER: Record<string, string> = {
  'dostel-vattakanal': 'VTK',
  'dostel-goa-beach': 'ANJ',
  'dostel-delhi-airport': 'DEL',
  'dostel-bangalore-hsr': 'BLR',
  'dostel-jaipur-mi-road': 'JPR',
  'dostel-coorg-rainforest': 'CRG',
  'dostel-dharamshala': 'DHR',
  'dostel-gokarna': 'GOK',
};

const WATCH_KEY = 'dostel-exchange-watchlist';
const ALERT_KEY = 'dostel-exchange-alerts';

type SortKey = 'price-asc' | 'price-desc' | 'volume' | 'name';

export default function ExchangePage() {
  const network = useMemo(
    () => hostels.filter((h) => h.slug.startsWith('dostel-')),
    [],
  );

  const [watch, setWatch] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('price-asc');

  useEffect(() => {
    try {
      setWatch(JSON.parse(localStorage.getItem(WATCH_KEY) || '[]'));
      setAlerts(JSON.parse(localStorage.getItem(ALERT_KEY) || '[]'));
    } catch {
      /* corrupted storage — start clean */
    }
  }, []);

  const toggle = (key: string, list: string[], setList: (v: string[]) => void, slug: string) => {
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    setList(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* storage full/blocked — state still works for this visit */
    }
  };

  const rows = useMemo(() => {
    const sorted = [...network];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'volume') sorted.sort((a, b) => b.reviews - a.reviews);
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    // Watched rows float to the top of whatever sort is active.
    return sorted.sort((a, b) => Number(watch.includes(b.slug)) - Number(watch.includes(a.slug)));
  }, [network, sort, watch]);

  const tickerLine = network
    .map((h) => `${TICKER[h.slug]} ₹${h.price}${h.isTrending ? ' ▲' : ' ·'}`)
    .join('   ');

  return (
    <div className="min-h-screen bg-paper pb-16 lg:pb-0">
      {/* ── Ticker ─────────────────────────────────────────── */}
      <div className="overflow-hidden border-b border-white/10 bg-ink-1000 py-2" aria-hidden="true">
        <div className="animate-marquee data whitespace-pre text-xs uppercase tracking-[0.2em] text-yellow-logo">
          {`${tickerLine}   ${tickerLine}   ${tickerLine}`}
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="bg-ink-1000 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Reveal>
            <span className="stamp text-yellow-300">The exchange</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 max-w-3xl text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl">
              Tonight&apos;s market for beds.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
              Every figure on this board is a real one — the rate, the review volume, the
              houses filling fast. Watch a hostel and it holds the top of your board.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Board ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="data text-xs uppercase tracking-[0.16em] text-ink-600" role="status">
            {network.length} listed · {watch.length} watched
          </p>
          <label className="flex items-center gap-2 text-sm text-ink-600">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="min-h-11 rounded-sm border border-ink-200 bg-white px-3 text-sm text-ink-1000"
            >
              <option value="price-asc">Rate: low to high</option>
              <option value="price-desc">Rate: high to low</option>
              <option value="volume">Most reviewed</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        <div className="mt-6 overflow-x-auto rounded-sm border border-ink-200 bg-white">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <caption className="sr-only">
              Live board of Dostel properties: nightly rate, Dosteller rate, review volume and demand
            </caption>
            <thead>
              <tr className="data border-b border-ink-200 text-[0.625rem] uppercase tracking-[0.2em] text-ink-500">
                <th scope="col" className="px-4 py-3 font-medium">Watch</th>
                <th scope="col" className="px-4 py-3 font-medium">Code</th>
                <th scope="col" className="px-4 py-3 font-medium">House</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Tonight</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Dosteller</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Volume</th>
                <th scope="col" className="px-4 py-3 font-medium">Demand</th>
                <th scope="col" className="px-4 py-3 font-medium"><span className="sr-only">Alert</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h) => {
                const watched = watch.includes(h.slug);
                const alerted = alerts.includes(h.slug);
                return (
                  <tr
                    key={h.slug}
                    className={`border-b border-ink-100 transition-colors last:border-0 ${watched ? 'bg-yellow-50/60' : 'hover:bg-ink-50'}`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggle(WATCH_KEY, watch, setWatch, h.slug)}
                        aria-pressed={watched}
                        aria-label={`${watched ? 'Remove' : 'Add'} ${h.name} ${watched ? 'from' : 'to'} watchlist`}
                        className="flex h-9 w-9 items-center justify-center rounded-sm text-ink-400 transition-colors hover:text-yellow-700"
                      >
                        <svg className={`h-5 w-5 ${watched ? 'text-yellow-600' : ''}`} viewBox="0 0 24 24" fill={watched ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                          <path d="m12 3 2.7 5.8 6.3.8-4.6 4.3 1.2 6.1L12 17l-5.6 3 1.2-6.1L3 9.6l6.3-.8z" />
                        </svg>
                      </button>
                    </td>
                    <td className="data px-4 py-3 font-semibold text-ink-1000">{TICKER[h.slug]}</td>
                    <td className="px-4 py-3">
                      <Link href={`/hostels/${h.slug}`} className="font-medium text-ink-1000 underline-offset-4 hover:underline">
                        {h.name}
                      </Link>
                      <span className="block text-xs text-ink-600">{KNOWN_FOR[h.slug]}</span>
                    </td>
                    <td className="data px-4 py-3 text-right text-lg font-semibold text-ink-1000">₹{h.price}</td>
                    <td className="data px-4 py-3 text-right text-ink-700">₹{Math.round(h.price * 0.9)}</td>
                    <td className="data px-4 py-3 text-right text-ink-700">
                      {h.reviews.toLocaleString('en-IN')}
                      <span className="block text-[0.625rem] uppercase tracking-[0.1em] text-ink-500">reviews</span>
                    </td>
                    <td className="px-4 py-3">
                      {h.isTrending ? (
                        <span className="data inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.1em] text-coral-700">
                          ▲ Filling
                        </span>
                      ) : (
                        <span className="data inline-flex items-center gap-1 text-xs uppercase tracking-[0.1em] text-ink-500">
                          · Open
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggle(ALERT_KEY, alerts, setAlerts, h.slug)}
                        aria-pressed={alerted}
                        className={`data min-h-9 whitespace-nowrap rounded-sm border px-3 text-[0.6875rem] uppercase tracking-[0.1em] transition-colors ${
                          alerted
                            ? 'border-success text-success'
                            : 'border-ink-300 text-ink-600 hover:border-ink-500'
                        }`}
                      >
                        {alerted ? '✓ Rate alert set' : 'Alert on drop'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="data mt-5 max-w-2xl text-xs leading-5 text-ink-600">
          Volume is all-time review count — the only demand series we hold today. Rate
          alerts are saved in this browser and start delivering when accounts launch;
          nothing here is a simulated market. When live occupancy lands (DOS-64), this
          board gets real beds-left numbers.
        </p>
      </section>
    </div>
  );
}
