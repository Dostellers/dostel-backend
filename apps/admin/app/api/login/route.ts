import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Dummy authentication for now - replace with real backend auth
    if (email === 'admin@example.com' && password === 'password123') {
      const response = NextResponse.json({ success: true })
      response.cookies.set('admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
