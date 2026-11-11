/* Callers: rates/page.tsx + reports/page.tsx. No prior page gate component.
   Schema: useStaffRole + roleCan (in-memory AC). Loop: gate rates/reports. */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { roleCan, type PermissionMap } from '@/lib/auth/access'
import { useStaffRole } from '@/lib/auth/use-staff-role'

export function RequirePermission ({
  permissions,
  children,
  fallbackHref = '/dashboard',
}: {
  permissions: PermissionMap
  children: React.ReactNode
  fallbackHref?: string
}) {
  const router = useRouter()
  const { role, loading } = useStaffRole()
  const allowed = roleCan(role, permissions)

  useEffect(() => {
    if (!loading && role && !allowed) {
      router.replace(fallbackHref)
    }
  }, [loading, role, allowed, router, fallbackHref])

  if (loading || !role) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-ink-500">
        Checking access…
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-ink-500">
        Redirecting…
      </div>
    )
  }

  return <>{children}</>
}
