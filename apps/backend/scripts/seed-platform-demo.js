/**
 * Idempotent demo seed for the guest landing + admin ops board.
 * Callers: run via `node scripts/seed-platform-demo.js` (ops / agent).
 * Writes: hostels, rooms, roomtypes, inventorytypes, inventorydays,
 * customers, bookings, landingpages.circuits.
 * Safe to re-run: upserts by slug / email / reference / date keys.
 * User: "we can have some realistic data ingested to populate the platform"
 */

require('dotenv').config()
const mongoose = require('mongoose')

const Hostel = require('../src/models/hostel')
const Room = require('../src/models/room')
const RoomType = require('../src/models/RoomType')
const InventoryType = require('../src/models/InventoryType')
const InventoryDay = require('../src/models/InventoryDay')
const Customer = require('../src/models/customer')
const Booking = require('../src/models/booking')
const LandingPage = require('../src/models/landingPage')
const User = require('../src/models/user')

const OWNER_EMAIL = 'admin@dostel.com'

const NETWORK = [
  {
    slug: 'dostel-vattakanal',
    name: 'Dostel Vattakanal',
    city: 'Vattakanal',
    state: 'Tamil Nadu',
    location: 'Vattakanal, Kodaikanal hills',
    knownFor: 'Shola forest',
    tagline: 'Fire, mist, and the oldest house',
    pricePerNight: 327,
    boardPriority: 100,
    mapX: 261,
    mapY: 661,
    inauguratedOn: new Date('1985-03-12'),
    coverImageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80',
    description: 'The first Dostel — shola forest, communal fire, and beds that face the valley.',
    legacySlugs: ['the-misty-mountains'],
    dormBeds: 24,
    privateRooms: 4,
  },
  {
    slug: 'dostel-goa-beach',
    name: 'Dostel Anjuna',
    city: 'Anjuna',
    state: 'Goa',
    location: 'Anjuna Beach Road, Goa',
    knownFor: 'Anjuna beach',
    tagline: 'Loud until you need quiet',
    pricePerNight: 449,
    boardPriority: 90,
    mapX: 133,
    mapY: 522,
    inauguratedOn: new Date('2012-11-01'),
    coverImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
    description: 'Beach road hostel with a late kitchen and early surf wake-ups.',
    legacySlugs: ['island-breeze'],
    dormBeds: 32,
    privateRooms: 6,
  },
  {
    slug: 'dostel-coorg-rainforest',
    name: 'Dostel Coorg',
    city: 'Coorg',
    state: 'Karnataka',
    location: 'Madikeri, Coorg',
    knownFor: 'Coffee country',
    tagline: 'Rainforest and filter coffee',
    pricePerNight: 399,
    boardPriority: 80,
    mapX: 201,
    mapY: 604,
    inauguratedOn: new Date('2016-08-20'),
    coverImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    description: 'Estate-edge beds, monsoon walks, and desks that face the trees.',
    legacySlugs: ['sunset-valley'],
    dormBeds: 20,
    privateRooms: 5,
  },
  {
    slug: 'dostel-dharamshala',
    name: 'Dostel Dharamshala',
    city: 'Dharamshala',
    state: 'Himachal Pradesh',
    location: 'McLeod Ganj, Dharamshala',
    knownFor: 'Himalaya',
    tagline: 'Facing the Dhauladhar',
    pricePerNight: 379,
    boardPriority: 70,
    mapX: 221,
    mapY: 89,
    inauguratedOn: new Date('2014-04-08'),
    coverImageUrl: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&q=80',
    description: 'Hill stay for trekkers and remote workers who want thin air and thick chai.',
    dormBeds: 28,
    privateRooms: 4,
  },
  {
    slug: 'dostel-delhi-airport',
    name: 'Dostel Delhi Airport',
    city: 'Delhi',
    state: 'Delhi',
    location: 'Mahipalpur, near IGI',
    knownFor: 'Near airport',
    tagline: 'Land, shower, sleep, leave',
    pricePerNight: 499,
    boardPriority: 60,
    mapX: 247,
    mapY: 183,
    inauguratedOn: new Date('2018-01-15'),
    coverImageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80',
    description: 'Transit hostel for early flights and late arrivals — lockers that actually lock.',
    dormBeds: 40,
    privateRooms: 8,
  },
  {
    slug: 'dostel-jaipur-mi-road',
    name: 'Dostel Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    location: 'MI Road, Jaipur',
    knownFor: 'Old city',
    tagline: 'Pink city, one network ID',
    pricePerNight: 359,
    boardPriority: 50,
    mapX: 203,
    mapY: 227,
    inauguratedOn: new Date('2015-10-02'),
    coverImageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80',
    description: 'Walkable to the bazaars, quiet enough to work through the afternoon heat.',
    dormBeds: 24,
    privateRooms: 5,
  },
  {
    slug: 'dostel-gokarna',
    name: 'Dostel Gokarna',
    city: 'Gokarna',
    state: 'Karnataka',
    location: 'Kudle Beach road, Gokarna',
    knownFor: 'Quiet coast',
    tagline: 'After Anjuna, the volume drops',
    pricePerNight: 329,
    boardPriority: 40,
    mapX: 153,
    mapY: 549,
    inauguratedOn: new Date('2017-12-11'),
    coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    description: 'Cliff-path hostel for people who outgrew the party but not the sea.',
    dormBeds: 18,
    privateRooms: 3,
  },
  {
    slug: 'dostel-bangalore-hsr',
    name: 'Dostel Bangalore HSR',
    city: 'Bangalore',
    state: 'Karnataka',
    location: 'HSR Layout, Bangalore',
    knownFor: 'Work + city',
    tagline: 'India hours, proper desks',
    pricePerNight: 549,
    boardPriority: 30,
    mapX: 266,
    mapY: 591,
    inauguratedOn: new Date('2019-06-01'),
    coverImageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
    description: 'Coliving-leaning hostel for product people between sprints and weekend buses out of the city.',
    dormBeds: 30,
    privateRooms: 10,
  },
]

