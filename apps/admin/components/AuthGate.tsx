/* Callers: apps/admin/app/layout.tsx wraps all routes with AuthGate.
   Effect: Better Auth useSession gate + shell; login/accept-invite bypass.
   Replaces admin-auth cookie / localStorage token soft-check.
   User: "go back to rbac work" */

'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import { ToastProvider } from './ui/use-toast'
import { useSession } from '@/lib/auth-client'

export default function AuthGate ({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const isPublic = pathname === '/login' || pathname === '/accept-invite'

  useEffect(() => {
    if (isPending) return
    if (isPublic) {
      if (session) router.replace('/dashboard')
      return
    }
    if (!session) router.replace('/login')
  }, [isPending, isPublic, session, router])

  if (isPublic) {
    return <ToastProvider>{children}</ToastProvider>
  }

  if (isPending || !session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper text-ink-600">
        <div className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-5 py-4 shadow-sm">
          <span className="board-pulse" aria-hidden />
          <span className="text-sm font-medium">Checking authentication…</span>
        </div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <div className="flex min-h-dvh bg-paper">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[1100] focus:rounded-lg focus:bg-coral-600 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Sidebar />
        <div id="main" className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </div>
      </div>
    </ToastProvider>
  )
}
