/**
 * App Router page for /login.
 * Called by browser via AuthGate (components/AuthGate.tsx) and proxy.ts redirects.
 * No page.tsx existed before — only login.tsx (component), so /login was missing and
 * AuthGate hung on "Checking authentication...".
 * User instruction: "fix it"
 */

import { LoginForm } from './login'

export default function LoginPage () {
  return <LoginForm />
}
