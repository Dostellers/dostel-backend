/* Callers: apps/admin/app/hostels/page.tsx (import line 7, toast() ~line 41).
   Existing stub exposed addToast only; hostels expects { toast }. Replacing in place.
   Schema: in-memory ToastItem[] { id, title, description?, variant? } — no persistence.
   User: "review and build admin dashboard end to end in dostellers colors.
   Also use skills /frontend-design /ui-ux-pro-max" */

'use client'

import * as React from 'react'
import { createContext, useCallback, useContext, useState } from 'react'

type ToastVariant = 'default' | 'destructive' | 'success'

type ToastInput = {
  title: string
  description?: string
  variant?: ToastVariant
}

type ToastItem = ToastInput & { id: number }

type ToastContextValue = {
  toasts: ToastItem[]
  toast: (input: ToastInput) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider ({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((input: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts((prev) => [...prev, { ...input, id }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4200)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[1000] flex w-[min(100%-2rem,22rem)] flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const tone =
            t.variant === 'destructive'
              ? 'border-error/40 bg-white text-error'
              : t.variant === 'success'
                ? 'border-success/40 bg-white text-success'
                : 'border-ink-200 bg-white text-ink-800'
          return (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-lg ${tone}`}
              role="status"
            >
              <p className="text-sm font-semibold text-ink-1000">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-ink-500">{t.description}</p>
              )}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast () {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      toasts: [] as ToastItem[],
      toast: (input: ToastInput) => {
        if (typeof window !== 'undefined') {
          window.alert([input.title, input.description].filter(Boolean).join('\n'))
        }
      },
      dismiss: () => {},
    }
  }
  return ctx
}
