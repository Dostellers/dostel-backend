/* Callers: package.json auth:seed. No prior seed-auth script.
   Schema: Mongo user/organization/member via Better Auth API.
   SEED_ADMIN_* from env (local defaults). User: "go back to rbac work" */

import { betterAuth } from 'better-auth'
import { mongodbAdapter } from '@better-auth/mongo-adapter'
import { organization } from 'better-auth/plugins'
import { createAccessControl } from 'better-auth/plugins/access'
import {
  defaultStatements,
  adminAc,
  ownerAc,
  memberAc,
} from 'better-auth/plugins/organization/access'
import { MongoClient } from 'mongodb'

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dostel'
const baseURL = process.env.BETTER_AUTH_URL || 'http://admin.dostel.65.109.113.80.nip.io'
const secret = process.env.BETTER_AUTH_SECRET || 'dostel-local-dev-better-auth-secret-change-me'
const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@dostel.com'
const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'password123'
const adminName = process.env.SEED_ADMIN_NAME || 'Dostel Owner'
const orgName = process.env.SEED_ORG_NAME || 'Demo Hostel'
const orgSlug = process.env.SEED_ORG_SLUG || 'demo-hostel'
const hostelId = process.env.SEED_HOSTEL_ID || 'demo'

const statement = {
  ...defaultStatements,
  hostel: ['read', 'update', 'settings'],
  booking: ['read', 'create', 'update', 'cancel'],
  room: ['read', 'create', 'update'],
  guest: ['read', 'create', 'update'],
  rates: ['read', 'update'],
  housekeeping: ['read', 'update'],
  reports: ['read'],
  staff: ['read', 'invite', 'update', 'remove'],
}
const ac = createAccessControl(statement)
const roles = {
  owner: ac.newRole({
    ...ownerAc.statements,
    hostel: ['read', 'update', 'settings'],
    booking: ['read', 'create', 'update', 'cancel'],
    room: ['read', 'create', 'update'],
    guest: ['read', 'create', 'update'],
    rates: ['read', 'update'],
    housekeeping: ['read', 'update'],
    reports: ['read'],
    staff: ['read', 'invite', 'update', 'remove'],
  }),
  manager: ac.newRole({
    ...adminAc.statements,
    hostel: ['read', 'update', 'settings'],
    booking: ['read', 'create', 'update', 'cancel'],
    room: ['read', 'create', 'update'],
    guest: ['read', 'create', 'update'],
    rates: ['read', 'update'],
    housekeeping: ['read', 'update'],
    reports: ['read'],
    staff: ['read', 'invite', 'update', 'remove'],
  }),
  front_desk: ac.newRole({
    ...memberAc.statements,
    hostel: ['read'],
    booking: ['read', 'create', 'update', 'cancel'],
    room: ['read'],
    guest: ['read', 'create', 'update'],
    rates: ['read'],
    housekeeping: ['read'],
    reports: ['read'],
    staff: ['read'],
  }),
  housekeeping: ac.newRole({
    ...memberAc.statements,
    hostel: ['read'],
    booking: ['read'],
    room: ['read'],
    guest: ['read'],
    rates: [],
    housekeeping: ['read', 'update'],
    reports: [],
    staff: [],
  }),
}

const client = new MongoClient(mongoUri)
await client.connect()
const db = client.db()

const auth = betterAuth({
  appName: 'Dostel Ops',
  baseURL,
  secret,
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  plugins: [
    organization({
      ac,
      roles,
      creatorRole: 'owner',
    }),
  ],
})

async function main () {
  let userId
  try {
    const created = await auth.api.signUpEmail({
      body: {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
      },
    })
    userId = created.user.id
    console.log('Created owner', adminEmail)
  } catch (err) {
    const existing = await db.collection('user').findOne({ email: adminEmail })
    if (!existing) throw err
    userId = existing.id || String(existing._id)
    console.log('Owner already exists', adminEmail)
  }

  const existingOrg = await db.collection('organization').findOne({ slug: orgSlug })
  if (existingOrg) {
    console.log('Organization already exists', orgSlug)
  } else {
    await auth.api.createOrganization({
      body: {
        name: orgName,
        slug: orgSlug,
        userId,
        metadata: { hostelId },
      },
    })
    console.log('Created organization', orgSlug, 'hostelId=', hostelId)
  }

  console.log('Seed complete. Sign in with', adminEmail)
}

try {
  await main()
} finally {
  await client.close()
}
