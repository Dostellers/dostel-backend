/* Callers: package.json auth:e2e → node scripts/e2e-rbac.mjs. No prior e2e.
   Schema: HTTP session/org/invitation via admin Better Auth API.
   User: "keep building in /loop and run end to end" */

import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.env.E2E_ADMIN_URL || 'http://admin.dostel.65.109.113.80.nip.io'
const OWNER_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@dostel.com'
const OWNER_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'password123'
const STAFF_EMAIL = process.env.E2E_STAFF_EMAIL || `frontdesk+e2e-${Date.now()}@dostel.test`
const STAFF_PASSWORD = process.env.E2E_STAFF_PASSWORD || 'password123'
const ORG_SLUG = process.env.SEED_ORG_SLUG || 'demo-hostel'

const cookieJar = join(tmpdir(), `dostel-rbac-e2e-${process.pid}.jar`)
const results = []
let cookies = new Map()

function log (step, ok, detail = '') {
  results.push({ step, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${step}${detail ? ` — ${detail}` : ''}`)
}

function parseSetCookie (res) {
  const raw = typeof res.headers.getSetCookie === 'function'
    ? res.headers.getSetCookie()
    : [res.headers.get('set-cookie')].filter(Boolean)
  const map = new Map()
  for (const line of raw) {
    const [pair] = String(line).split(';')
    const eq = pair.indexOf('=')
    if (eq > 0) map.set(pair.slice(0, eq), pair.slice(eq + 1))
  }
  return map
}

function cookieHeader () {
  return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ')
}

async function req (path, { method = 'GET', body, auth = true } = {}) {
  const headers = {
    Origin: BASE,
    Accept: 'application/json',
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && cookies.size) headers.Cookie = cookieHeader()

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'manual',
  })

  for (const [k, v] of parseSetCookie(res)) cookies.set(k, v)

  const text = await res.text()
  let json = null
  try { json = text ? JSON.parse(text) : null } catch { json = { raw: text } }
  return { res, json, status: res.status }
}

function assert (step, cond, detail) {
  log(step, Boolean(cond), detail)
  if (!cond) throw new Error(`E2E failed: ${step}`)
}

function allowed (json) {
  return json?.success === true || json === true || json?.allowed === true || json?.error == null && json?.success !== false && (json?.success || json?.data?.success)
}

async function main () {
  // 1. Unauth dashboard must redirect
  {
    cookies = new Map()
    const { status, res } = await req('/dashboard', { auth: false })
    const loc = res.headers.get('location') || ''
    assert('unauth dashboard redirects', status >= 300 && status < 400 && loc.includes('/login'), `status=${status} loc=${loc}`)
  }

  // 2. Owner sign-in
  {
    cookies = new Map()
    const { status, json } = await req('/api/auth/sign-in/email', {
      method: 'POST',
      body: { email: OWNER_EMAIL, password: OWNER_PASSWORD },
      auth: false,
    })
    assert('owner sign-in', status === 200 && json?.user?.email === OWNER_EMAIL, `status=${status}`)
    assert('session cookie set', cookies.has('better-auth.session_token'), [...cookies.keys()].join(','))
  }

  // 3. Session
  {
    const { status, json } = await req('/api/auth/get-session')
    assert('get-session', status === 200 && json?.user?.email === OWNER_EMAIL, json?.user?.email || String(status))
  }

  // 4. List orgs + set active
  let orgId
  {
    const { status, json } = await req('/api/auth/organization/list')
    const list = Array.isArray(json) ? json : (json?.organizations || json?.data || [])
    const org = list.find((o) => o.slug === ORG_SLUG) || list[0]
    assert('list organizations', status === 200 && org?.id, `count=${Array.isArray(list) ? list.length : '?'}`)
    orgId = org.id

    const set = await req('/api/auth/organization/set-active', {
      method: 'POST',
      body: { organizationId: orgId },
    })
    assert('set active org', set.status === 200, `status=${set.status}`)
  }

  // 5. Active member role is owner
  {
    const { status, json } = await req('/api/auth/organization/get-active-member-role')
    assert('owner role', status === 200 && json?.role === 'owner', JSON.stringify(json))
  }

  // 6. Permission checks
  {
    const invite = await req('/api/auth/organization/has-permission', {
      method: 'POST',
      body: { permissions: { staff: ['invite'] } },
    })
    assert('owner can invite staff', invite.status === 200 && (invite.json?.success === true || invite.json === true || invite.json?.error == null), JSON.stringify(invite.json))

    const rates = await req('/api/auth/organization/has-permission', {
      method: 'POST',
      body: { permissions: { rates: ['update'] } },
    })
    assert('owner can update rates', rates.status === 200 && (rates.json?.success === true || rates.json === true || rates.json?.error == null), JSON.stringify(rates.json))
  }

  // 7. Invite front_desk
  let invitationId
  {
    const { status, json } = await req('/api/auth/organization/invite-member', {
      method: 'POST',
      body: { email: STAFF_EMAIL, role: 'front_desk', resend: true },
    })
    assert('invite front_desk', status === 200 && json?.id, JSON.stringify(json)?.slice(0, 200))
    invitationId = json.id
  }

  // 8. List members + invitations
  {
    const members = await req(`/api/auth/organization/list-members?organizationId=${encodeURIComponent(orgId)}`)
    const memberList = members.json?.members || []
    assert('list members', members.status === 200 && Array.isArray(memberList) && memberList.length >= 1, `count=${memberList.length}`)

    const invites = await req(`/api/auth/organization/list-invitations?organizationId=${encodeURIComponent(orgId)}`)
    const inviteList = Array.isArray(invites.json) ? invites.json : (invites.json?.invitations || [])
    assert('list invitations includes pending', invites.status === 200 && inviteList.some((i) => i.id === invitationId || i.email === STAFF_EMAIL), `count=${inviteList.length}`)
  }

  // 9. Protected pages with session
  for (const path of ['/dashboard', '/staff', '/bookings']) {
    const { status } = await req(path)
    assert(`authed ${path}`, status === 200, `status=${status}`)
  }

  // 10. Accept invite as new front_desk user
  {
    await req('/api/auth/sign-out', { method: 'POST', body: {} })
    cookies = new Map()

    const signup = await req('/api/auth/sign-up/email', {
      method: 'POST',
      body: { name: 'Front Desk E2E', email: STAFF_EMAIL, password: STAFF_PASSWORD },
      auth: false,
    })
    assert('staff sign-up', signup.status === 200 && signup.json?.user?.email === STAFF_EMAIL, `status=${signup.status}`)

    const accept = await req('/api/auth/organization/accept-invitation', {
      method: 'POST',
      body: { invitationId },
    })
    assert('accept invitation', accept.status === 200, JSON.stringify(accept.json)?.slice(0, 200))

    await req('/api/auth/organization/set-active', {
      method: 'POST',
      body: { organizationId: orgId },
    })

    const role = await req('/api/auth/organization/get-active-member-role')
    assert('front_desk role after accept', role.status === 200 && role.json?.role === 'front_desk', JSON.stringify(role.json))

    const canInvite = await req('/api/auth/organization/has-permission', {
      method: 'POST',
      body: { permissions: { staff: ['invite'] } },
    })
    const inviteOk = canInvite.json?.success === true || canInvite.json === true
    assert('front_desk cannot invite staff', canInvite.status === 200 && !inviteOk, JSON.stringify(canInvite.json))

    const canBook = await req('/api/auth/organization/has-permission', {
      method: 'POST',
      body: { permissions: { booking: ['create'] } },
    })
    const bookOk = canBook.json?.success === true || canBook.json === true
    assert('front_desk can create booking', canBook.status === 200 && bookOk, JSON.stringify(canBook.json))
  }

  // 11. Housekeeping role denials
  {
    await req('/api/auth/sign-out', { method: 'POST', body: {} })
    cookies = new Map()

    // Owner invites housekeeping
    const ownerIn = await req('/api/auth/sign-in/email', {
      method: 'POST',
      body: { email: OWNER_EMAIL, password: OWNER_PASSWORD },
      auth: false,
    })
    assert('owner re-signin for hk invite', ownerIn.status === 200, `status=${ownerIn.status}`)
    await req('/api/auth/organization/set-active', {
      method: 'POST',
      body: { organizationId: orgId },
    })

    const hkEmail = process.env.E2E_HK_EMAIL || `housekeeping+e2e-${Date.now()}@dostel.test`
    const hkInvite = await req('/api/auth/organization/invite-member', {
      method: 'POST',
      body: { email: hkEmail, role: 'housekeeping', resend: true },
    })
    assert('invite housekeeping', hkInvite.status === 200 && hkInvite.json?.id, JSON.stringify(hkInvite.json)?.slice(0, 160))
    const hkInvitationId = hkInvite.json.id

    await req('/api/auth/sign-out', { method: 'POST', body: {} })
    cookies = new Map()

    const hkSignup = await req('/api/auth/sign-up/email', {
      method: 'POST',
      body: { name: 'Housekeeping E2E', email: hkEmail, password: STAFF_PASSWORD },
      auth: false,
    })
    assert('housekeeping sign-up', hkSignup.status === 200, `status=${hkSignup.status}`)

    const hkAccept = await req('/api/auth/organization/accept-invitation', {
      method: 'POST',
      body: { invitationId: hkInvitationId },
    })
    assert('housekeeping accept invite', hkAccept.status === 200, JSON.stringify(hkAccept.json)?.slice(0, 160))

    await req('/api/auth/organization/set-active', {
      method: 'POST',
      body: { organizationId: orgId },
    })

    const hkRole = await req('/api/auth/organization/get-active-member-role')
    assert('housekeeping role', hkRole.status === 200 && hkRole.json?.role === 'housekeeping', JSON.stringify(hkRole.json))

    const hkInvitePerm = await req('/api/auth/organization/has-permission', {
      method: 'POST',
      body: { permissions: { staff: ['invite'] } },
    })
    assert(
      'housekeeping cannot invite staff',
      hkInvitePerm.status === 200 && !(hkInvitePerm.json?.success === true || hkInvitePerm.json === true),
      JSON.stringify(hkInvitePerm.json)
    )

    const hkRates = await req('/api/auth/organization/has-permission', {
      method: 'POST',
      body: { permissions: { rates: ['read'] } },
    })
    assert(
      'housekeeping cannot read rates',
      hkRates.status === 200 && !(hkRates.json?.success === true || hkRates.json === true),
      JSON.stringify(hkRates.json)
    )

    const hkHouse = await req('/api/auth/organization/has-permission', {
      method: 'POST',
      body: { permissions: { housekeeping: ['update'] } },
    })
    assert(
      'housekeeping can update housekeeping',
      hkHouse.status === 200 && (hkHouse.json?.success === true || hkHouse.json === true),
      JSON.stringify(hkHouse.json)
    )
  }

  writeFileSync(cookieJar, cookieHeader())
  console.log('\nE2E RBAC complete.')
  console.log(`Staff user: ${STAFF_EMAIL}`)
}

main().catch((err) => {
  console.error('\nE2E RBAC aborted:', err.message)
  console.error(JSON.stringify(results, null, 2))
  process.exit(1)
})
