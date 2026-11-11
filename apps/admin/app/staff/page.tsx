/* Callers: Sidebar /staff link; Next App Router. No prior staff page.
   Schema: org members + invitations via Better Auth client.
   User: "go back to rbac work" */

'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import {
  authClient,
  useActiveOrganization,
  useListOrganizations,
  useSession,
} from '@/lib/auth-client'
import { roleCan } from '@/lib/auth/access'
import { useStaffRole } from '@/lib/auth/use-staff-role'
import { roleLabels, type StaffRole } from '@/lib/auth/permissions'

type MemberRow = {
  id: string
  role: string
  user: { id: string; name: string; email: string }
}

type InviteRow = {
  id: string
  email: string
  role: string
  status: string
}

const inviteRoles: StaffRole[] = ['manager', 'front_desk', 'housekeeping']

function readHostelId (metadata: unknown): string | null {
  if (!metadata) return null
  let value: unknown = metadata
  if (typeof metadata === 'string') {
    try { value = JSON.parse(metadata) } catch { return null }
  }
  if (value && typeof value === 'object' && 'hostelId' in value) {
    const id = (value as { hostelId?: unknown }).hostelId
    return id == null ? null : String(id)
  }
  return null
}

export default function StaffPage () {
  const { data: session } = useSession()
  const { data: orgs } = useListOrganizations()
  const { data: activeOrg } = useActiveOrganization()
  const { role: myRole } = useStaffRole()
  const canInvite = roleCan(myRole, { staff: ['invite'] })
  const canRemove = roleCan(myRole, { staff: ['remove'] })
  const activeHostelId = readHostelId(activeOrg?.metadata)
  const [members, setMembers] = useState<MemberRow[]>([])
  const [invites, setInvites] = useState<InviteRow[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<StaffRole>('front_desk')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    if (!activeOrg?.id) {
      setMembers([])
      setInvites([])
      return
    }
    const [memberRes, inviteRes] = await Promise.all([
      authClient.organization.listMembers({
        query: { organizationId: activeOrg.id },
      }),
      authClient.organization.listInvitations({
        query: { organizationId: activeOrg.id },
      }),
    ])
    setMembers((memberRes.data?.members as MemberRow[]) || [])
    setInvites((inviteRes.data as InviteRow[]) || [])
  }, [activeOrg?.id])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (!activeOrg && orgs?.length) {
      void authClient.organization.setActive({ organizationId: orgs[0].id })
    }
  }, [activeOrg, orgs])

  async function onInvite (event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    const { error: inviteError } = await authClient.organization.inviteMember({
      email,
      role,
      resend: true,
    })
    if (inviteError) {
      setError(inviteError.message || 'Invite failed')
      setBusy(false)
      return
    }
    setMessage(`Invite sent to ${email} as ${roleLabels[role]}`)
    setEmail('')
    setBusy(false)
    await refresh()
  }

  async function onRemove (memberIdOrEmail: string) {
    setBusy(true)
    setError('')
    const { error: removeError } = await authClient.organization.removeMember({
      memberIdOrEmail,
    })
    if (removeError) setError(removeError.message || 'Remove failed')
    setBusy(false)
    await refresh()
  }

  async function onSelectOrg (organizationId: string) {
    await authClient.organization.setActive({ organizationId })
  }

  return (
    <div className="px-6 py-8 sm:px-8">
      <PageHeader
        title="Staff"
        description="Invite managers and front-desk staff to this hostel. Roles are scoped per property organization."
      />

      {activeHostelId && (
        <p className="mb-4 text-sm text-ink-500">
          Linked hostel id{' '}
          <code className="rounded bg-ink-100 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-ink-800">
            {activeHostelId}
          </code>
        </p>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {(orgs || []).map((org) => (
          <button
            key={org.id}
            type="button"
            onClick={() => void onSelectOrg(org.id)}
            className={[
              'rounded-lg border px-3 py-2 text-sm font-medium transition',
              activeOrg?.id === org.id
                ? 'border-coral-600 bg-coral-600 text-white'
                : 'border-ink-200 bg-white text-ink-700 hover:border-coral-400',
            ].join(' ')}
          >
            {org.name}
          </button>
        ))}
        {!orgs?.length && (
          <p className="text-sm text-ink-500">
            No hostel organizations yet. Run <code className="rounded bg-ink-100 px-1">npm run auth:seed</code> or create one after sign-in.
          </p>
        )}
      </div>

      {canInvite ? (
        <form
          onSubmit={onInvite}
          className="mb-8 grid max-w-2xl gap-3 rounded-xl border border-ink-200 bg-white p-5 sm:grid-cols-[1fr_10rem_auto]"
        >
          <input
            type="email"
            required
            placeholder="staff@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-lg border border-ink-300 px-3 text-sm outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-600"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as StaffRole)}
            className="h-11 rounded-lg border border-ink-300 bg-white px-3 text-sm"
          >
            {inviteRoles.map((r) => (
              <option key={r} value={r}>{roleLabels[r]}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={busy || !activeOrg}
            className="h-11 rounded-lg bg-coral-600 px-4 text-sm font-semibold text-white hover:bg-coral-700 disabled:opacity-50"
          >
            Invite
          </button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-ink-500">You can view the team, but only owners/managers can invite staff.</p>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-error/30 bg-coral-50 px-3 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-4 rounded-lg border border-success/30 bg-white px-3 py-2 text-sm text-success">
          {message}
        </p>
      )}

      <section className="mb-8">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg font-bold text-ink-1000">
          Members {activeOrg ? `· ${activeOrg.name}` : ''}
        </h2>
        <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 bg-paper text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-4 py-3 text-ink-900">{m.user?.name || '—'}</td>
                  <td className="px-4 py-3 text-ink-600">{m.user?.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-ink-100 px-2 py-1 text-xs font-medium text-ink-700">
                      {roleLabels[m.role as StaffRole] || m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canRemove && m.user?.id !== session?.user?.id && m.role !== 'owner' && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void onRemove(m.user.email)}
                        className="text-sm text-error hover:underline disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!members.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-ink-500">No members loaded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-lg font-bold text-ink-1000">
          Pending invites
        </h2>
        <ul className="space-y-2">
          {invites.filter((i) => i.status === 'pending').map((invite) => (
            <li
              key={invite.id}
              className="flex items-center justify-between rounded-lg border border-ink-200 bg-white px-4 py-3 text-sm"
            >
              <span>
                {invite.email}
                <span className="ml-2 text-ink-500">
                  · {roleLabels[invite.role as StaffRole] || invite.role}
                </span>
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  await authClient.organization.cancelInvitation({ invitationId: invite.id })
                  await refresh()
                }}
                className="text-ink-500 hover:text-error"
              >
                Cancel
              </button>
            </li>
          ))}
          {!invites.filter((i) => i.status === 'pending').length && (
            <li className="text-sm text-ink-500">No pending invites.</li>
          )}
        </ul>
      </section>
    </div>
  )
}
