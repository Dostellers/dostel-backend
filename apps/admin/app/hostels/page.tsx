/* Callers: Next.js App Router at /hostels; Sidebar.tsx nav href '/hostels'.
   Existing apps/admin/app/hostels/page.tsx lacks "use client" (Build Error useRouter)
   and imports hooks from @apollo/client instead of @apollo/client/react. Replacing
   that same file in place — not a new route.
   Schema: Query hostels { id name tagline location.address.city isActive createdAt };
   Mutation createHostel(input: HostelInput!) → { id name }.
   User: "review and build admin dashboard end to end in dostellers colors.
   Also use skills /frontend-design /ui-ux-pro-max" */

'use client'

import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/PageHeader'
import { useToast } from '@/components/ui/use-toast'
import { roleCan } from '@/lib/auth/access'
import { useStaffRole } from '@/lib/auth/use-staff-role'

const GET_HOSTELS = gql`
  query GetHostels {
    hostels {
      id
      name
      tagline
      location { address { city } }
      isActive
      createdAt
    }
  }
`

const CREATE_HOSTEL = gql`
  mutation CreateHostel($input: HostelInput!) {
    createHostel(input: $input) {
      id
      name
    }
  }
`

type HostelRow = {
  id: string
  name: string
  tagline?: string | null
  location?: { address?: { city?: string | null } | null } | null
  isActive?: boolean | null
}

export default function HostelsPage () {
  const router = useRouter()
  const { data, loading, error, refetch } = useQuery<{ hostels: HostelRow[] }>(GET_HOSTELS)
  const [createHostel, { loading: creating }] = useMutation(CREATE_HOSTEL)
  const { toast } = useToast()
  const { role } = useStaffRole()
  const canManageHostels = roleCan(role, { hostel: ['settings'] })
  const [newHostel, setNewHostel] = useState({
    name: '',
    tagline: '',
    location: { address: { city: '' } },
  })

  const handleCreate = async () => {
    if (!newHostel.name.trim()) {
      toast({ title: 'Name required', description: 'Enter a hostel name before creating.', variant: 'destructive' })
      return
    }
    try {
      const result = await createHostel({ variables: { input: newHostel } })
      const created = result.data?.createHostel
      if (created?.id) {
        try {
          const { syncHostelOrganization } = await import('@/lib/auth/sync-hostel-org')
          await syncHostelOrganization({
            hostelId: created.id,
            name: created.name || newHostel.name,
          })
        } catch (orgErr: unknown) {
          const orgMessage = orgErr instanceof Error ? orgErr.message : 'org sync failed'
          toast({
            title: 'Hostel created — staff org pending',
            description: orgMessage,
            variant: 'destructive',
          })
        }
      }
      toast({ title: 'Hostel created', variant: 'success' })
      setNewHostel({ name: '', tagline: '', location: { address: { city: '' } } })
      refetch()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      toast({ title: 'Could not create hostel', description: message, variant: 'destructive' })
    }
  }

  return (
    <main className="min-h-dvh px-5 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Hostels"
          description="Properties on the Dostel board — add, review, and open a property desk."
          actions={
            <Button type="button" variant="outline" onClick={() => refetch()} disabled={loading}>
              Refresh
            </Button>
          }
        />

        {canManageHostels ? (
          <Card className="mb-6 reveal-card">
            <CardHeader>
              <CardTitle>Add hostel</CardTitle>
              <p className="text-sm text-ink-500">Name, tagline, and city are enough to start. Creates a staff org too.</p>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="hostel-name" className="text-sm font-medium text-ink-700">Name *</label>
                <Input
                  id="hostel-name"
                  placeholder="Dostel Goa"
                  value={newHostel.name}
                  onChange={(e) => setNewHostel({ ...newHostel, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="hostel-tagline" className="text-sm font-medium text-ink-700">Tagline</label>
                <Input
                  id="hostel-tagline"
                  placeholder="Beds by the beach"
                  value={newHostel.tagline}
                  onChange={(e) => setNewHostel({ ...newHostel, tagline: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="hostel-city" className="text-sm font-medium text-ink-700">City</label>
                <Input
                  id="hostel-city"
                  placeholder="Anjuna"
                  value={newHostel.location.address.city}
                  onChange={(e) => setNewHostel({
                    ...newHostel,
                    location: { address: { city: e.target.value } },
                  })}
                />
              </div>
              <Button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="sm:col-span-3"
              >
                {creating ? 'Creating…' : 'Create hostel'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <p className="mb-6 text-sm text-ink-500">Only owners and managers can add hostel settings.</p>
        )}

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-busy>
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-40 rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <section className="rounded-xl border border-error/30 bg-white p-6" role="alert">
            <p className="stamp text-error mb-2">Error</p>
            <p className="text-sm text-ink-700">{(error as Error).message}</p>
            <Button className="mt-4" type="button" onClick={() => refetch()}>Retry</Button>
          </section>
        )}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(data?.hostels?.length ?? 0) === 0 ? (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="py-12 text-center">
                  <p className="font-[family-name:var(--font-display)] text-xl font-bold text-ink-1000">
                    No hostels yet
                  </p>
                  <p className="mt-1 text-sm text-ink-500">Create the first property above.</p>
                </CardContent>
              </Card>
            ) : (
              data?.hostels?.map((h, index) => (
                <Card
                  key={h.id}
                  className="reveal-card transition hover:border-ink-400"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle>{h.name}</CardTitle>
                      <span
                        className={`stamp ${h.isActive ? 'text-success border-success/40' : 'text-ink-500 border-ink-300'}`}
                      >
                        {h.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {h.tagline && <p className="text-sm text-ink-500">{h.tagline}</p>}
                  </CardHeader>
                  <CardContent>
                    <p className="font-data text-sm text-ink-600">
                      {h.location?.address?.city || 'City unset'}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => router.push(`/hostels/${h.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="stamp"
                        size="sm"
                        type="button"
                        onClick={() => router.push(`/hostels/${h.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}
