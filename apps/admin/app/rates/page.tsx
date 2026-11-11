/* Sidebar /rates — RequirePermission rates:read. Loop: gate rates page. */
'use client'

import PlaceholderPage from '@/components/PlaceholderPage'
import { RequirePermission } from '@/components/RequirePermission'

export default function RatesPage () {
  return (
    <RequirePermission permissions={{ rates: ['read'] }}>
      <PlaceholderPage section="rates" />
    </RequirePermission>
  )
}

