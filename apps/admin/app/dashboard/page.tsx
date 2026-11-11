/* Callers: Next.js App Router serves this at /dashboard; AuthGate shell wraps it.
   Existing dashboard/page.tsx used cream/forest palette; replacing in place with
   Dostel coral/ink ops board. Same GraphQL query dashboardStats.
   Schema: dashboardStats { occupancyPercent, roomsAvailable, checkInsToday,
   checkOutsToday, openBookings } via dayStart/nextDayStart Date args.
   User: "review and build admin dashboard end to end in dostellers colors.
   Also use skills /frontend-design /ui-ux-pro-max" */

'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'

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
`

type DashboardStats = {
  occupancyPercent: number
  roomsAvailable: number
  checkInsToday: number
  checkOutsToday: number
  openBookings: number
}

const getDayBoundaries = () => {
  const dayStart = new Date()
  dayStart.setHours(0, 0, 0, 0)
  const nextDayStart = new Date(dayStart)
  nextDayStart.setDate(nextDayStart.getDate() + 1)
  return {
    dayStart: dayStart.toISOString(),
    nextDayStart: nextDayStart.toISOString(),
  }
}

const metricDetails = [
  {
    key: 'occupancyPercent' as const,
    label: 'Occupancy',
    context: 'Beds / rooms in use',
    href: '/rooms',
    accent: 'bg-coral-600',
    format: (value: number) => `${Math.round(value)}%`,
  },
  {
    key: 'roomsAvailable' as const,
    label: 'Rooms ready',
    context: 'Sellable tonight',
    href: '/rooms',
    accent: 'bg-success',
    format: (value: number) => String(value),
  },
  {
    key: 'checkInsToday' as const,
    label: 'Arrivals',
    context: 'Check-ins today',
    href: '/bookings',
    accent: 'bg-info',
    format: (value: number) => String(value),
  },
  {
    key: 'checkOutsToday' as const,
    label: 'Departures',
    context: 'Check-outs today',
    href: '/bookings',
    accent: 'bg-warning',
    format: (value: number) => String(value),
  },
  {
    key: 'openBookings' as const,
    label: 'Open bookings',
    context: 'Need desk attention',
    href: '/bookings',
    accent: 'bg-ink-900',
    format: (value: number) => String(value),
  },
]

export default function DashboardPage () {
  const [boundaries] = useState(getDayBoundaries)
  const { data, loading, error, refetch } = useQuery<{ dashboardStats: DashboardStats }>(
    GET_DASHBOARD_STATS,
    { variables: boundaries, pollInterval: 60000 }
  )

  const dateLabel = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <main className="min-h-dvh px-5 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <PageHeader
          live
          title={`${greeting}.`}
          description={`${dateLabel} · Live property overview`}
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
          }
        />

        {error ? (
          <section
            className="reveal-card rounded-xl border border-error/30 bg-white p-6"
            role="alert"
          >
            <p className="stamp text-error mb-3">Error</p>
            <h2 className="text-xl font-bold text-ink-1000">Dashboard could not load</h2>
            <p className="mt-1 text-sm text-ink-500">{error.message}</p>
            <Button className="mt-4" type="button" onClick={() => refetch()}>
              Retry
            </Button>
          </section>
        ) : (
          <section
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6"
            aria-busy={loading}
            aria-label="Operations metrics"
          >
            {metricDetails.map((metric, index) => {
              const value = data?.dashboardStats?.[metric.key]
              const wide = index < 2 ? 'xl:col-span-3' : 'xl:col-span-2'
              return (
                <Link
                  key={metric.key}
                  href={metric.href}
                  className={`reveal-card group relative min-h-[13.5rem] overflow-hidden rounded-xl border border-ink-200 bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:border-ink-400 hover:shadow-[0_16px_40px_rgba(11,11,12,0.08)] ${wide}`}
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <span
                    className={`absolute left-0 top-0 h-1 w-12 transition-all duration-300 group-hover:w-full ${metric.accent}`}
                    aria-hidden
                  />
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-500">
                          {metric.label}
                        </p>
                        <p className="mt-1 text-sm text-ink-400">{metric.context}</p>
                      </div>
                      <span
                        className="font-data text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-coral-600"
                        aria-hidden
                      >
                        →
                      </span>
                    </div>
                    <p className="font-data text-5xl font-semibold tracking-tight text-ink-1000 sm:text-6xl">
                      {loading || value === undefined ? (
                        <span className="skeleton inline-block h-12 w-24" aria-hidden />
                      ) : (
                        metric.format(value)
                      )}
                    </p>
                  </div>
                </Link>
              )
            })}
          </section>
        )}

        <footer className="mt-8 flex flex-col gap-3 border-t border-ink-200 pt-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Auto-refreshes every minute</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/hostels" className="font-semibold uppercase tracking-[0.12em] text-ink-800 hover:text-coral-700">
              Hostels
            </Link>
            <Link href="/bookings" className="font-semibold uppercase tracking-[0.12em] text-ink-800 hover:text-coral-700">
              Bookings
            </Link>
            <Link href="/rooms" className="font-semibold uppercase tracking-[0.12em] text-ink-800 hover:text-coral-700">
              Rooms
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
