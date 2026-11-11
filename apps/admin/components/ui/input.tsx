/* Caller: hostels forms, login, bookings filters import Input.
   Restyling for Dostel ink borders + coral focus ring used across admin forms.
   User: "review and build admin dashboard end to end in dostellers colors" */

import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input ({ className, type, ...props }, ref) {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-800 placeholder:text-ink-400 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-600 focus-visible:border-coral-400',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Input }
