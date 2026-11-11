/* Callers: AuthExperience sendOtp → POST /api/auth/phone/start.
   No prior phone OTP route. Schema: in-memory OTP hash map (dev SMS).
   User: "offer all ways of signup and make this UI 10 times better" */

import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomInt } from 'node:crypto'

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
    if (phone.length < 8) {
      return NextResponse.json({ error: 'Enter a valid mobile number' }, { status: 400 })
    }

    const code = String(randomInt(100000, 999999))
    const hash = createHash('sha256').update(`${phone}:${code}`).digest('hex')
    store().set(phone, { hash, expires: Date.now() + 10 * 60 * 1000 })

    const exposeDev = process.env.NODE_ENV !== 'production' || process.env.AUTH_PHONE_DEV === '1'
    console.info('[auth/phone] OTP issued', { phone, exposeDev })

    return NextResponse.json({
      ok: true,
      ...(exposeDev ? { devCode: code } : {}),
    })
  } catch {
    return NextResponse.json({ error: 'Could not start phone auth' }, { status: 500 })
  }
}
