/* Callers: AuthExperience.tsx onProvider → /api/auth/oauth/{google|apple}.
   No prior guest OAuth route. Schema: OAuth redirect or HTML fallback.
   User: "offer all ways of signup and make this UI 10 times better" */

import { NextRequest, NextResponse } from 'next/server'

const providers = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientIdEnv: 'GOOGLE_CLIENT_ID',
    scope: 'openid email profile',
  },
  apple: {
    authUrl: 'https://appleid.apple.com/auth/authorize',
    clientIdEnv: 'APPLE_CLIENT_ID',
    scope: 'name email',
  },
} as const

type ProviderId = keyof typeof providers

export async function GET (
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider: raw } = await context.params
  const provider = raw as ProviderId
  const cfg = providers[provider]
  const mode = request.nextUrl.searchParams.get('mode') || 'login'
  const next = request.nextUrl.searchParams.get('next') || '/'

  if (!cfg) {
    return NextResponse.json({ error: 'Unknown provider' }, { status: 404 })
  }

  const clientId = process.env[cfg.clientIdEnv]
  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/auth/oauth/${provider}/callback`

  if (!clientId) {
    const back = mode === 'signup' ? '/auth/signup' : '/auth/login'
    const html = `<!doctype html><html><body style="font-family:system-ui;background:#FFFDF9;color:#1F1B1B;display:grid;place-items:center;min-height:100vh;margin:0">
      <div style="max-width:28rem;padding:2rem;border:1px solid #E6E0E0;border-radius:1rem;background:white">
        <h1 style="font-size:1.25rem;margin:0 0 .5rem">Connect ${provider}</h1>
        <p style="margin:0 0 1rem;color:#555050;line-height:1.5">Set <code>${cfg.clientIdEnv}</code> on the guest app to enable ${provider} sign-in. Email and phone are ready now.</p>
        <a href="${back}" style="display:inline-block;background:#D42A32;color:white;text-decoration:none;padding:.75rem 1rem;border-radius:.75rem;font-weight:600">Back to ${mode === 'signup' ? 'sign up' : 'log in'}</a>
      </div></body></html>`
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }

  const url = new URL(cfg.authUrl)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', cfg.scope)
  url.searchParams.set('state', Buffer.from(JSON.stringify({ mode, next, provider })).toString('base64url'))
  if (provider === 'apple') url.searchParams.set('response_mode', 'form_post')

  return NextResponse.redirect(url.toString())
}
