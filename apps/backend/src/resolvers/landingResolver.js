const LandingPage = require('../models/landingPage')
const Hostel = require('../models/hostel')
const Booking = require('../models/booking')
const InventoryDay = require('../models/InventoryDay')

const { AuthenticationError, ForbiddenError } = require('apollo-server-errors')

const ADMIN_ROLES = new Set(['admin', 'manager', 'staff', 'owner'])

function requireLandingEditor (context) {
  const secret = process.env.DOSTEL_INTERNAL_EDIT_KEY || process.env.JWT_SECRET
  if (secret && context && context.editKey && context.editKey === secret) {
    return { via: 'editKey' }
  }
  if (!context || !context.user) {
    throw new AuthenticationError('Authentication required')
  }
  if (
    context.user.__type !== 'User' ||
    context.user.isActive === false ||
    !ADMIN_ROLES.has(context.user.role)
  ) {
    throw new ForbiddenError('Admin access required to edit landing page')
  }
  return { via: 'user', user: context.user }
}

function sanitizePublicPath (href, fallback = '/hostels') {
  if (!href || typeof href !== 'string') return fallback
  const trimmed = href.trim()
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed
  return fallback
}


/**
 * Landing page CMS + live board/traveller computation.
 * Callers: src/resolvers/index.js merges Query/Mutation (landingResolver.Query/Mutation).
 * No prior landingResolver exists (confirmed by ls).
 * Schemas: LandingPage singleton R/W; Hostel board fields R/W via updateHostelLandingBoard;
 * Booking+Customer lean reads for opt-in travellers; InventoryDay aggregate for tonight status.
 * User: "make it dynamic and controlled via the admin panel… no static data."
 */

const DEFAULT_THESIS = [
  {
    head: 'Measured, not claimed',
    body: 'Every property publishes what was checked, when, and by what method — and marks it “not measured” where we have no reading we can stand behind. The checks change with the terrain; the standard does not.',
    href: '/hostels',
    cta: 'See a stay card',
  },
  {
    head: 'Know the room first',
    body: 'Guests choose what to share before they arrive: who is trekking Friday, who is working India hours, who is teaching something on Saturday. Opt-in, first names, cleared at checkout.',
    href: '/hostels',
    cta: 'Browse the network',
  },
  {
    head: 'No points, no wallet',
    body: 'Dostellers is not a currency you grind for. Stay across the network and the people at the next one already know how you take your chai. That is the whole mechanic.',
    href: '/dostellers',
    cta: 'About Dostellers',
  },
]

