/* Callers: app/api/auth/[...all]/route.ts (toNextJsHandler), scripts/seed-auth.mjs,
   staff pages via auth.api.*. No Better Auth server config exists yet
   (lib/server/auth.ts is an unrelated GraphQL probe). Schema: Mongo collections
   user/session/account/organization/member/invitation. Secret from
   BETTER_AUTH_SECRET only. User: "go back to rbac work" */

import { betterAuth } from 'better-auth'
import { mongodbAdapter } from '@better-auth/mongo-adapter'
import { organization } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { MongoClient } from 'mongodb'
import { ac, roles } from './auth/permissions'

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dostel'
const client = new MongoClient(mongoUri)
const db = client.db()

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://admin.dostel.65.109.113.80.nip.io'

export const auth = betterAuth({
  appName: 'Dostel Ops',
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET || 'dostel-local-dev-better-auth-secret-change-me',
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    baseURL,
    'http://admin.dostellers.com',
    'http://admin.dostel.witylogix.com',
    'http://admin.dostel.65.109.113.80.nip.io',
    'http://127.0.0.1:5302',
    'http://localhost:5302',
  ],
  advanced: {
    database: {
      joins: true,
    },
  },
  plugins: [
    organization({
      ac,
      roles,
      creatorRole: 'owner',
      allowUserToCreateOrganization: true,
      membershipLimit: 50,
      invitationExpiresIn: 60 * 60 * 24 * 7,
      async sendInvitationEmail (data) {
        const inviteLink = `${baseURL}/accept-invite?invitationId=${data.id}`
        console.info('[auth] staff invite', {
          email: data.email,
          role: data.role,
          organization: data.organization.name,
          inviteLink,
        })
      },
    }),
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