const CIRCUITS = [
  {
    id: 'north',
    name: 'The North Loop',
    color: '#F54E4E',
    stops: ['dostel-delhi-airport', 'dostel-jaipur-mi-road', 'dostel-dharamshala'],
    legs: ['5h train', '11h night bus'],
    nights: '5–7 nights',
    blurb: 'Land in Delhi, walk Jaipur’s old city, end facing the Himalaya.',
    sortOrder: 0,
  },
  {
    id: 'coast',
    name: 'The Coast Run',
    color: '#FCCC00',
    stops: ['dostel-goa-beach', 'dostel-gokarna'],
    legs: ['4h bus'],
    nights: '4–6 nights',
    blurb: 'Anjuna until it’s too loud, then Gokarna until you’re ready to talk again.',
    sortOrder: 1,
  },
  {
    id: 'hills',
    name: 'The Hill Circuit',
    color: '#FFFFFF',
    stops: ['dostel-bangalore-hsr', 'dostel-coorg-rainforest', 'dostel-vattakanal'],
    legs: ['6h bus', '8h via Mysore'],
    nights: '6–9 nights',
    blurb: 'Work the city, then coffee country, then the shola forest.',
    sortOrder: 2,
  },
]

const GUESTS = [
  {
    fullName: 'Ananya Iyer',
    alias: 'Ananya',
    email: 'ananya.iyer.demo@dostel.test',
    phone: '+919876540001',
    note: 'Looking for a sunrise hike',
    hostelSlug: 'dostel-vattakanal',
    roomType: 'Mixed dorm 6',
    nightsFrom: 1,
    nights: 3,
  },
  {
    fullName: 'Rohit Mehra',
    alias: 'Rohit',
    email: 'rohit.mehra.demo@dostel.test',
    phone: '+919876540002',
    note: 'Remote week · quiet desk',
    hostelSlug: 'dostel-goa-beach',
    roomType: 'Private room',
    nightsFrom: 0,
    nights: 4,
  },
  {
    fullName: 'Maya Fernandes',
    alias: 'Maya',
    email: 'maya.fernandes.demo@dostel.test',
    phone: '+919876540003',
    note: 'First Dosteller stay',
    hostelSlug: 'dostel-jaipur-mi-road',
    roomType: 'Female dorm 4',
    nightsFrom: 2,
    nights: 3,
  },
  {
    fullName: 'Samir Khan',
    alias: 'Samir',
    email: 'samir.khan.demo@dostel.test',
    phone: '+919876540004',
    note: 'Teaching chai leaf reading Sat',
    hostelSlug: 'dostel-dharamshala',
    roomType: 'Mixed dorm 8',
    nightsFrom: -1,
    nights: 5,
  },
  {
    fullName: 'Keiko Tanaka',
    alias: 'Keiko',
    email: 'keiko.tanaka.demo@dostel.test',
    phone: '+919876540005',
    note: 'Coffee estate walk Sunday',
    hostelSlug: 'dostel-coorg-rainforest',
    roomType: 'Mixed dorm 6',
    nightsFrom: 1,
    nights: 4,
  },
  {
    fullName: 'Arjun Patel',
    alias: 'Arjun',
    email: 'arjun.patel.demo@dostel.test',
    phone: '+919876540006',
    note: 'Early flight Tue · need quiet',
    hostelSlug: 'dostel-delhi-airport',
    roomType: 'Private room',
    nightsFrom: 0,
    nights: 1,
  },
  {
    fullName: 'Sofia Alvarez',
    alias: 'Sofia',
    email: 'sofia.alvarez.demo@dostel.test',
    phone: '+919876540007',
    note: 'Kudle sunset + sketching',
    hostelSlug: 'dostel-gokarna',
    roomType: 'Mixed dorm 6',
    nightsFrom: 3,
    nights: 4,
  },
  {
    fullName: 'Dev Krishnan',
    alias: 'Dev',
    email: 'dev.krishnan.demo@dostel.test',
    phone: '+919876540008',
    note: 'Working India hours · standup 10:30',
    hostelSlug: 'dostel-bangalore-hsr',
    roomType: 'Private room',
    nightsFrom: -2,
    nights: 7,
  },
  {
    fullName: 'Priya Nair',
    alias: 'Priya',
    email: 'priya.nair.demo@dostel.test',
    phone: '+919876540009',
    note: null,
    hostelSlug: 'dostel-bangalore-hsr',
    roomType: 'Female dorm 4',
    nightsFrom: 1,
    nights: 3,
    optIn: false,
  },
  {
    fullName: 'Noah Berger',
    alias: 'Noah',
    email: 'noah.berger.demo@dostel.test',
    phone: '+919876540010',
    note: 'Board games after dinner',
    hostelSlug: 'dostel-goa-beach',
    roomType: 'Mixed dorm 8',
    nightsFrom: 2,
    nights: 5,
  },
]

