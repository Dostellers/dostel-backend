// src/schema/hostelTypeDefs.js
const { gql } = require('apollo-server-express');

const hostelTypeDefs = gql`
  """
  Measured uptime for one thing over one window (DOS-503).

  \`uptimePct\` is a share of *observed* time, not of the window — when the
  property loses power the sensor usually loses power too, so a gap means
  "unknown", never "up". Always read it alongside \`coveragePct\`: 100% uptime at
  40% coverage is the sensor's silence, not a claim. \`publishable\` is false when
  coverage is too low to stand behind.
  """
  type ReliabilityUptime {
    upMinutes: Float
    downMinutes: Float
    degradedMinutes: Float
    unknownMinutes: Float
    uptimePct: Float
    coveragePct: Float
    publishable: Boolean!
  }

  """
  Measured connectivity. Reports the median and the worst decile rather than a
  mean — someone deciding whether they can work here cares about the bad evening,
  which a mean is very good at hiding.
  """
  type ReliabilityWifi {
    samples: Int!
    medianDownloadMbps: Float
    worstDecileDownloadMbps: Float
    avgPacketLossPct: Float
  }

  type ReliabilityWindow {
    power: ReliabilityUptime!
    hotWater: ReliabilityUptime!
    wifi: ReliabilityWifi!
  }

  """
  Hot water availability at a given hour, because "is there hot water at 6am" is
  the actual question and a daily average a hot afternoon carries does not answer it.
  """
  type ReliabilityHourly {
    hour: Int!
    observations: Int!
    availabilityPct: Float
  }

  type HostelReliability {
    computedAt: String!
    measurementWindows: [String!]!
    minPublishableCoveragePct: Float!
    maxGapMinutes: Int!
    last7d: ReliabilityWindow!
    last30d: ReliabilityWindow!
    last90d: ReliabilityWindow!
    hotWaterByHour: [ReliabilityHourly!]!
    totalObservations: Int!
  }

  type Hostel {
    id: ID!
    slug: String!
    name: String
    city: String
    tagline: String
    metaDesc: String
    shortDesc: String
    description: HostelDescription
    inauguratedOn: Date
    basePrice: Float
    totalRooms: Int
    totalBeds: Int
    contact: HostelContact
    location: HostelLocation
    timing: HostelTiming
    seo: HostelSEO
    thingsToKnow: [String]
    gmapUrl: String
    url: String
    images: HostelImages
    otherInfo: [HostelOtherInfo]
    amenities: [Amenity]
    policies: HostelPolicies
    faqs: [FAQ]
    blogs: [Blog]
    rooms: [Room!]!
    """
    The measured reliability record (DOS-503). Computed from raw telemetry on
    request, so it is always current. Null when nothing has ever been reported
    for this property — an absent record reads as absent, not as perfect.
    """
    reliability: HostelReliability
    createdAt: Date!
    updatedAt: Date
  }

  type HostelDescription {
    heading: String
    content: String
  }

  type HostelContact {
    phone: String
    email: String
  }

  type HostelLocation {
    latitude: Float
    longitude: Float
    url: String
    address: HostelAddress
  }

  type HostelAddress {
    line1: String
    line2: String
    city: String
    state: String
    country: String
    pincode: String
  }

  type HostelTiming {
    checkin: String
    checkout: String
    guestVisit: String
    cafe: String
    reception: String
    other: String
  }

  type HostelSEO {
    title: String
    description: String
    keywords: String
  }

  type HostelImages {
    hero: Image
    main: Image
    thumbnail: Image
    others: [Image]
  }

  type HostelOtherInfo {
    heading: String
    content: String
    iconUrl: String
  }

  type HostelPolicies {
    general: [String]
    pet: [String]
    covid: [String]
  }

  input HostelInput {
    name: String
    tagline: String
    metaDesc: String
    shortDesc: String
    description: HostelDescriptionInput
    inauguratedOn: Date
    basePrice: Float
    totalRooms: Int
    totalBeds: Int
    contact: HostelContactInput
    location: HostelLocationInput
    timing: HostelTimingInput
    seo: HostelSEOInput
    thingsToKnow: [String]
    gmapUrl: String
    url: String
    images: HostelImagesInput
    otherInfo: [HostelOtherInfoInput]
    amenities: [ID]
    policies: HostelPoliciesInput
    faqs: [ID]
    blogs: [ID]
  }

  input HostelDescriptionInput {
    heading: String
    content: String
  }

  input HostelContactInput {
    phone: String
    email: String
  }

  input HostelLocationInput {
    latitude: Float
    longitude: Float
    url: String
    address: HostelAddressInput
  }

  input HostelAddressInput {
    line1: String
    line2: String
    city: String
    state: String
    country: String
    pincode: String
  }

  input HostelTimingInput {
    checkin: String
    checkout: String
    guestVisit: String
    cafe: String
    reception: String
    other: String
  }

  input HostelSEOInput {
    title: String
    description: String
    keywords: String
  }

  input HostelImagesInput {
    hero: ID
    main: ID
    thumbnail: ID
    others: [ID]
  }

  input HostelOtherInfoInput {
    heading: String
    content: String
    iconUrl: String
  }

  input HostelPoliciesInput {
    general: [String]
    pet: [String]
    covid: [String]
  }

  extend type Query {
    hostels: [Hostel!]!
    hostel(id: ID!): Hostel
    hostelsByAmenity(amenityId: ID!): [Hostel!]!
    hostelsByLocation(city: String!): [Hostel!]!
  }

  extend type Mutation {
    createHostel(input: HostelInput!): Hostel!
    updateHostel(id: ID!, input: HostelInput!): Hostel!
    deleteHostel(id: ID!): Boolean!
  }
`;

module.exports = hostelTypeDefs;
