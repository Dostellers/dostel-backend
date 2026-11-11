/* Callers: browser/auth-client → /api/auth/*; Next mounts GET/POST here.
   No prior Better Auth catch-all. Schema: session/org via lib/auth.
   User: "go back to rbac work" */

import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