function dayKey (d) {
  return d.toISOString().slice(0, 10)
}

function addDays (d, n) {
  const out = new Date(d)
  out.setHours(12, 0, 0, 0)
  out.setDate(out.getDate() + n)
  return out
}

async function ensureOwner () {
  let owner = await User.findOne({ email: OWNER_EMAIL })
  if (!owner) {
    owner = await User.create({
      username: 'admin',
      email: OWNER_EMAIL,
      password: 'ChangeMeNow!',
      firstName: 'Dostel',
      lastName: 'Admin',
      role: 'admin',
      isActive: true,
    })
  }
  return owner
}

async function upsertHostel (spec, ownerId) {
  let hostel = await Hostel.findOne({
    slug: { $in: [spec.slug, ...(spec.legacySlugs || [])] },
  })
  const payload = {
    slug: spec.slug,
    name: spec.name,
    city: spec.city,
    state: spec.state,
    country: 'India',
    location: spec.location,
    description: spec.description,
    shortDescription: spec.tagline,
    tagline: spec.tagline,
    knownFor: spec.knownFor,
    pricePerNight: spec.pricePerNight,
    boardPriority: spec.boardPriority,
    mapX: spec.mapX,
    mapY: spec.mapY,
    inauguratedOn: spec.inauguratedOn,
    coverImageUrl: spec.coverImageUrl,
    featuredOnLanding: true,
    featured: true,
    isActive: true,
    isVerified: true,
    owner: ownerId,
  }
  if (!hostel) {
    hostel = await Hostel.create(payload)
    console.log('  + hostel', spec.slug)
  } else {
    Object.assign(hostel, payload)
    await hostel.save()
    console.log('  ~ hostel', spec.slug)
  }
  // Hostel pre-save rewrites slug from name — pin the brand slug explicitly.
  await Hostel.collection.updateOne({ _id: hostel._id }, { $set: { slug: spec.slug, name: spec.name } })
  hostel.slug = spec.slug
  hostel.name = spec.name
  return hostel
}

