/* Caller: dashboard, hostels, bookings, rooms, customers page headers.
   Shared ops-board header with Bricolage title + live stamp used across admin.
   User: "review and build admin dashboard end to end in dostellers colors" */

import * as React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  live?: boolean
  actions?: React.ReactNode
  className?: string
}

export function PageHeader ({ title, description, live = false, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          {live && (
            <span className="stamp text-success border-success/40 bg-white" aria-label="Live">
              <span className="board-pulse" aria-hidden />
              Live
            </span>
          )}
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold tracking-tight text-ink-1000">
            {title}
          </h1>
        </div>
        {description && (
          <p className="max-w-2xl text-sm text-ink-500 leading-relaxed">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  )
}
