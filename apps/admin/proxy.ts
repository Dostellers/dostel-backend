import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Edge proxy for apps/admin — redirects unauthenticated traffic to /login.
  // User instruction: "fix it". '/' was wrongly public, so AuthGate alone ran
  // and hung when /login had no page.tsx.
  const publicPaths = ['/login', '/api/login', '/graphql', '/_next', '/favicon.ico']

  const isPublic = publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  if (!isPublic) {
    const cookieStore = request.headers.get('cookie') || ''
    if (!cookieStore.includes('admin-auth')) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
