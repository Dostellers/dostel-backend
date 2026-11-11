/**
 * Server fetch for the guest landing page CMS + live board.
 * Callers: apps/frontend/app/page.tsx (HomePage).
 * No prior landing.ts exists (ls confirmed). Reads GraphQL landingPage query only.
 * User: "make it dynamic and controlled via the admin panel… no static data."
 */

export type LandingBoardRow = {
  what: string
  where: string
  when: string
  status: string
  live: boolean
  slug?: string | null
}

export type LandingStripPhoto = {
  url: string
  alt?: string | null
  slug?: string | null
}

export type LandingStripFact = {
  label: string
  detail: string
}

export type LandingThesisCard = {
  head: string
  body: string
  href: string
  cta: string
}

export type LandingCircuit = {
  id: string
  name: string
  color: string
  stops: string[]
  legs: string[]
  nights?: string | null
  blurb?: string | null
}

export type LandingTraveller = {
  name: string
  initial: string
  where: string
  when: string
  note?: string | null
}

export type LandingHostelNode = {
  id: string
  slug: string
  name: string
  city?: string | null
  knownFor?: string | null
  pricePerNight?: number | null
  coverImageUrl?: string | null
  mapX?: number | null
  mapY?: number | null
}

export type LandingDestination = {
  label: string
  city?: string | null
  slug: string
}

export type LandingPage = {
  heroStamp: string
  heroTitle: string
  heroSubtitle: string
  searchPlaceholder: string
  boardTitle: string
  boardCaption: string
  boardColumns: string[]
  stripFacts: LandingStripFact[]
  thesisTitle: string
  thesisHighlight: string
  thesisCards: LandingThesisCard[]
  whosGoingStamp: string
  whosGoingTitle: string
  whosGoingBody: string
  whosGoingBrowseLabel: string
  whosGoingBrowseHref: string
  whosGoingPanelTitle: string
  whosGoingEmptyMessage: string
  whosGoingSideTitle: string
  whosGoingSideBody: string
  whosGoingTags: string[]
  circuitsStamp: string
  circuitsTitle: string
  circuitsBody: string
  circuits: LandingCircuit[]
  closeTitle: string
  closeBody: string
  closePrimaryCta: string
  closePrimaryHref: string
  closeSecondaryCta: string
  closeSecondaryHref: string
  boardRows: LandingBoardRow[]
  stripPhotos: LandingStripPhoto[]
  destinations: LandingDestination[]
  hostelNodes: LandingHostelNode[]
  travellers: LandingTraveller[]
  travellersThisWeek: number
  networkCount: number
  fromPrice?: number | null
  isPublished: boolean
}

const LANDING_QUERY = `
  query LandingPage {
    landingPage {
      heroStamp
      heroTitle
      heroSubtitle
      searchPlaceholder
      boardTitle
      boardCaption
      boardColumns
      stripFacts { label detail }
      thesisTitle
      thesisHighlight
      thesisCards { head body href cta }
      whosGoingStamp
      whosGoingTitle
      whosGoingBody
      whosGoingBrowseLabel
      whosGoingBrowseHref
      whosGoingPanelTitle
      whosGoingEmptyMessage
      whosGoingSideTitle
      whosGoingSideBody
      whosGoingTags
      circuitsStamp
      circuitsTitle
      circuitsBody
      circuits { id name color stops legs nights blurb }
      closeTitle
      closeBody
      closePrimaryCta
      closePrimaryHref
      closeSecondaryCta
      closeSecondaryHref
      boardRows { what where when status live slug }
      stripPhotos { url alt slug }
      destinations { label city slug }
      hostelNodes { id slug name city knownFor pricePerNight coverImageUrl mapX mapY }
      travellers { name initial where when note }
      travellersThisWeek
      networkCount
      fromPrice
      isPublished
    }
  }
`

function graphqlUrl () {
  return (
    process.env.GRAPHQL_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    'http://127.0.0.1:5400/graphql'
  )
}

export async function getLandingPage (): Promise<LandingPage | null> {
  try {
    const res = await fetch(graphqlUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: LANDING_QUERY }),
      next: { revalidate: 30, tags: ['landing'] },
    })
    if (!res.ok) return null
    const json = await res.json()
    if (json.errors?.length) {
      console.error('landingPage GraphQL errors', json.errors)
      return null
    }
    return json.data?.landingPage ?? null
  } catch (err) {
    console.error('landingPage fetch failed', err)
    return null
  }
}
