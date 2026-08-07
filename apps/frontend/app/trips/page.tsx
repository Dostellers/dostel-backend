'use client';

import Link from 'next/link';
import { useBooking } from '@/components/BookingProvider';
import Reveal from '@/components/Reveal';

/**
 * /trips — linked from the navbar on every page, but the route never existed
 * (a permanent 404 in the primary nav). Auth isn't wired yet, so this page
 * does the two honest things it can: resume a draft booking found in local
 * state, and say plainly what will live here once accounts land.
 */
export default function TripsPage() {
  const { state } = useBooking();
  const hasDraft = Boolean(state.checkIn && state.checkOut) || state.selectedRooms.length > 0;

  return (
    <div className="min-h-screen bg-paper pb-16 lg:pb-0">
      <section className="bg-ink-1000 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <span className="stamp text-yellow-300">My trips</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 max-w-2xl text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl">
              Where you&apos;re headed
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        {hasDraft ? (
          <Reveal>
            <div className="rounded-sm border border-ink-200 bg-white p-6">
              <p className="data text-xs uppercase tracking-[0.16em] text-coral-700">
                Unfinished booking
              </p>
              <h2 className="mt-3 text-2xl text-ink-1000">You were in the middle of something</h2>
              <dl className="data mt-4 space-y-1.5 text-sm text-ink-700">
                {state.checkIn && (
                  <div className="flex gap-3">
                    <dt className="w-24 text-ink-500">Dates</dt>
                    <dd>{state.checkIn} → {state.checkOut || '…'}</dd>
                  </div>
                )}
                {state.selectedRooms.length > 0 && (
                  <div className="flex gap-3">
                    <dt className="w-24 text-ink-500">Rooms</dt>
                    <dd>{state.selectedRooms.map((r) => `${r.name} ×${r.quantity}`).join(', ')}</dd>
                  </div>
                )}
                {state.total > 0 && (
                  <div className="flex gap-3">
                    <dt className="w-24 text-ink-500">Total</dt>
                    <dd className="font-semibold text-ink-1000">₹{state.total.toLocaleString('en-IN')}</dd>
                  </div>
                )}
              </dl>
              <Link
                href="/hostels/dostel-vattakanal"
                className="mt-6 inline-flex h-11 items-center rounded-sm bg-coral-600 px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-coral-700"
              >
                Pick up where you left off
              </Link>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="rounded-sm border border-ink-200 bg-white p-8 text-center">
              <h2 className="text-2xl text-ink-1000">No trips yet</h2>
              <p className="mx-auto mt-3 max-w-md leading-7 text-ink-700">
                Bookings you make will live here — upcoming stays, past ones, and the
                circuit you&apos;re part-way through.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/hostels"
                  className="inline-flex h-11 items-center justify-center rounded-sm bg-coral-600 px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-coral-700"
                >
                  Find a bed
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex h-11 items-center justify-center rounded-sm border border-ink-300 px-6 text-sm font-semibold text-ink-900 transition-colors duration-150 hover:border-ink-1000"
                >
                  Log in to see past trips
                </Link>
              </div>
            </div>
          </Reveal>
        )}

        <p className="data mt-6 text-center text-xs leading-5 text-ink-600">
          Trips sync to your account once you log in. Draft bookings live in this
          browser until then.
        </p>
      </section>
    </div>
  );
}
