/* Callers: apps/admin/app/landing/page.tsx save actions.
   Better Auth session + hostel:settings, then direct Mongo writes
   (no public GraphQL mutation needed from the browser).
   User: "make it dynamic and controlled via the admin panel… no static data." */

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { MongoClient, ObjectId } from 'mongodb'
import { auth } from '@/lib/auth'
import { roleCan } from '@/lib/auth/access'
import type { StaffRole } from '@/lib/auth/permissions'

export const runtime = 'nodejs'

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dostel'

function sanitizePublicPath (href: unknown, fallback = '/hostels') {
  if (!href || typeof href !== 'string') return fallback
  const trimmed = href.trim()
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed
  return fallback
}

async function requireLandingEditor () {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const member = await auth.api.getActiveMember({ headers: await headers() }).catch(() => null)
  const role = (member?.role || null) as StaffRole | null
  if (!roleCan(role, { hostel: ['settings'] })) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { session, role }
}

async function withDb<T> (fn: (db: ReturnType<MongoClient['db']>) => Promise<T>) {
  const client = new MongoClient(mongoUri)
  await client.connect()
  try {
    return await fn(client.db())
  } finally {
    await client.close()
  }
}

export async function POST (req: NextRequest) {
  const gate = await requireLandingEditor()
  if ('error' in gate && gate.error) return gate.error

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  try {
    if (body.action === 'updateLanding') {
      const input = body.input || {}
      if (Array.isArray(input.thesisCards)) {
        input.thesisCards = input.thesisCards.map((c: { href?: string }) => ({
          ...c,
          href: sanitizePublicPath(c.href, '/hostels'),
        }))
      }
      if (input.whosGoingBrowseHref != null) {
        input.whosGoingBrowseHref = sanitizePublicPath(input.whosGoingBrowseHref, '/hostels')
      }
      if (input.closePrimaryHref != null) {
        input.closePrimaryHref = sanitizePublicPath(input.closePrimaryHref, '/hostels')
      }
      if (input.closeSecondaryHref != null) {
        input.closeSecondaryHref = sanitizePublicPath(input.closeSecondaryHref, '/dostellers')
      }

      await withDb(async (db) => {
        await db.collection('landingpages').updateOne(
          { key: 'home' },
          { $set: { ...input, key: 'home', updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
          { upsert: true },
        )
      })
      return NextResponse.json({ ok: true })
    }

    if (body.action === 'updateHostelBoard') {
      const id = body.id
      const input = body.input || {}
      if (!id || !ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid hostel id' }, { status: 400 })
      }
      const allowed = [
        'knownFor',
        'featuredOnLanding',
        'boardPriority',
        'coverImageUrl',
        'tagline',
        'mapX',
        'mapY',
      ] as const
      const patch: Record<string, unknown> = { updatedAt: new Date() }
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(input, key) && input[key] !== undefined) {
          patch[key] = input[key]
        }
      }
      await withDb(async (db) => {
        const result = await db.collection('hostels').updateOne(
          { _id: new ObjectId(id) },
          { $set: patch },
        )
        if (!result.matchedCount) throw new Error('Hostel not found')
      })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Save failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
