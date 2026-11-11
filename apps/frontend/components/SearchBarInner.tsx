'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DateRangeField from '@/components/ui/DateRangeField'
import GuestSelect from '@/components/ui/GuestSelect'
import DestinationField from '@/components/ui/DestinationField'

interface SearchBarProps {
  variant?: 'home' | 'sticky' | 'compact' | 'hero'
  dark?: boolean
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  destinations?: { label: string; slug: string }[]
}

function isoDate (d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function defaultStay () {
  const checkIn = new Date()
  checkIn.setHours(12, 0, 0, 0)
  checkIn.setDate(checkIn.getDate() + 1)
  const checkOut = new Date(checkIn)
  checkOut.setDate(checkOut.getDate() + 3)
  return { checkIn: isoDate(checkIn), checkOut: isoDate(checkOut) }
}

function formatShortRange (checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 'Add dates'
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  return `${a.toLocaleDateString('en-GB', opts)} – ${b.toLocaleDateString('en-GB', opts)}`
}

export default function SearchBarInner ({
  variant = 'home',
  dark = false,
  placeholder,
  value: _value,
  className = '',
  destinations = [],
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaults = useMemo(() => defaultStay(), [])
  const paramCheckIn = searchParams?.get('checkIn') || ''
  const paramCheckOut = searchParams?.get('checkOut') || ''
  const [destination, setDestination] = useState(searchParams?.get('destination') || _value || '')
  /* Empty until mount when no URL params — avoids SSR/client date hydration mismatch */
  const [checkIn, setCheckIn] = useState(paramCheckIn)
  const [checkOut, setCheckOut] = useState(paramCheckOut)
  const [guests, setGuests] = useState(searchParams?.get('guests') || '2')
  const [expanded, setExpanded] = useState(variant !== 'compact')

  useEffect(() => {
    if (!paramCheckIn) setCheckIn(defaults.checkIn)
    if (!paramCheckOut) setCheckOut(defaults.checkOut)
  }, [paramCheckIn, paramCheckOut, defaults])

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      const params = new URLSearchParams()
      if (destination) params.set('destination', destination)
      params.set('checkIn', checkIn || defaults.checkIn)
      params.set('checkOut', checkOut || defaults.checkOut)
      params.set('guests', guests || '2')
      params.set('deposit', 'quick')
      router.push(`/hostels?${params.toString()}`)
    },
    [destination, checkIn, checkOut, guests, router, defaults],
  )

  /* One strip: DestinationField + DateRange + Guests — ink primary, coral on hover only */
  if (variant === 'hero' || (variant === 'home' && !dark)) {
    return (
      <form onSubmit={handleSearch} className={`w-full ${className}`}>
        <div className="search-hero relative z-20 flex flex-col gap-0 overflow-visible rounded-sm border border-ink-200 bg-[var(--color-surface-raised)] shadow-[0_18px_50px_-28px_rgba(11,11,12,0.55)] sm:flex-row sm:items-stretch">
          <div className="min-w-0 flex-[1.45] border-b border-ink-100 sm:border-b-0 sm:border-r">
            <DestinationField
              value={destination}
              onChange={setDestination}
              options={destinations}
              placeholder={placeholder || 'Where do you want to go?'}
            />
          </div>

          <div className="relative min-w-0 flex-[1.1] border-b border-ink-100 sm:border-b-0 sm:border-r">
            <DateRangeField
              value={{ start: checkIn, end: checkOut }}
              onChange={({ start, end }) => {
                setCheckIn(start)
                setCheckOut(end)
              }}
            />
          </div>

          <div className="relative min-w-0 shrink-0 sm:w-40">
            <GuestSelect value={guests} onChange={setGuests} />
          </div>

          <div className="flex items-center p-2 sm:pl-0">
            <button
              type="submit"
              className="btn-press flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-ink-1000 px-5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-coral-700 sm:h-14 sm:w-14 sm:px-0"
              aria-label="Search hostels"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="sm:hidden">Find beds</span>
            </button>
          </div>
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-300">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
              <path d="m9 16 2 2 4-4" />
            </svg>
            Free cancellation &amp; flexible booking
          </span>
          <span className="stamp border-white/35 text-white/85">Pay 5–10% now · rest at hostel</span>
        </p>
      </form>
    )
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="search-field flex w-full items-center gap-2 rounded-sm border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-500 shadow-sm"
      >
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {destination ? (
          <span className="flex-1 truncate text-left font-medium text-ink-1000">{destination}</span>
        ) : (
          <span className="flex-1 text-left">Where to?</span>
        )}
        {checkIn && <span className="data text-xs text-ink-400">{formatShortRange(checkIn, checkOut)}</span>}
      </button>
    )
  }

  if (variant === 'sticky') {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="search-field flex items-center gap-2 rounded-sm border border-ink-200 bg-white px-4 py-2.5 text-sm"
        >
          <span className="font-medium text-ink-1000">{destination || 'Anywhere'}</span>
          <span className="text-ink-400">· {formatShortRange(checkIn, checkOut)}</span>
          <span className="text-ink-400">· {guests} {Number(guests) === 1 ? 'guest' : 'guests'}</span>
        </button>
      </div>
    )
  }

  if (dark) {
    return (
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 rounded-sm border border-white/15 bg-white/[0.07] px-3 backdrop-blur-sm transition-colors focus-within:border-white/40">
            <svg className="h-5 w-5 shrink-0 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={placeholder || 'Where to?'}
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/45"
              aria-label="Destination"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="min-w-0 flex-1 rounded-sm border border-white/15 bg-white/[0.07] px-2.5 py-2.5 text-sm text-white [color-scheme:dark]"
              aria-label="Check-in date"
            />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="min-w-0 flex-1 rounded-sm border border-white/15 bg-white/[0.07] px-2.5 py-2.5 text-sm text-white [color-scheme:dark]"
              aria-label="Check-out date"
            />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="min-w-0 shrink-0 rounded-sm border border-white/15 bg-white/[0.07] px-2 py-2.5 text-sm text-white [color-scheme:dark]"
              aria-label="Number of guests"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
              ))}
            </select>
            <button
              type="submit"
              className="flex h-11 shrink-0 items-center justify-center rounded-sm bg-coral-600 px-6 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-500 active:scale-[0.97]"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    )
  }

  return null
}
