/* Callers: Sidebar.tsx (useStaffRole). No prior hook. Schema: active member
   role from Better Auth org client. User: "keep building in /loop and run end to end" */

'use client'

import { useEffect, useState } from 'react'
import { authClient, useActiveOrganization, useSession } from '@/lib/auth-client'

export function useStaffRole () {
  const { data: session } = useSession()
  const { data: activeOrg } = useActiveOrganization()
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load () {
      if (!session || !activeOrg?.id) {
        if (!cancelled) {
          setRole(null)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      const { data, error } = await authClient.organization.getActiveMemberRole()
      if (cancelled) return
      if (error) {
        setRole(null)
      } else {
        setRole(data?.role || null)
      }
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [session, activeOrg?.id])

  return { role, loading, activeOrg }
}