async function ensureInventory (hostel, spec) {
  const dormType = await RoomType.findOneAndUpdate(
    { hostel: hostel._id, name: 'Mixed dorm bed' },
    {
      hostel: hostel._id,
      name: 'Mixed dorm bed',
      category: 'dorm',
      capacity: 1,
      basePrice: spec.pricePerNight,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  const privateType = await RoomType.findOneAndUpdate(
    { hostel: hostel._id, name: 'Private room' },
    {
      hostel: hostel._id,
      name: 'Private room',
      category: 'private',
      capacity: 2,
      basePrice: Math.round(spec.pricePerNight * 2.6),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  const existingRooms = await Room.find({ hostel: hostel._id })
  const roomIds = existingRooms.map((r) => r._id)

  // Top up dorm-style rooms if thin
  const targetDormRooms = Math.max(4, Math.ceil(spec.dormBeds / 6))
  const targetPrivate = Math.max(2, spec.privateRooms)
  let dormCount = existingRooms.filter((r) => (r.capacity || 0) >= 4).length
  let privateCount = existingRooms.filter((r) => (r.capacity || 0) <= 2).length
  let nextNum = existingRooms.length + 1

  while (dormCount < targetDormRooms) {
    const room = await Room.create({
      hostel: hostel._id,
      number: String(nextNum++),
      roomType: dormType._id,
      type: 'dorm',
      capacity: 6,
      maxCapacity: 6,
      price: spec.pricePerNight,
      status: 'available',
      description: 'Mixed dorm · lockers · curtains',
      features: ['Locker', 'Reading light', 'Power socket'],
      bedType: 'bunk',
    })
    roomIds.push(room._id)
    dormCount += 1
  }
  while (privateCount < targetPrivate) {
    const room = await Room.create({
      hostel: hostel._id,
      number: String(nextNum++),
      roomType: privateType._id,
      type: 'private',
      capacity: 2,
      maxCapacity: 2,
      price: Math.round(spec.pricePerNight * 2.6),
      status: 'available',
      description: 'Private room with attached bath',
      features: ['AC', 'Attached bath', 'WiFi'],
      bedType: 'double',
    })
    roomIds.push(room._id)
    privateCount += 1
  }

  hostel.rooms = [...new Set(roomIds.map(String))].map((id) => mongoose.Types.ObjectId(id))
  await hostel.save()

  const dormInv = await InventoryType.findOneAndUpdate(
    { hostelId: hostel._id, code: 'DORM_BED' },
    {
      hostelId: hostel._id,
      code: 'DORM_BED',
      name: 'Dorm bed',
      mode: 'bed',
      capacityPerUnit: 1,
      totalUnits: spec.dormBeds,
      physicalRoomIds: roomIds.slice(0, targetDormRooms),
      active: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  const privateInv = await InventoryType.findOneAndUpdate(
    { hostelId: hostel._id, code: 'PRIVATE' },
    {
      hostelId: hostel._id,
      code: 'PRIVATE',
      name: 'Private room',
      mode: 'private_room',
      capacityPerUnit: 2,
      totalUnits: targetPrivate,
      physicalRoomIds: roomIds.slice(-targetPrivate),
      active: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  // 14 days of inventory from yesterday
  const start = addDays(new Date(), -1)
  for (let i = 0; i < 14; i++) {
    const date = dayKey(addDays(start, i))
    const fill = 0.35 + ((hostel.boardPriority || 0) % 40) / 100 + (i % 3) * 0.08
    const dormSold = Math.min(spec.dormBeds, Math.floor(spec.dormBeds * Math.min(0.92, fill)))
    const privSold = Math.min(targetPrivate, Math.floor(targetPrivate * Math.min(0.85, fill * 0.7)))
    await InventoryDay.findOneAndUpdate(
      { inventoryTypeId: dormInv._id, date },
      {
        hostelId: hostel._id,
        inventoryTypeId: dormInv._id,
        date,
        total: spec.dormBeds,
        sold: dormSold,
        held: Math.max(0, Math.floor(spec.dormBeds * 0.05)),
        blocked: i === 3 ? 1 : 0,
        version: 1,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    await InventoryDay.findOneAndUpdate(
      { inventoryTypeId: privateInv._id, date },
      {
        hostelId: hostel._id,
        inventoryTypeId: privateInv._id,
        date,
        total: targetPrivate,
        sold: privSold,
        held: 0,
        blocked: 0,
        version: 1,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  }
}

async function upsertGuestBooking (guest, hostelBySlug) {
  const hostel = hostelBySlug[guest.hostelSlug]
  if (!hostel) throw new Error(`Missing hostel ${guest.hostelSlug}`)

  let customer = await Customer.findOne({ email: guest.email })
  const optIn = guest.optIn !== false
  const consents = [
    {
      purpose: 'network_terms',
      granted: true,
      capturedAt: new Date(),
      source: 'booking',
    },
  ]
  if (optIn) {
    consents.push({
      purpose: 'guest_graph_crossings',
      granted: true,
      capturedAt: new Date(),
      source: 'booking',
    })
  }
  const guestFacts = guest.note
    ? [
        {
          text: guest.note,
          category: 'interest',
          capturedBy: 'seed-platform-demo',
          capturedAt: new Date(),
          source: 'admin',
          confidence: 'high',
          reviewStatus: 'approved',
          visibility: 'guest_visible',
          expiresAt: addDays(new Date(), 21),
        },
      ]
    : []

  if (!customer) {
    customer = await Customer.create({
      fullName: guest.fullName,
      alias: guest.alias,
      email: guest.email,
      phone: guest.phone,
      phoneNormalized: guest.phone,
      accountStatus: 'active',
      acquisitionSource: 'admin',
      acquisitionCapturedAt: new Date(),
      consents,
      guestFacts,
      loyaltyPoints: 120,
      dostellerTier: 'Explorer',
    })
    console.log('  + guest', guest.alias)
  } else {
    customer.fullName = guest.fullName
    customer.alias = guest.alias
    customer.phone = guest.phone
    customer.phoneNormalized = guest.phone
    customer.consents = consents
    if (guestFacts.length) customer.guestFacts = guestFacts
    await customer.save()
    console.log('  ~ guest', guest.alias)
  }

  const checkIn = addDays(new Date(), guest.nightsFrom)
  const checkOut = addDays(checkIn, guest.nights)
  const nights = guest.nights
  const nightly = hostel.pricePerNight || 400
  const totalAmount = Math.round(nightly * nights * (guest.roomType.toLowerCase().includes('private') ? 2.4 : 1))
  const deposit = Math.round(totalAmount * 0.1)
  const reference = `DEMO-${guest.alias.toUpperCase()}-${guest.hostelSlug.slice(0, 12)}`

  let booking = await Booking.findOne({ reference })
  const payload = {
    reference,
    customer: customer._id,
    hostel: hostel._id,
    roomType: guest.roomType,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    guests: 1,
    totalAmount,
    payment: {
      status: 'Confirmed',
      method: 'UPI',
      transactionId: `txn_${reference.toLowerCase()}`,
      amount: deposit,
      documentType: 'PaymentNote',
    },
    sequenceStatus: guest.nightsFrom <= 0 ? 'CheckedIn' : 'Confirmed',
    depositPercentage: 10,
    depositRequired: deposit,
    amountPaid: deposit,
    balanceDue: totalAmount - deposit,
    rateType: 'FREE_CANCELLATION',
    balanceCollection: 'AT_PROPERTY',
    payAtProperty: totalAmount - deposit,
    refundable: true,
    specialRequests: guest.note || undefined,
    source: { name: 'seed-platform-demo', referenceId: reference },
  }

  if (!booking) {
    booking = await Booking.create(payload)
    console.log('  + booking', reference)
  } else {
    Object.assign(booking, payload)
    await booking.save()
    console.log('  ~ booking', reference)
  }

  if (!Array.isArray(customer.bookings)) customer.bookings = []
  if (!customer.bookings.find((id) => String(id) === String(booking._id))) {
    customer.bookings.push(booking._id)
    await customer.save()
  }
}

async function updateLanding (hostelCount) {
  const doc = await LandingPage.findOneAndUpdate(
    { key: 'home' },
    {
      $set: {
        key: 'home',
        circuits: CIRCUITS,
        circuitsBody:
          'Nobody backpacks one address. Three circuits link the houses — and because it’s one network, the next hostel already knows your name when you walk in.',
        boardCaption: `${hostelCount} Dostel properties across India — nightly rate and availability`,
        useComputedStripFacts: true,
        isPublished: true,
        foundedYear: 1985,
      },
      $setOnInsert: {
        heroTitle: 'Meet your people.',
        thesisCards: [],
      },
    },
    { upsert: true, new: true }
  )
  console.log('  ~ landing', doc.key, 'circuits', (doc.circuits || []).length)
}

async function main () {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dostel'
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  console.log('Connected')

  const owner = await ensureOwner()
  console.log('Owner', owner.email)

  const hostelBySlug = {}
  for (const spec of NETWORK) {
    const hostel = await upsertHostel(spec, owner._id)
    await ensureInventory(hostel, spec)
    hostelBySlug[spec.slug] = hostel
  }

  console.log('Guests + bookings')
  for (const guest of GUESTS) {
    await upsertGuestBooking(guest, hostelBySlug)
  }

  await updateLanding(NETWORK.length)

  const summary = {
    hostels: await Hostel.countDocuments({ isActive: true }),
    rooms: await Room.countDocuments(),
    customers: await Customer.countDocuments(),
    bookings: await Booking.countDocuments(),
    inventoryDays: await InventoryDay.countDocuments(),
  }
  console.log('Done', summary)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
