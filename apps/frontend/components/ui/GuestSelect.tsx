'use client'

import { useEffect, useId, useRef } from 'react'

/**
 * Guest count selector — Astryx Selector / listbox pattern, Dostel tokens.
 * Native <details> trigger + listbox options; no OS <select> chrome.
 * Callers: SearchBarInner (hero guests). User: fix select per design systems / Meta Astryx.
 */

type Props = {
  value: string
  onChange: (next: string) => void
  options?: number[]
  label?: string
  className?: string
}

export default function GuestSelect ({
  value,
  onChange,
  options = [1, 2, 3, 4, 5, 6, 7, 8],
  label = 'Guests',
  className = '',
}: Props) {
  const rootRef = useRef<HTMLDetailsElement | null>(null)
  const listId = useId()
  const count = Number(value) || 2
  const display = `${count} ${count === 1 ? 'guest' : 'guests'}`

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      const node = rootRef.current
      if (!node?.open) return
      if (!node.contains(e.target as Node)) node.open = false
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && rootRef.current?.open) rootRef.current.open = false
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <details ref={rootRef} className={`ds-field group relative ${className}`}>
      <summary
        className="ds-field__trigger flex w-full min-w-0 cursor-pointer list-none items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-ink-50 [&::-webkit-details-marker]:hidden"
        aria-controls={listId}
      >
        <svg className="h-5 w-5 shrink-0 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
        <span className="min-w-0 flex-1">
          <span className="data block text-[0.65rem] uppercase tracking-[0.14em] text-ink-400">{label}</span>
          <span className="block text-sm font-medium text-ink-1000">{display}</span>
        </span>
        <svg className="h-4 w-4 shrink-0 text-ink-400 transition-transform duration-150 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <ul
        id={listId}
        role="listbox"
        aria-label={label}
        className="ds-popover absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-auto rounded-[var(--radius-control)] border border-ink-200 bg-[var(--color-surface-raised)] py-1 shadow-[0_22px_48px_-18px_rgba(11,11,12,0.55)] sm:left-auto sm:right-0 sm:min-w-[11rem]"
      >
        {options.map((n) => {
          const selected = n === count
          return (
            <li key={n} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                className={[
                  'flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors duration-100',
                  selected
                    ? 'bg-coral-50 font-semibold text-coral-800'
                    : 'text-ink-800 hover:bg-ink-50',
                ].join(' ')}
                onClick={() => {
                  onChange(String(n))
                  if (rootRef.current) rootRef.current.open = false
                }}
              >
                <span>
                  {n} {n === 1 ? 'guest' : 'guests'}
                </span>
                {selected && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4 12.5 5 5L20 6.5" />
                  </svg>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </details>
  )
}
