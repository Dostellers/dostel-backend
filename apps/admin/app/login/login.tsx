/* Callers: apps/admin/app/login/page.tsx renders LoginForm.
   Effect: email/password sign-in via Better Auth (authClient.signIn.email).
   Replaces hardcoded /api/login + GraphQL dual login. User: "go back to rbac work" */

'use client'

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { authClient } from '@/lib/auth-client'

export function LoginForm () {
  const [email, setEmail] = useState('admin@dostel.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit (event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message || 'Invalid credentials')
      setLoading(false)
      return
    }

    window.location.replace('/dashboard')
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-paper p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 10% 20%, #FFDBD3 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 80%, #FFE391 0%, transparent 50%)',
        }}
        aria-hidden
      />
      <div className="relative w-full max-w-md space-y-6 rounded-2xl border border-ink-200 bg-white p-8 shadow-[0_20px_50px_rgba(11,11,12,0.08)]">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Dostel"
            width={64}
            height={64}
            className="mx-auto mb-4 object-contain"
            priority
          />
          <span className="tag mb-3">Admin</span>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-ink-1000">
            Dostel Ops
          </h1>
          <p className="mt-1 text-sm text-ink-500">Sign in to the property board</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink-700" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-ink-300 bg-white px-3 text-sm text-ink-800 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-600"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink-700" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-ink-300 bg-white px-3 text-sm text-ink-800 outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-600"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg border border-error/30 bg-coral-50 px-3 py-2 text-sm text-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-coral-600 text-sm font-semibold text-white transition hover:bg-coral-700 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
