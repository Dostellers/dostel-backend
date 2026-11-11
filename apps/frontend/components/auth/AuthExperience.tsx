/* Callers: app/auth/login/page.tsx + signup/page.tsx render <AuthExperience />.
   No prior components/auth kit. Schema: GraphQL login/signup + /api/auth oauth/phone.
   User: "offer all ways of signup and make this UI 10 times better" */

'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '@/lib/queries'

type Mode = 'login' | 'signup'
type Panel = 'methods' | 'email' | 'phone'

type AuthExperienceProps = {
  initialMode?: Mode
}

const providers = [
  { id: 'google', label: 'Continue with Google', icon: GoogleIcon },
  { id: 'apple', label: 'Continue with Apple', icon: AppleIcon },
  { id: 'phone', label: 'Continue with phone', icon: PhoneIcon },
] as const

export function AuthExperience ({ initialMode = 'login' }: AuthExperienceProps) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [panel, setPanel] = useState<Panel>('methods')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [emailForm, setEmailForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  })

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [phoneBusy, setPhoneBusy] = useState(false)

  useEffect(() => {
    setMode(initialMode)
    setPanel('methods')
    setError('')
    setNotice('')
  }, [initialMode])

  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.login?.token) {
        localStorage.setItem('token', data.login.token)
        router.push('/')
      }
    },
    onError: (err) => setError(err.message),
  })

  const [signup, { loading: signupLoading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      if (data?.signup?.token) {
        localStorage.setItem('token', data.signup.token)
        router.push('/')
      }
    },
    onError: (err) => setError(err.message),
  })

  const busy = loginLoading || signupLoading || phoneBusy

  const headline = useMemo(() => {
    if (panel === 'phone') return 'Phone number'
    if (panel === 'email') return mode === 'login' ? 'Email sign in' : 'Create with email'
    return mode === 'login' ? 'Welcome back' : 'Join Dostel'
  }, [mode, panel])

  const subcopy = useMemo(() => {
    if (panel === 'phone') return 'We’ll text a one-time code. No password needed.'
    if (panel === 'email') {
      return mode === 'login'
        ? 'Use the email you booked with.'
        : 'Book beds, see who’s in the room, keep your trips in one place.'
    }
    return mode === 'login'
      ? 'Pick a way in. Your bookings and Dosteller perks stay with you.'
      : 'Arrive a stranger. Leave a dost. Choose how you want to start.'
  }, [mode, panel])

  async function onEmailSubmit (event: FormEvent) {
    event.preventDefault()
    setError('')
    setNotice('')
    if (mode === 'login') {
      await login({ variables: { email: emailForm.email, password: emailForm.password } })
      return
    }
    await signup({
      variables: {
        input: {
          fullName: emailForm.fullName,
          email: emailForm.email,
          phone: emailForm.phone,
          password: emailForm.password,
          dateOfBirth: null,
          referralCode: null,
        },
      },
    })
  }

  async function onProvider (id: string) {
    setError('')
    setNotice('')
    if (id === 'phone') {
      setPanel('phone')
      return
    }
    window.location.href = `/api/auth/oauth/${id}?mode=${mode}&next=${encodeURIComponent('/')}`
  }

  async function sendOtp (event: FormEvent) {
    event.preventDefault()
    setPhoneBusy(true)
    setError('')
    setNotice('')
    try {
      const res = await fetch('/api/auth/phone/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, mode }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(body.error || 'Could not send code')
        return
      }
      setOtpSent(true)
      setNotice(body.devCode ? `Dev code: ${body.devCode}` : 'Code sent. Check your messages.')
    } catch {
      setError('Network error sending code')
    } finally {
      setPhoneBusy(false)
    }
  }

  async function verifyOtp (event: FormEvent) {
    event.preventDefault()
    setPhoneBusy(true)
    setError('')
    try {
      const res = await fetch('/api/auth/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp, mode }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(body.error || 'Invalid code')
        return
      }
      if (body.token) {
        localStorage.setItem('token', body.token)
        router.push('/')
        return
      }
      setNotice(body.message || 'Phone verified. Finish your profile with email if prompted.')
      setPanel('email')
      setEmailForm((prev) => ({ ...prev, phone }))
    } catch {
      setError('Network error verifying code')
    } finally {
      setPhoneBusy(false)
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink-1000 text-ink-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 55% at 15% 20%, rgba(212,42,50,0.45) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 85% 80%, rgba(252,204,0,0.18) 0%, transparent 50%), linear-gradient(160deg, #0B0B0C 0%, #1F1B1B 45%, #0B0B0C 100%)',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-coral-600/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-yellow-logo/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid min-h-dvh max-w-6xl lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14">
          <Link href="/" className="inline-flex items-center gap-3 self-start">
            <Image src="/logo.png" alt="Dostel" width={48} height={48} className="object-contain" priority />
            <span>
              <span className="block font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">Dostel</span>
              <span className="font-[family-name:var(--font-deva)] text-sm text-coral-200">दोस्त + hostel</span>
            </span>
          </Link>

          <div className="auth-rise max-w-md space-y-5">
            <p className="font-[family-name:var(--font-deva)] text-4xl leading-tight text-yellow-logo">दोस्त</p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-white xl:text-5xl">
              Arrive a stranger.<br />Leave known.
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-ink-300">
              Hill stays where staff remember your name, Wi‑Fi is measured not claimed, and you can see who’s in the room before you book.
            </p>
            <ul className="space-y-2 text-sm text-ink-200">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-coral-400" /> Member rates after first stay</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-coral-400" /> Trips, receipts, and roommate peeks</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-coral-400" /> One profile across every Dostel</li>
            </ul>
          </div>

          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Guest account · not staff ops</p>
        </aside>

        <section className="relative flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="auth-rise w-full max-w-md rounded-3xl border border-white/10 bg-paper p-6 text-ink-800 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2">
                <Image src="/logo.png" alt="Dostel" width={40} height={40} priority />
                <span className="font-[family-name:var(--font-display)] text-lg font-bold text-ink-1000">Dostel</span>
              </Link>
              <span className="font-[family-name:var(--font-deva)] text-sm text-coral-700">दोस्त</span>
            </div>

            <div className="mb-6 flex rounded-full bg-ink-100 p-1">
              <button
                type="button"
                onClick={() => { setMode('login'); setPanel('methods'); setError(''); router.replace('/auth/login') }}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-ink-1000 shadow-sm' : 'text-ink-600'}`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setPanel('methods'); setError(''); router.replace('/auth/signup') }}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === 'signup' ? 'bg-white text-ink-1000 shadow-sm' : 'text-ink-600'}`}
              >
                Sign up
              </button>
            </div>

            <div className="mb-5">
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-ink-1000">{headline}</h1>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{subcopy}</p>
            </div>

            {error && (
              <p className="mb-4 flex items-start gap-2 rounded-xl border border-error/30 bg-coral-50 px-3 py-2 text-sm text-error" role="alert">
                <AlertIcon /><span>{error}</span>
              </p>
            )}
            {notice && !error && (
              <p className="mb-4 rounded-xl border border-success/25 bg-white px-3 py-2 text-sm text-success" role="status">{notice}</p>
            )}

            {panel === 'methods' && (
              <div className="space-y-3">
                {providers.map((provider) => {
                  const Icon = provider.icon
                  return (
                    <button
                      key={provider.id}
                      type="button"
                      disabled={busy}
                      onClick={() => void onProvider(provider.id)}
                      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-900 transition hover:border-ink-400 hover:bg-ink-50 disabled:opacity-50"
                    >
                      <Icon />
                      {provider.label}
                    </button>
                  )
                })}

                <div className="relative py-2 text-center text-xs font-medium uppercase tracking-[0.18em] text-ink-400">
                  <span className="relative z-10 bg-paper px-3">or email</span>
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink-200" aria-hidden />
                </div>

                <button
                  type="button"
                  onClick={() => setPanel('email')}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-coral-600 px-4 text-sm font-semibold text-white transition hover:bg-coral-700"
                >
                  <MailIcon />
                  {mode === 'login' ? 'Continue with email' : 'Sign up with email'}
                </button>
              </div>
            )}

            {panel === 'email' && (
              <form onSubmit={onEmailSubmit} className="space-y-3.5">
                <button type="button" onClick={() => setPanel('methods')} className="mb-1 text-sm font-medium text-coral-700 hover:underline">← All sign-in options</button>
                {mode === 'signup' && (
                  <Field id="fullName" label="Full name" value={emailForm.fullName} onChange={(v) => setEmailForm((p) => ({ ...p, fullName: v }))} autoComplete="name" required placeholder="Jane Doe" />
                )}
                <Field id="email" label="Email" type="email" value={emailForm.email} onChange={(v) => setEmailForm((p) => ({ ...p, email: v }))} autoComplete="email" required placeholder="jane@example.com" />
                {mode === 'signup' && (
                  <Field id="phone" label="Phone" type="tel" value={emailForm.phone} onChange={(v) => setEmailForm((p) => ({ ...p, phone: v }))} autoComplete="tel" required placeholder="+91 98765 43210" />
                )}
                <Field id="password" label="Password" type="password" value={emailForm.password} onChange={(v) => setEmailForm((p) => ({ ...p, password: v }))} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={8} placeholder={mode === 'login' ? 'Your password' : 'At least 8 characters'} />
                <button type="submit" disabled={busy} className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-coral-600 text-sm font-semibold text-white transition hover:bg-coral-700 disabled:opacity-50">
                  {busy ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>
            )}

            {panel === 'phone' && (
              <form onSubmit={otpSent ? verifyOtp : sendOtp} className="space-y-3.5">
                <button type="button" onClick={() => { setPanel('methods'); setOtpSent(false); setOtp('') }} className="mb-1 text-sm font-medium text-coral-700 hover:underline">← All sign-in options</button>
                <Field id="phone-auth" label="Mobile number" type="tel" value={phone} onChange={setPhone} autoComplete="tel" required placeholder="+91 98765 43210" />
                {otpSent && (
                  <Field id="otp" label="One-time code" value={otp} onChange={setOtp} autoComplete="one-time-code" required placeholder="6-digit code" />
                )}
                <button type="submit" disabled={busy} className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-coral-600 text-sm font-semibold text-white transition hover:bg-coral-700 disabled:opacity-50">
                  {busy ? 'Working…' : otpSent ? 'Verify & continue' : 'Send code'}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-xs leading-relaxed text-ink-500">
              By continuing you agree to Dostel’s{' '}
              <Link href="/policies" className="text-coral-700 hover:underline">guest policy</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-coral-700 hover:underline">privacy policy</Link>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function Field ({
  id, label, value, onChange, type = 'text', autoComplete, required, placeholder, minLength,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
  required?: boolean
  placeholder?: string
  minLength?: number
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink-700">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="flex h-11 w-full rounded-xl border border-ink-300 bg-white px-3 text-sm text-ink-900 outline-none transition focus:border-coral-400 focus:ring-2 focus:ring-coral-600/30"
      />
    </div>
  )
}

function GoogleIcon () {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7 12.9 19.6C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 37.1 44 32 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  )
}

function AppleIcon () {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.7.8-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1 2.6-2c.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.1-3.6zM14.4 6.3c.6-.7 1-1.7.9-2.7-0.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
    </svg>
  )
}

function PhoneIcon () {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M7 3.5h10A1.5 1.5 0 0 1 18.5 5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5z" />
      <path d="M10 17.5h4" />
    </svg>
  )
}

function MailIcon () {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function AlertIcon () {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  )
}

export default AuthExperience
