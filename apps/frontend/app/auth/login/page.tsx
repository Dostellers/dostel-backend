/* Callers: Next App Router /auth/login; Navbar Log in link.
   Effect: immersive multi-method AuthExperience (login mode).
   User: "offer all ways of signup and make this UI 10 times better" */

'use client'

import { AuthExperience } from '@/components/auth/AuthExperience'

export default function LoginPage () {
  return <AuthExperience initialMode="login" />
}
