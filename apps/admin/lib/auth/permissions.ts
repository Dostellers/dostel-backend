/* Callers: lib/auth.ts + lib/auth-client.ts import ac/roles for Better Auth
   organization plugins. No prior permissions module exists. Schema: in-memory
   access-control statements only (no DB). User: "go back to rbac work" */

import { createAccessControl } from 'better-auth/plugins/access'
import {
  defaultStatements,
  adminAc,
  ownerAc,
  memberAc,
} from 'better-auth/plugins/organization/access'

export const statement = {
  ...defaultStatements,
  hostel: ['read', 'update', 'settings'],
  booking: ['read', 'create', 'update', 'cancel'],
  room: ['read', 'create', 'update'],
  guest: ['read', 'create', 'update'],
  rates: ['read', 'update'],
  housekeeping: ['read', 'update'],
  reports: ['read'],
  staff: ['read', 'invite', 'update', 'remove'],
} as const

export const ac = createAccessControl(statement)

export const owner = ac.newRole({
  ...ownerAc.statements,
  hostel: ['read', 'update', 'settings'],
  booking: ['read', 'create', 'update', 'cancel'],
  room: ['read', 'create', 'update'],
  guest: ['read', 'create', 'update'],
  rates: ['read', 'update'],
  housekeeping: ['read', 'update'],
  reports: ['read'],
  staff: ['read', 'invite', 'update', 'remove'],
})

export const manager = ac.newRole({
  ...adminAc.statements,
  hostel: ['read', 'update', 'settings'],
  booking: ['read', 'create', 'update', 'cancel'],
  room: ['read', 'create', 'update'],
  guest: ['read', 'create', 'update'],
  rates: ['read', 'update'],
  housekeeping: ['read', 'update'],
  reports: ['read'],
  staff: ['read', 'invite', 'update', 'remove'],
})

export const frontDesk = ac.newRole({
  ...memberAc.statements,
  hostel: ['read'],
  booking: ['read', 'create', 'update', 'cancel'],
  room: ['read'],
  guest: ['read', 'create', 'update'],
  rates: ['read'],
  housekeeping: ['read'],
  reports: ['read'],
  staff: ['read'],
})

export const housekeeping = ac.newRole({
  ...memberAc.statements,
  hostel: ['read'],
  booking: ['read'],
  room: ['read'],
  guest: ['read'],
  rates: [],
  housekeeping: ['read', 'update'],
  reports: [],
  staff: [],
})

export const roles = {
  owner,
  manager,
  front_desk: frontDesk,
  housekeeping,
} as const

export const roleLabels: Record<keyof typeof roles, string> = {
  owner: 'Owner',
  manager: 'Manager',
  front_desk: 'Front desk',
  housekeeping: 'Housekeeping',
}

export type StaffRole = keyof typeof roles
