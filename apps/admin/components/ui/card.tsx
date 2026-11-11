/* Caller: hostels/page, dashboard/page, bookings, rooms, customers import Card.
   Existing file was an incomplete stub that broke builds. Restoring full card
   primitives styled with Dostel coral/ink tokens for the admin ops board.
   User: "review and build admin dashboard end to end in dostellers colors" */

import * as React from 'react'
import { cn } from '@/lib/utils'

function Card ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-ink-200 bg-white text-ink-700 shadow-[0_1px_0_rgba(31,27,27,0.04)]',
        className
      )}
      {...props}
    />
  )
}

function CardHeader ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5 p-5 pb-3', className)} {...props} />
  )
}

function CardTitle ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-ink-1000', className)}
      {...props}
    />
  )
}

function CardDescription ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-ink-500', className)} {...props} />
  )
}

function CardContent ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pt-0', className)} {...props} />
  )
}

function CardFooter ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-2 p-5 pt-0', className)} {...props} />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
