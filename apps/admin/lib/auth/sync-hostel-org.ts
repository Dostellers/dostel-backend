/* Callers: hostels/page.tsx handleCreate + hostels/new handleSubmit.
   No prior sync helper. Schema: Better Auth org metadata.hostelId.
   Loop prompt: bind hostel create → org metadata.hostelId */

import { authClient } from '@/lib/auth-client'

function slugify (value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'hostel'
}

export async function syncHostelOrganization (input: {
  hostelId: string
  name: string
  slug?: string | null
}) {
  const baseSlug = slugify(input.slug || input.name)
  const slug = `${baseSlug}-${String(input.hostelId).slice(-6)}`

  const { data, error } = await authClient.organization.create({
    name: input.name,
    slug,
    metadata: { hostelId: String(input.hostelId) },
  })

  if (error) {
    const retry = await authClient.organization.create({
      name: input.name,
      slug: `${slug}-${Date.now().toString(36).slice(-4)}`,
      metadata: { hostelId: String(input.hostelId) },
    })
    if (retry.error) throw new Error(retry.error.message || 'Could not create staff org')
    if (retry.data?.id) {
      await authClient.organization.setActive({ organizationId: retry.data.id })
    }
    return retry.data
  }

  if (data?.id) {
    await authClient.organization.setActive({ organizationId: data.id })
  }
  return data
}
