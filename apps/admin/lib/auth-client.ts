/* Callers: login.tsx, AuthGate, Sidebar, staff/page — signIn/useSession/org.
   No prior auth-client. Schema: session cookies + org client (no DB).
   User: "go back to rbac work" */

import { createAuthClient } from 'better-auth/react'
import { organizationClient } from 'better-auth/client/plugins'
import { ac, roles } from './auth/permissions'

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles,
    }),
  ],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  useListOrganizations,
  useActiveOrganization,
} = authClient
