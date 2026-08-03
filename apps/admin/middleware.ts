import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicPaths = ['/', '/login', '/api/login', '/_next', '/favicon.ico']
  
  // If the route is not public and no admin-auth cookie exists, redirect to login
  if (!publicPaths.some(path => pathname.startsWith(path))) {
    const cookieStore = request.headers.get('cookie') || ''
    if (!cookieStore.includes('admin-auth')) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
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
