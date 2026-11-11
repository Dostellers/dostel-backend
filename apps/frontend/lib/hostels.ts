/**
 * Server/client fetch for live hostel listings.
 * Callers: app/hostels/page.tsx, app/hostels/[slug]/page.tsx.
 * User: dynamic landing/platform — no static lib/data.
 */

export type LiveHostel = {
  id: string
  slug: string
  name: string
  city: string | null
  tagline: string | null
  knownFor: string | null
  pricePerNight: number | null
  coverImageUrl: string | null
  featuredOnLanding: boolean | null
  boardPriority: number | null
  isActive: boolean | null
  inauguratedOn: string | null
}

const HOSTELS_QUERY = `
  query GetHostels {
    hostels {
      id
      slug
      name
      city
      tagline
      knownFor
      pricePerNight
      coverImageUrl
      featuredOnLanding
      boardPriority
      isActive
      inauguratedOn
    }
  }
`

function graphqlUrl () {
  if (typeof window === 'undefined') {
    return (
      process.env.GRAPHQL_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      'http://127.0.0.1:5400/graphql'
    )
  }
  return process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://127.0.0.1:5400/graphql'
}

export async function getHostels (): Promise<LiveHostel[]> {
  try {
    const res = await fetch(graphqlUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: HOSTELS_QUERY }),
      next: { revalidate: 30, tags: ['hostels'] },
    })
    if (!res.ok) return []
    const json = await res.json()
    if (json.errors?.length) {
      console.error('hostels GraphQL errors', json.errors)
      return []
    }
    return (json.data?.hostels || []).filter((h: LiveHostel) => h?.slug && h.isActive !== false)
  } catch (err) {
    console.error('hostels fetch failed', err)
    return []
  }
}

export async function getHostelBySlug (slug: string): Promise<LiveHostel | null> {
  const all = await getHostels()
  return all.find((h) => h.slug === slug) || null
}

export function terrainFor (h: Pick<LiveHostel, 'knownFor' | 'city' | 'tagline'>) {
  const blob = `${h.knownFor || ''} ${h.city || ''} ${h.tagline || ''}`.toLowerCase()
  if (/beach|coast|anjuna|gokarna/.test(blob)) return 'beach'
  if (/jaipur|old city|heritage/.test(blob)) return 'heritage'
  if (/airport|work|city|bangalore|delhi/.test(blob)) return 'city'
  if (/forest|coffee|rain|jungle|coorg/.test(blob)) return 'jungle'
  if (/himalaya|shola|mountain|vattakanal|dharamshala|kodai/.test(blob)) return 'mountains'
  return 'city'
}
