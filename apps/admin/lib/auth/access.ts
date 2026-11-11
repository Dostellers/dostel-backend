/* Callers: Sidebar.tsx filters nav; staff page gates invite form.
   Grep found no usePermission/access helper. Schema: in-memory AC checks.
   User: "keep building in /loop and run end to end" */

import { authClient } from '@/lib/auth-client'
import { roles, type StaffRole } from './permissions'

export type PermissionMap = Record<string, string[]>

export function roleCan (role: string | null | undefined, permissions: PermissionMap) {
  if (!role) return false
  const known = role as StaffRole
  if (!(known in roles)) return false
  return authClient.organization.checkRolePermission({
    role: known,
    permissions: permissions as never,
  })
}

export const navPermission: Record<string, PermissionMap | null> = {
  '/dashboard': null,
  '/hostels': { hostel: ['read'] },
  '/landing': { hostel: ['settings'] },
  '/rooms': { room: ['read'] },
  '/bookings': { booking: ['read'] },
  '/customers': { guest: ['read'] },
  '/rates': { rates: ['read'] },
  '/housekeeping': { housekeeping: ['read'] },
  '/reports': { reports: ['read'] },
  '/staff': { staff: ['read'] },
  '/token-receipts': { booking: ['read'] },
}

export function canSeeNav (role: string | null | undefined, href: string) {
  const required = navPermission[href]
  if (required == null) return true
  return roleCan(role, required)
}
