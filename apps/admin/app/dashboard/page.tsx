'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { useState } from 'react';

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats($dayStart: Date!, $nextDayStart: Date!) {
    dashboardStats(dayStart: $dayStart, nextDayStart: $nextDayStart) {
      occupancyPercent
      roomsAvailable
      checkInsToday
      checkOutsToday
      openBookings
    }
  }
`;

type DashboardStats = {
  occupancyPercent: number;
  roomsAvailable: number;
  checkInsToday: number;
  checkOutsToday: number;
  openBookings: number;
};

const getDayBoundaries = () => {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const nextDayStart = new Date(dayStart);
  nextDayStart.setDate(nextDayStart.getDate() + 1);

  return {
    dayStart: dayStart.toISOString(),
    nextDayStart: nextDayStart.toISOString()
  };
};

const metricDetails = [
  {
    key: 'occupancyPercent' as const,
    label: 'Occupancy',
    context: 'Rooms in use',
    href: '/rooms',
    accent: 'bg-[#e07a2f]',
    format: (value: number) => `${Math.round(value)}%`
  },
  {
    key: 'roomsAvailable' as const,
    label: 'Rooms available',
    context: 'Ready to sell',
    href: '/rooms',
    accent: 'bg-[#2d6a4f]',
    format: (value: number) => String(value)
  },
  {
    key: 'checkInsToday' as const,
    label: 'Check-ins today',
    context: 'Arrivals expected',
    href: '/bookings',
    accent: 'bg-[#2b6cb0]',
    format: (value: number) => String(value)
  },
  {
    key: 'checkOutsToday' as const,
    label: 'Check-outs today',
    context: 'Departures expected',
    href: '/bookings',
    accent: 'bg-[#d4a373]',
    format: (value: number) => String(value)
  },
  {
    key: 'openBookings' as const,
    label: 'Open bookings',
    context: 'Need attention',
    href: '/bookings',
    accent: 'bg-[#0f1a14]',
    format: (value: number) => String(value)
  }
];

export default function DashboardPage() {
  const [boundaries] = useState(getDayBoundaries);
  const { data, loading, error, refetch } = useQuery<{ dashboardStats: DashboardStats }>(GET_DASHBOARD_STATS, {
    variables: boundaries,
    pollInterval: 60000
  });
  const dateLabel = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <main className="min-h-screen bg-[#f7f3e9] px-6 py-8 text-[#0f1a14] lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1180px]">
        <header className="flex flex-col gap-5 border-b border-[#0f1a14]/15 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#e07a2f]">Daily operations</p>
            <h1 className="text-4xl font-semibold tracking-[-0.035em] text-[#0f1a14] md:text-5xl">Good morning.</h1>
            <p className="mt-2 text-sm text-[#6b6258]">{dateLabel} · Live property overview</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="w-fit border border-[#0f1a14]/20 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition hover:border-[#0f1a14] hover:bg-white disabled:opacity-50"
          >
            {loading ? 'Refreshing' : 'Refresh data'}
          </button>
        </header>

        {error ? (
          <section className="mt-8 border-l-4 border-red-700 bg-white p-6" role="alert">
            <h2 className="text-xl font-semibold">The dashboard could not be loaded.</h2>
            <p className="mt-1 text-sm text-[#6b6258]">{error.message}</p>
          </section>
        ) : (
          <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6" aria-busy={loading}>
            {metricDetails.map((metric, index) => {
              const value = data?.dashboardStats[metric.key];
              const wideCard = index < 2 ? 'xl:col-span-3' : 'xl:col-span-2';

              return (
                <Link
                  key={metric.key}
                  href={metric.href}
                  className={`group relative min-h-52 overflow-hidden border border-[#0f1a14]/10 bg-[#fffdf8] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#0f1a14]/35 hover:shadow-[0_18px_45px_rgba(15,26,20,0.1)] ${wideCard}`}
                >
                  <span className={`absolute left-0 top-0 h-1 w-14 transition-all duration-300 group-hover:w-full ${metric.accent}`} />
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b6258]">{metric.label}</p>
                        <p className="mt-2 text-sm text-[#a89f94]">{metric.context}</p>
                      </div>
                      <span className="text-lg text-[#0f1a14]/35 transition group-hover:translate-x-1 group-hover:text-[#0f1a14]">→</span>
                    </div>
                    <p className="text-6xl font-semibold tracking-[-0.06em] text-[#0f1a14]">
                      {value === undefined ? <span className="text-[#e6e0d8]">—</span> : metric.format(value)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </section>
        )}

        <footer className="mt-8 flex items-center justify-between border-t border-[#0f1a14]/15 pt-5 text-xs text-[#6b6258]">
          <p>Updates automatically every minute</p>
          <Link href="/bookings" className="font-semibold uppercase tracking-[0.12em] text-[#0f1a14] hover:text-[#e07a2f]">View all bookings</Link>
        </footer>
      </div>
    </main>
  );
}
