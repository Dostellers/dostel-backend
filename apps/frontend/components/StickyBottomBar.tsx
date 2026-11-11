"use client";

import { useBooking } from "./BookingProvider";

interface StickyBottomBarProps {
  price: number
  total: number
  ctaLabel: string
  subtitle?: string
  onCtaClick: () => void
  disabled?: boolean
  show?: boolean
  currency?: string
  depositDue?: number
}

export default function StickyBottomBar ({
  price,
  total,
  ctaLabel,
  subtitle,
  onCtaClick,
  disabled = false,
  show = true,
  currency = '₹',
  depositDue,
}: StickyBottomBarProps) {
  const { state } = useBooking()
  const { workweekDiscount } = state
  const dueNow = depositDue != null ? depositDue : state.depositDue
  const restAtHostel = Math.max(total - (dueNow || 0), 0)
  const showDeposit = dueNow > 0 && dueNow < total

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-ink-200 bg-white transition-transform duration-250 ease-out lg:static lg:border-none ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ boxShadow: '0 -4px 12px rgba(15,26,20,0.08)' }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 lg:h-auto lg:flex-col lg:gap-3 lg:p-0">
        <div className="flex min-w-0 flex-col leading-tight">
          {showDeposit ? (
            <>
              <span className="text-sm font-semibold text-ink-1000">
                {currency}{Math.round(dueNow).toLocaleString('en-IN')}
                <span className="ml-1 text-xs font-normal text-coral-700">pay now</span>
              </span>
              <span className="text-xs text-ink-500">
                {currency}{Math.round(restAtHostel).toLocaleString('en-IN')} at hostel
                {subtitle ? ` · ${subtitle}` : ''}
              </span>
            </>
          ) : (
            <>
              <span className="text-sm text-ink-600">
                {currency}{price}<span className="text-xs text-ink-400">/night</span>
              </span>
              <span className="text-xs text-ink-400">
                {currency}{total} total{subtitle ? ` · ${subtitle}` : ''}
              </span>
            </>
          )}
          {workweekDiscount ? (
            <span className="text-xs text-success">
              Save {currency}{workweekDiscount} on room price
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onCtaClick}
          disabled={disabled}
          className="flex h-11 min-w-[140px] items-center justify-center rounded-sm bg-coral-600 px-6 text-sm font-semibold text-white transition-all duration-150 hover:bg-coral-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}