function todayKey (d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function startOfWeek (d = new Date()) {
  const out = new Date(d)
  out.setHours(0, 0, 0, 0)
  const day = out.getDay()
  const diff = day === 0 ? -6 : 1 - day
  out.setDate(out.getDate() + diff)
  return out
}

function endOfWeek (d = new Date()) {
  const out = startOfWeek(d)
  out.setDate(out.getDate() + 7)
  return out
}

function firstName (fullName) {
  if (!fullName || typeof fullName !== 'string') return 'Guest'
  const part = fullName.trim().split(/\s+/)[0]
  return part || 'Guest'
}

function formatStayWindow (checkIn, checkOut, roomType) {
  const opts = { weekday: 'short' }
  const a = checkIn ? new Date(checkIn).toLocaleDateString('en-GB', opts) : '?'
  const b = checkOut ? new Date(checkOut).toLocaleDateString('en-GB', opts) : '?'
  const room = roomType ? ` · ${roomType}` : ''
  return `${a}–${b}${room}`
}

function occupancyStatus (sold, total) {
  if (!total || total <= 0) return { status: 'Open', live: false }
  const pct = sold / total
  if (pct >= 0.95) return { status: 'Full', live: true }
  if (pct >= 0.7) return { status: 'Filling', live: true }
  return { status: 'Open', live: false }
}

async function occupancyByHostel (hostelIds) {
  const date = todayKey()
  if (!hostelIds.length) return new Map()
  const rows = await InventoryDay.aggregate([
    { $match: { hostelId: { $in: hostelIds }, date } },
    {
      $group: {
        _id: '$hostelId',
        total: { $sum: '$total' },
        sold: { $sum: { $add: ['$sold', '$held'] } },
      },
    },
  ]).catch(() => [])
  const map = new Map()
  for (const row of rows) {
    map.set(String(row._id), occupancyStatus(row.sold, row.total))
  }
  return map
}

function buildDefaultCircuits (hostels) {
  const byCity = Object.fromEntries(
    hostels.map((h) => [String(h.city || '').toLowerCase(), h.slug])
  )
  const circuits = []
  const hillStops = [byCity.kodaikanal, byCity.coorg].filter(Boolean)
  if (hillStops.length) {
    circuits.push({
      id: 'hills',
      name: 'The Hill Circuit',
      color: '#FFFFFF',
      stops: hillStops,
      legs: hillStops.length > 1 ? ['6h bus'] : [],
      nights: '4–6 nights',
      blurb: 'Mist and coffee country — linked on one network identity.',
      sortOrder: 0,
    })
  }
  const coast = byCity.goa
  if (coast) {
    circuits.push({
      id: 'coast',
      name: 'The Coast Run',
      color: '#FCCC00',
      stops: [coast],
      legs: [],
      nights: '3–5 nights',
      blurb: 'Beach until you need quiet again.',
      sortOrder: 1,
    })
  }
  if (!circuits.length && hostels.length) {
    circuits.push({
      id: 'network',
      name: 'The Network',
      color: '#F54E4E',
      stops: hostels.slice(0, 6).map((h) => h.slug),
      legs: [],
      nights: 'Open stays',
      blurb: 'Every active Dostel house on one board.',
      sortOrder: 0,
    })
  }
  return circuits
}

async function ensureLandingDoc () {
  let doc = await LandingPage.findOne({ key: 'home' })
  if (doc) {
    let dirty = false
    if (!doc.thesisCards || doc.thesisCards.length === 0) {
      doc.thesisCards = DEFAULT_THESIS
      dirty = true
    }
    if (!doc.circuits || doc.circuits.length === 0) {
      const hostels = await Hostel.find({ isActive: true }).select('slug city').lean()
      if (hostels.length) {
        doc.circuits = buildDefaultCircuits(hostels)
        dirty = true
      }
    }
    if (dirty) await doc.save()
    return doc
  }

  const hostels = await Hostel.find({ isActive: true }).select('slug city').lean()
  doc = await LandingPage.create({
    key: 'home',
    thesisCards: DEFAULT_THESIS,
    circuits: buildDefaultCircuits(hostels),
  })
  return doc
}

function toPlain (doc) {
  const obj = doc.toObject ? doc.toObject() : { ...doc }
  obj.id = String(obj._id || obj.id)
  if (obj.updatedAt) obj.updatedAt = new Date(obj.updatedAt).toISOString()
  return obj
}

async function loadBoardHostels () {
  return Hostel.find({ isActive: true })
    .select(
      'slug name city tagline knownFor pricePerNight coverImageUrl image thumbnail featured featuredOnLanding boardPriority mapX mapY inauguratedOn'
    )
    .lean()
}

function isFeaturedOnLanding (hostel) {
  // Default on: only explicit featuredOnLanding=false hides a property from the board.
  if (typeof hostel.featuredOnLanding === 'boolean') return hostel.featuredOnLanding
  return true
}

function coverUrl (hostel) {
  return hostel.coverImageUrl || hostel.image || hostel.thumbnail || null
}

function customerHasGraphConsent (customer) {
  if (!customer || !Array.isArray(customer.consents)) return false
  const latest = [...customer.consents]
    .reverse()
    .find((c) => c.purpose === 'guest_graph_crossings')
  return Boolean(latest && latest.granted === true && !latest.withdrawnAt)
}

async function computeLandingPayload (doc) {
  const plain = toPlain(doc)
  const hostels = await loadBoardHostels()
  const boardHostels = hostels
    .filter(isFeaturedOnLanding)
    .sort((a, b) => {
      const pa = Number(a.boardPriority || 0)
      const pb = Number(b.boardPriority || 0)
      if (pb !== pa) return pb - pa
      return String(a.city || a.name).localeCompare(String(b.city || b.name))
    })

  const occ = await occupancyByHostel(boardHostels.map((h) => h._id))

  const boardRows = boardHostels.map((h) => {
    const status = occ.get(String(h._id)) || { status: 'Open', live: false }
    const price = Number(h.pricePerNight || 0)
    return {
      what: h.city || h.name || '—',
      where: h.knownFor || h.tagline || 'Dostel stay',
      when: price > 0 ? `₹${Math.round(price)}` : '—',
      status: status.status,
      live: status.live,
      slug: h.slug,
      hostelId: String(h._id),
    }
  })

  const stripPhotos = boardHostels
    .map((h) => {
      const url = coverUrl(h)
      if (!url) return null
      return { url, alt: h.name, slug: h.slug }
    })
    .filter(Boolean)

  const prices = hostels
    .map((h) => Number(h.pricePerNight || 0))
    .filter((n) => n > 0)
  const fromPrice = prices.length ? Math.min(...prices) : null
  const networkCount = hostels.length
  const years = hostels
    .map((h) => (h.inauguratedOn ? new Date(h.inauguratedOn).getFullYear() : null))
    .filter(Boolean)
  const sinceYear = years.length ? Math.min(...years) : plain.foundedYear

  let stripFacts = (plain.stripFacts || []).map((f) => ({
    label: f.label,
    detail: f.detail,
  }))
  if (plain.useComputedStripFacts !== false) {
    stripFacts = [
      {
        label: `${networkCount} hostel${networkCount === 1 ? '' : 's'}`,
        detail: 'live on the network board',
      },
      {
        label: fromPrice != null ? `From ₹${Math.round(fromPrice)}` : 'Rates live',
        detail: 'a night, all in',
      },
      {
        label: `Since ${sinceYear}`,
        detail: 'the network standard',
      },
      {
        label: 'One standard',
        detail: 'measured the same way everywhere',
      },
    ]
  }

  const weekStart = startOfWeek()
  const weekEnd = endOfWeek()
  const bookings = await Booking.find({
    sequenceStatus: { $in: ['Confirmed', 'CheckedIn'] },
    checkInDate: { $lt: weekEnd },
    checkOutDate: { $gt: weekStart },
  })
    .populate('customer')
    .populate('hostel')
    .limit(40)
    .lean()
    .catch(() => [])

  const travellers = []
  let travellersThisWeek = 0
  for (const b of bookings) {
    const customer = b.customer
    if (!customer || !customerHasGraphConsent(customer)) continue
    travellersThisWeek += 1

    let note = null
    const facts = Array.isArray(customer.guestFacts) ? customer.guestFacts : []
    const interest = facts.find(
      (f) =>
        f.category === 'interest' &&
        f.reviewStatus === 'approved' &&
        f.visibility === 'guest_visible' &&
        (!f.expiresAt || new Date(f.expiresAt) > new Date())
    )
    if (interest) note = interest.text

    if (travellers.length >= 8) continue

    const name = firstName(customer.alias || customer.fullName)
    const where = (b.hostel && (b.hostel.city || b.hostel.name)) || 'Dostel'
    travellers.push({
      name,
      initial: name[0]?.toUpperCase() || 'G',
      where,
      when: formatStayWindow(b.checkInDate, b.checkOutDate, b.roomType),
      note,
    })
  }

  const destinations = hostels.map((h) => ({
    label: h.city ? `${h.city} · ${h.name}` : h.name,
    city: h.city || null,
    slug: h.slug,
  }))

  const hostelNodes = hostels.map((h) => ({
    id: String(h._id),
    slug: h.slug,
    name: h.name,
    city: h.city || null,
    knownFor: h.knownFor || h.tagline || null,
    pricePerNight: h.pricePerNight ?? null,
    coverImageUrl: coverUrl(h),
    mapX: h.mapX ?? null,
    mapY: h.mapY ?? null,
    featuredOnLanding: isFeaturedOnLanding(h),
  }))

  const circuits = (plain.circuits || [])
    .slice()
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
    .map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color || '#F54E4E',
      stops: (c.stops || []).filter(Boolean),
      legs: c.legs || [],
      nights: c.nights || '',
      blurb: c.blurb || '',
      sortOrder: c.sortOrder || 0,
    }))

  return {
    ...plain,
    thesisCards: (plain.thesisCards || []).map((c) => ({
      head: c.head,
      body: c.body,
      href: c.href,
      cta: c.cta,
    })),
    whosGoingTags: plain.whosGoingTags || [],
    boardColumns: plain.boardColumns || ['Where', 'Known for', 'From', 'Tonight'],
    circuits,
    stripFacts,
    boardRows,
    stripPhotos,
    destinations,
    hostelNodes,
    travellers,
    travellersThisWeek,
    networkCount,
    fromPrice,
  }
}

