/* Callers: lib/auth.ts invite link; proxy/AuthGate public path.
   No prior accept-invite page. Schema: invitation → member.
   User: "go back to rbac work" */

'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient, useSession } from '@/lib/auth-client'

function AcceptInviteForm () {
  const router = useRouter()
  const params = useSearchParams()
  const invitationId = params.get('invitationId') || ''
  const { data: session, isPending } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function accept () {
    const { error: acceptError } = await authClient.organization.acceptInvitation({
      invitationId,
    })
    if (acceptError) {
      setError(acceptError.message || 'Could not accept invite')
      setBusy(false)
      return
    }
    router.replace('/staff')
  }

  async function onSubmit (event: FormEvent) {
    event.preventDefault()
    if (!invitationId) {
      setError('Missing invitation id')
      return
    }
    setBusy(true)
    setError('')

    if (!session) {
      const { error: signUpError } = await authClient.signUp.email({
        name: name || email.split('@')[0],
        email,
        password,
      })
      if (signUpError) {
        const { error: signInError } = await authClient.signIn.email({ email, password })
        if (signInError) {
          setError(signUpError.message || signInError.message || 'Auth failed')
          setBusy(false)
          return
        }
      }
    }

    await accept()
  }

  if (isPending) {
    return <p className="text-sm text-ink-500">Loading…</p>
  }

  if (session && invitationId) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-ink-600">
          Signed in as {session.user.email}. Accept this staff invitation?
        </p>
        {error && <p className="text-sm text-error" role="alert">{error}</p>}
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true)
            void accept()
          }}
          className="h-11 w-full rounded-lg bg-coral-600 text-sm font-semibold text-white hover:bg-coral-700 disabled:opacity-50"
        >
          {busy ? 'Accepting…' : 'Accept invite'}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-ink-600">
        Create an account (or sign in with an existing one) to join this hostel.
      </p>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex h-11 w-full rounded-lg border border-ink-300 px-3 text-sm"
      />
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex h-11 w-full rounded-lg border border-ink-300 px-3 text-sm"
      />
      <input
        type="password"
        required
        minLength={8}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="flex h-11 w-full rounded-lg border border-ink-300 px-3 text-sm"
      />
      {error && <p className="text-sm text-error" role="alert">{error}</p>}
      <button
        type="submit"
        disabled={busy || !invitationId}
        className="h-11 w-full rounded-lg bg-coral-600 text-sm font-semibold text-white hover:bg-coral-700 disabled:opacity-50"
      >
        {busy ? 'Working…' : 'Join hostel'}
      </button>
    </form>
  )
}

export default function AcceptInvitePage () {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper p-6">
      <div className="w-full max-w-md rounded-2xl border border-ink-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-bold text-ink-1000">
          Staff invite
        </h1>
        <Suspense fallback={<p className="text-sm text-ink-500">Loading…</p>}>
          <AcceptInviteForm />
        </Suspense>
      </div>
    </div>
  )
}
