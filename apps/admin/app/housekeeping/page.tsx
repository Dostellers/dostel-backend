/* Callers: Sidebar href /housekeeping. Existing placeholder — wrap with
   RequirePermission. Loop: gate /housekeeping with housekeeping:read */

'use client'

import PlaceholderPage from '@/components/PlaceholderPage'
import { RequirePermission } from '@/components/RequirePermission'

export default function HousekeepingPage () {
  return (
    <RequirePermission permissions={{ housekeeping: ['read'] }}>
      <PlaceholderPage section="housekeeping" />
    </RequirePermission>
  )
}

