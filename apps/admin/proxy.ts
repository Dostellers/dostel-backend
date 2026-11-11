/* Callers: Next.js 16 proxy for apps/admin HTML routes. Effect: redirect to
   /login when Better Auth session cookie is missing. Replaces admin-auth cookie
   check. Public: /login, /accept-invite, /api/auth. User: "go back to rbac work" */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export function proxy (request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicPaths = [
    '/login',
    '/accept-invite',
    '/api/auth',
    '/api/login',
    '/graphql',
    '/_next',
    '/favicon.ico',
  ]

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (!isPublic) {
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
