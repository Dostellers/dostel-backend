/* Caller: hostels, dashboard actions, bookings, forms import Button.
   Rewritten without class-variance-authority (not in admin package.json).
   Dostel coral primary + ink secondary for the ops board.
   User: "review and build admin dashboard end to end in dostellers colors" */

import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'stamp'
type Size = 'default' | 'sm' | 'lg' | 'icon'

const variantClass: Record<Variant, string> = {
  default: 'bg-coral-600 text-white hover:bg-coral-700 shadow-sm',
  secondary: 'bg-ink-100 text-ink-800 hover:bg-ink-200',
  outline: 'border border-ink-300 bg-white text-ink-800 hover:bg-ink-50',
  ghost: 'text-ink-700 hover:bg-ink-100',
  destructive: 'bg-error text-white hover:opacity-90',
  stamp: 'border-[1.5px] border-coral-600 text-coral-700 bg-coral-50 hover:bg-coral-100',
}

const sizeClass: Record<Size, string> = {
  default: 'h-11 px-4 py-2 min-w-[44px]',
  sm: 'h-9 rounded-md px-3 text-xs',
  lg: 'h-12 rounded-xl px-6 text-base',
  icon: 'h-11 w-11',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button ({ className, variant = 'default', size = 'default', ...props }, ref) {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-600 focus-visible:ring-offset-2 active:scale-[0.98]',
          variantClass[variant],
          sizeClass[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Button }