const landingResolvers = {
  Query: {
    landingPage: async () => {
      const doc = await ensureLandingDoc()
      return computeLandingPayload(doc)
    },
  },
  Mutation: {
    updateLandingPage: async (_, { input }, context) => {
      requireLandingEditor(context)
      const doc = await ensureLandingDoc()
      const allowed = [
        'heroStamp',
        'heroTitle',
        'heroSubtitle',
        'searchPlaceholder',
        'boardTitle',
        'boardCaption',
        'boardColumns',
        'stripFacts',
        'useComputedStripFacts',
        'thesisTitle',
        'thesisHighlight',
        'thesisCards',
        'whosGoingStamp',
        'whosGoingTitle',
        'whosGoingBody',
        'whosGoingBrowseLabel',
        'whosGoingBrowseHref',
        'whosGoingPanelTitle',
        'whosGoingEmptyMessage',
        'whosGoingSideTitle',
        'whosGoingSideBody',
        'whosGoingTags',
        'circuitsStamp',
        'circuitsTitle',
        'circuitsBody',
        'circuits',
        'closeTitle',
        'closeBody',
        'closePrimaryCta',
        'closePrimaryHref',
        'closeSecondaryCta',
        'closeSecondaryHref',
        'foundedYear',
        'isPublished',
      ]
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(input, key) && input[key] !== undefined) {
          doc[key] = input[key]
        }
      }
      if (Array.isArray(doc.thesisCards)) {
        doc.thesisCards = doc.thesisCards.map((c) => ({
          ...c.toObject?.() || c,
          href: sanitizePublicPath(c.href, '/hostels'),
        }))
      }
      doc.whosGoingBrowseHref = sanitizePublicPath(doc.whosGoingBrowseHref, '/hostels')
      doc.closePrimaryHref = sanitizePublicPath(doc.closePrimaryHref, '/hostels')
      doc.closeSecondaryHref = sanitizePublicPath(doc.closeSecondaryHref, '/dostellers')
      await doc.save()
      return computeLandingPayload(doc)
    },
    updateHostelLandingBoard: async (_, { id, input }, context) => {
      requireLandingEditor(context)
      const allowed = [
        'knownFor',
        'featuredOnLanding',
        'boardPriority',
        'coverImageUrl',
        'tagline',
        'mapX',
        'mapY',
      ]
      const patch = {}
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(input, key) && input[key] !== undefined) {
          patch[key] = input[key]
        }
      }
      const hostel = await Hostel.findByIdAndUpdate(id, { $set: patch }, { new: true })
      if (!hostel) throw new Error('Hostel not found')
      const obj = hostel.toObject()
      obj.id = String(obj._id)
      return obj
    },
  },
}

module.exports = landingResolvers
