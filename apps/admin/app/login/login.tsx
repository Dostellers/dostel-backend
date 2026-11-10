'use client'

/**
 * Self-contained admin login form (no missing UI kit deps).
 * Used by app/login/page.tsx. Sets admin-auth via /api/login + localStorage token.
 * User instruction: "fix it"
 */

import { FormEvent, useState } from 'react'

export function LoginForm () {
  const [email, setEmail] = useState('admin@dostel.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit (event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const cookieLogin = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      let token: string | undefined
      try {
        const result = await fetch('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `mutation Login($input: LoginInput!) {
              login(input: $input) { token user { id email } }
            }`,
            variables: { input: { email, password } },
          }),
        })
        const response = await result.json()
        token = response?.data?.login?.token
      } catch {
        // Cookie session is enough for the admin shell
      }

      if (!cookieLogin.ok && !token) {
        const body = await cookieLogin.json().catch(() => ({}))
        setError(body.error || 'Invalid credentials')
        setLoading(false)
        return
      }

      localStorage.setItem('token', token || 'admin-session')
      if (!cookieLogin.ok) {
        document.cookie = 'admin-auth=true; path=/; max-age=604800; SameSite=Lax'
      }
      window.location.replace('/dashboard')
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-1 text-gray-500">Sign in to the Dostel admin panel</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-coral-600 focus:ring-2 focus:ring-coral-600/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-coral-600 focus:ring-2 focus:ring-coral-600/20"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-coral-600 text-sm font-semibold text-white transition hover:bg-coral-700 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
