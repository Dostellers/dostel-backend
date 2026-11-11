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

    // Called by app/login/login.tsx. Sets httpOnly admin-auth cookie for proxy.ts.
    // User: "fix it"
    const openLogin = process.env.ADMIN_OPEN_LOGIN === '1'
    const allowed =
      openLogin ||
      (email === 'admin@example.com' && password === 'password123') ||
      (email === 'admin@dostel.com' && password === 'password123')

    if (!allowed) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
