/* Sidebar /reports — RequirePermission reports:read. Loop: gate reports page. */
'use client'

import PlaceholderPage from '@/components/PlaceholderPage'
import { RequirePermission } from '@/components/RequirePermission'

export default function ReportsPage () {
  return (
    <RequirePermission permissions={{ reports: ['read'] }}>
      <PlaceholderPage section="reports" />
    </RequirePermission>
  )
}

