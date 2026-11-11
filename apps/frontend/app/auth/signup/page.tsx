/* Callers: Next App Router /auth/signup; Navbar Sign up link.
   Effect: immersive multi-method AuthExperience (signup mode).
   User: "offer all ways of signup and make this UI 10 times better" */

'use client'

import { AuthExperience } from '@/components/auth/AuthExperience'

export default function SignupPage () {
  return <AuthExperience initialMode="signup" />
}
