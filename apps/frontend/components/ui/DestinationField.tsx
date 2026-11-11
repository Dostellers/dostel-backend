'use client'

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'

/**
 * Destination combobox — Astryx Selector + filter, Dostel Noticeboard tokens.
 * Replaces bare <input>/datalist: soft field focus, opaque list, Anywhere + empty state.
 * Callers: SearchBarInner.tsx (~line 80 DestinationField), DesignSystemClient search specimen.
 * Existing DestinationField.tsx already owns this role — rewriting in place, not a second picker.
 * Schema: DestinationOption { label, slug, city? } from landing.destinations — props only, no writes.
 * User: "the property selector ui is not good"
 */

export type DestinationOption = { label: string; slug: string; city?: string }

type Props = {
  value: string
  onChange: (next: string) => void
  options?: DestinationOption[]
  placeholder?: string
  label?: string
  className?: string
}

function splitLabel (label: string) {
  if (label.includes(' · ')) {
    const [city, ...rest] = label.split(' · ')
    return { title: city.trim(), subtitle: rest.join(' · ').trim() }
  }
  if (label.includes(' - ')) {
    const [city, ...rest] = label.split(' - ')
    return { title: city.trim(), subtitle: rest.join(' - ').trim() }
  }
  return { title: label, subtitle: '' }
}

export default function DestinationField ({
  value,
  onChange,
  options = [],
  placeholder = 'Where do you want to go?',
  label = 'Where',
  className = '',
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => {
      const hay = `${o.label} ${o.city || ''} ${o.slug}`.toLowerCase()
      return hay.includes(q)
    })
  }, [options, value])

  const rows = useMemo(() => {
    const list: Array<{ key: string; label: string; subtitle: string; value: string }> = [
      {
        key: 'anywhere',
        label: 'Anywhere',
        subtitle: 'All hostels in the network',
        value: '',
      },
    ]
    for (const opt of filtered) {
      const parts = splitLabel(opt.label)
      list.push({
        key: opt.slug,
        label: parts.title,
        subtitle: parts.subtitle || opt.city || opt.slug,
        value: opt.city || parts.title,
      })
    }
    return list
  }, [filtered])

  useEffect(() => {
    setActive(0)
  }, [value, open])

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (!open) return
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = useCallback(
    (next: string) => {
      onChange(next)
      setOpen(false)
      inputRef.current?.blur()
    },
    [onChange],
  )

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true)
      return
    }
    if (!open) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, Math.max(rows.length - 1, 0)))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const row = rows[active]
      if (row) pick(row.value)
    }
  }

  const showEmpty = open && Boolean(value.trim()) && filtered.length === 0

  return (
    <div
      ref={rootRef}
      className={`ds-field ds-field--combo group relative ${className}`}
      data-open={open ? 'true' : undefined}
    >
      <label className="ds-field__shell flex w-full min-w-0 cursor-text items-center gap-3 px-4 py-3.5 transition-colors duration-150 hover:bg-ink-50">
        <svg className="h-5 w-5 shrink-0 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <span className="min-w-0 flex-1">
          <span className="data block text-[0.65rem] uppercase tracking-[0.14em] text-ink-400">{label}</span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="ds-field__input w-full bg-transparent text-sm font-medium text-ink-1000 outline-none placeholder:font-normal placeholder:text-ink-400"
            aria-label={label}
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && rows[active] ? `${listId}-${rows[active].key}` : undefined}
            role="combobox"
            autoComplete="off"
            spellCheck={false}
          />
        </span>
        {value ? (
          <button
            type="button"
            className="btn-press rounded-sm p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-800"
            aria-label="Clear destination"
            onClick={() => {
              onChange('')
              setOpen(true)
              inputRef.current?.focus()
            }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        ) : (
          <svg className="h-4 w-4 shrink-0 text-ink-400 transition-transform duration-150 group-data-[open=true]:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </label>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Destinations"
          className="ds-popover absolute left-0 right-0 top-[calc(100%+6px)] z-[60] max-h-[min(20rem,calc(100dvh-8rem))] overflow-auto rounded-[var(--radius-control)] border border-ink-200 bg-[var(--color-surface-raised)] py-1.5 shadow-[0_22px_48px_-18px_rgba(11,11,12,0.55)] sm:min-w-[20rem]"
        >
          <p className="data px-3.5 pb-1.5 pt-1 text-[0.6rem] uppercase tracking-[0.14em] text-ink-400">
            {value.trim() ? 'Matches' : 'Popular stays'}
          </p>

          {showEmpty ? (
            <div className="px-3.5 py-4">
              <p className="text-sm font-medium text-ink-900">No matches for “{value.trim()}”</p>
              <p className="mt-1 text-xs leading-5 text-ink-500">Try a city — or search the whole network.</p>
              <button
                type="button"
                className="mt-3 rounded-[var(--radius-control)] border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-800 transition-colors hover:bg-ink-50"
                onClick={() => pick('')}
              >
                Search all hostels
              </button>
            </div>
          ) : (
            rows.map((row, i) => {
              const selected = (row.value === '' && !value) || value === row.value || value === row.label
              const isActive = i === active
              return (
                <button
                  key={row.key}
                  id={`${listId}-${row.key}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={[
                    'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors duration-100',
                    isActive || selected ? 'bg-ink-50' : 'hover:bg-ink-50',
                  ].join(' ')}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(row.value)}
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-ink-200 bg-white text-ink-600">
                    {row.key === 'anywhere' ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink-1000">{row.label}</span>
                    {row.subtitle ? (
                      <span className="mt-0.5 block truncate text-xs text-ink-500">{row.subtitle}</span>
                    ) : null}
                  </span>
                  {selected ? (
                    <svg className="h-4 w-4 shrink-0 text-ink-1000" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4 12.5 5 5L20 6.5" />
                    </svg>
                  ) : null}
                </button>
              )
            })
          )}
        </div>
      ) : null}
    </div>
  )
}
