'use client'

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

/**
 * Date range field — Astryx DateRangeInput pattern, Dostel tokens.
 * <details> trigger + calendar popover; ISO Gregorian values; no native date chrome.
 * Callers: SearchBarInner (hero dates). User: fix date picker per design systems / Meta Astryx.
 */

export type DateRangeValue = { start: string; end: string }

type Props = {
  value: DateRangeValue
  onChange: (next: DateRangeValue) => void
  label?: string
  min?: string
  className?: string
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function parseISO (iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

function toISO (d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfDay (d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays (iso: string, n: number) {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

function formatShort (iso: string) {
  return parseISO(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function formatRange (start: string, end: string) {
  if (!start || !end) return 'Add dates'
  return `${formatShort(start)} – ${formatShort(end)}`
}

function nightsBetween (start: string, end: string) {
  const a = parseISO(start).getTime()
  const b = parseISO(end).getTime()
  return Math.max(0, Math.round((b - a) / 86400000))
}

function monthMatrix (year: number, month: number) {
  const first = new Date(year, month, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<{ iso: string } | null> = []
  for (let i = 0; i < startPad; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ iso: toISO(new Date(year, month, d)) })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function DateRangeField ({
  value,
  onChange,
  label = 'Dates',
  min,
  className = '',
}: Props) {
  const todayIso = useMemo(() => toISO(startOfDay(new Date())), [])
  const minIso = min || todayIso
  const rootRef = useRef<HTMLDetailsElement | null>(null)
  const listId = useId()
  const [draftStart, setDraftStart] = useState<string | null>(null)
  const [view, setView] = useState(() => {
    const d = parseISO(value.start || todayIso)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      const node = rootRef.current
      if (!node?.open) return
      if (!node.contains(e.target as Node)) {
        node.open = false
        setDraftStart(null)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && rootRef.current?.open) {
        rootRef.current.open = false
        setDraftStart(null)
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const cells = useMemo(
    () => monthMatrix(view.year, view.month),
    [view.year, view.month],
  )

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  const close = () => {
    if (rootRef.current) rootRef.current.open = false
    setDraftStart(null)
  }

  const commit = useCallback(
    (start: string, end: string) => {
      onChange({ start, end })
      setDraftStart(null)
      if (rootRef.current) rootRef.current.open = false
    },
    [onChange],
  )

  const pick = (iso: string) => {
    if (iso < minIso) return
    if (!draftStart) {
      setDraftStart(iso)
      return
    }
    if (iso === draftStart) {
      commit(iso, addDays(iso, 1))
      return
    }
    if (iso < draftStart) {
      setDraftStart(iso)
      return
    }
    commit(draftStart, iso)
  }

  const isInRange = (iso: string) => {
    const start = draftStart || value.start
    const end = draftStart ? null : value.end
    if (!start) return false
    if (draftStart && !end) return iso === draftStart
    if (!end) return false
    return iso >= start && iso <= end
  }

  const isEdge = (iso: string) => {
    if (draftStart && iso === draftStart) return true
    return iso === value.start || iso === value.end
  }

  const nights = nightsBetween(value.start, value.end)

  return (
    <details
      ref={rootRef}
      className={`ds-field group relative ${className}`}
      onToggle={(e) => {
        if (!(e.target as HTMLDetailsElement).open) setDraftStart(null)
      }}
    >
      <summary
        className="ds-field__trigger flex w-full min-w-0 cursor-pointer list-none items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-ink-50 [&::-webkit-details-marker]:hidden"
        aria-controls={listId}
      >
        <svg className="h-5 w-5 shrink-0 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
        </svg>
        <span className="min-w-0 flex-1">
          <span className="data block text-[0.65rem] uppercase tracking-[0.14em] text-ink-400">{label}</span>
          <span className="block truncate text-sm font-medium text-ink-1000">
            {formatRange(value.start, value.end)}
          </span>
          <span className="data mt-0.5 block text-[0.65rem] text-ink-500">
            {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
        </span>
        <svg className="h-4 w-4 shrink-0 text-ink-400 transition-transform duration-150 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div
        id={listId}
        role="dialog"
        aria-label="Choose stay dates"
        className="ds-popover absolute left-0 right-0 top-[calc(100%+6px)] z-50 origin-top rounded-[var(--radius-control)] border border-ink-200 bg-[var(--color-surface-raised)] p-3 shadow-[0_22px_48px_-18px_rgba(11,11,12,0.55)] sm:left-auto sm:right-0 sm:min-w-[20.5rem]"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            className="btn-press rounded-sm p-2 text-ink-700 hover:bg-ink-100"
            aria-label="Previous month"
            onClick={() =>
              setView((v) => {
                const d = new Date(v.year, v.month - 1, 1)
                return { year: d.getFullYear(), month: d.getMonth() }
              })
            }
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <p className="text-sm font-semibold text-ink-1000">{monthLabel}</p>
          <button
            type="button"
            className="btn-press rounded-sm p-2 text-ink-700 hover:bg-ink-100"
            aria-label="Next month"
            onClick={() =>
              setView((v) => {
                const d = new Date(v.year, v.month + 1, 1)
                return { year: d.getFullYear(), month: d.getMonth() }
              })
            }
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {WEEKDAYS.map((d) => (
            <span key={d} className="data py-1 text-center text-[0.6rem] uppercase tracking-[0.12em] text-ink-400">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((cell, i) => {
            if (!cell) return <span key={`e-${i}`} />
            const disabled = cell.iso < minIso
            const inRange = isInRange(cell.iso)
            const edge = isEdge(cell.iso)
            return (
              <button
                key={cell.iso}
                type="button"
                disabled={disabled}
                onClick={() => pick(cell.iso)}
                className={[
                  'ds-cal-day relative h-9 rounded-sm text-sm tabular-nums transition-colors duration-100',
                  disabled && 'cursor-not-allowed text-ink-300',
                  !disabled && !inRange && 'text-ink-800 hover:bg-ink-100',
                  inRange && !edge && 'bg-ink-100 text-ink-900',
                  edge && 'bg-ink-1000 font-semibold text-white hover:bg-ink-900',
                ].filter(Boolean).join(' ')}
                aria-label={cell.iso}
                aria-pressed={edge || undefined}
              >
                {Number(cell.iso.slice(-2))}
              </button>
            )
          })}
        </div>

        <p className="mt-3 text-xs leading-5 text-ink-600" role="status">
          {draftStart
            ? `Check-in ${formatShort(draftStart)} · pick check-out`
            : 'Pick check-in, then check-out'}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            { label: '2 nights', nights: 2 },
            { label: '5 nights', nights: 5 },
            { label: 'Week', nights: 7 },
          ].map((preset) => {
            const start = minIso
            const end = addDays(start, preset.nights)
            return (
              <button
                key={preset.label}
                type="button"
                className="rounded-sm border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-700 transition-colors hover:border-ink-400 hover:bg-ink-50"
                onClick={() => commit(start, end)}
              >
                {preset.label}
              </button>
            )
          })}
          <button
            type="button"
            className="ml-auto rounded-sm px-2.5 py-1 text-xs font-medium text-ink-500 hover:text-ink-800"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </details>
  )
}
