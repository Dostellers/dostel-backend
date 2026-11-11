import Link from 'next/link'
import HostelDetailClient from '@/components/HostelDetailClient'
import { getHostelBySlug } from '@/lib/hostels'

export const revalidate = 30

export default async function HostelDetailPage ({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const resolved = await Promise.resolve(params)
  const slug = resolved.slug
  const hostel = await getHostelBySlug(slug)

  if (!hostel) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl text-ink-1000">Hostel not found</h1>
        <p className="mt-3 text-ink-600">That property is not on the live network board.</p>
        <Link href="/hostels" className="mt-6 inline-flex text-coral-700 underline">
          Browse hostels
        </Link>
      </div>
    )
  }

  return <HostelDetailClient slug={slug} apiHostel={hostel} />
}
