/* Callers: AuthExperience verifyOtp → POST /api/auth/phone/verify.
   No prior verify route. Schema: OTP check → guest token cookie.
   User: "offer all ways of signup and make this UI 10 times better" */

import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'node:crypto'

const g = globalThis as typeof globalThis & {
  __dostelPhoneOtps?: Map<string, { hash: string; expires: number }>
}

function store () {
  if (!g.__dostelPhoneOtps) g.__dostelPhoneOtps = new Map()
  return g.__dostelPhoneOtps
}

function normalizePhone (phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

export async function POST (request: NextRequest) {
  try {
    const body = await request.json()
    const phone = normalizePhone(String(body.phone || ''))
    const code = String(body.code || '').trim()
    const entry = store().get(phone)

    if (!entry || entry.expires < Date.now()) {
      return NextResponse.json({ error: 'Code expired. Request a new one.' }, { status: 400 })
    }

    const hash = createHash('sha256').update(`${phone}:${code}`).digest('hex')
    if (hash !== entry.hash) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }

    store().delete(phone)
    const token = `phone.${Buffer.from(phone).toString('base64url')}.${randomBytes(16).toString('hex')}`

    const response = NextResponse.json({
      ok: true,
      token,
      user: { phone, name: 'Dosteller' },
      message: 'Phone verified',
    })
    response.cookies.set('dostel-guest-auth', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Could not verify code' }, { status: 500 })
  }
}
