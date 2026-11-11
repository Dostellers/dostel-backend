const { gql } = require('apollo-server-express')

/**
 * GraphQL contract for the admin-editable guest landing page.
 * Callers: src/schema/index.js merges this; landingResolver implements it;
 * admin /landing + frontend lib/landing.ts query/mutate it.
 * No prior landing* typedefs exist (confirmed).
 * User: "make it dynamic and controlled via the admin panel… no static data."
 */
const landingTypeDefs = gql`
  type LandingStripFact {
    label: String!
    detail: String!
  }

  type LandingThesisCard {
    head: String!
    body: String!
    href: String!
    cta: String!
  }

  type LandingCircuit {
    id: String!
    name: String!
    color: String!
    stops: [String!]!
    legs: [String!]!
    nights: String
    blurb: String
    sortOrder: Int
  }

  type LandingBoardRow {
    what: String!
    where: String!
    when: String!
    status: String!
    live: Boolean!
    slug: String
    hostelId: ID
  }

  type LandingStripPhoto {
    url: String!
    alt: String
    slug: String
  }

  type LandingTraveller {
    name: String!
    initial: String!
    where: String!
    when: String!
    note: String
  }

  type LandingHostelNode {
    id: ID!
    slug: String!
    name: String!
    city: String
    knownFor: String
    pricePerNight: Float
    coverImageUrl: String
    mapX: Float
    mapY: Float
    featuredOnLanding: Boolean
  }

  type LandingDestination {
    label: String!
    city: String
    slug: String!
  }

  type LandingPage {
    id: ID!
    key: String!
    heroStamp: String!
    heroTitle: String!
    heroSubtitle: String!
    searchPlaceholder: String!
    boardTitle: String!
    boardCaption: String!
    boardColumns: [String!]!
    stripFacts: [LandingStripFact!]!
    useComputedStripFacts: Boolean!
    thesisTitle: String!
    thesisHighlight: String!
    thesisCards: [LandingThesisCard!]!
    whosGoingStamp: String!
    whosGoingTitle: String!
    whosGoingBody: String!
    whosGoingBrowseLabel: String!
    whosGoingBrowseHref: String!
    whosGoingPanelTitle: String!
    whosGoingEmptyMessage: String!
    whosGoingSideTitle: String!
    whosGoingSideBody: String!
    whosGoingTags: [String!]!
    circuitsStamp: String!
    circuitsTitle: String!
    circuitsBody: String!
    circuits: [LandingCircuit!]!
    closeTitle: String!
    closeBody: String!
    closePrimaryCta: String!
    closePrimaryHref: String!
    closeSecondaryCta: String!
    closeSecondaryHref: String!
    foundedYear: Int!
    isPublished: Boolean!
    boardRows: [LandingBoardRow!]!
    stripPhotos: [LandingStripPhoto!]!
    destinations: [LandingDestination!]!
    hostelNodes: [LandingHostelNode!]!
    travellers: [LandingTraveller!]!
    travellersThisWeek: Int!
    networkCount: Int!
    fromPrice: Float
    updatedAt: String
  }

  input LandingStripFactInput {
    label: String!
    detail: String!
  }

  input LandingThesisCardInput {
    head: String!
    body: String!
    href: String!
    cta: String!
  }

  input LandingCircuitInput {
    id: String!
    name: String!
    color: String
    stops: [String!]
    legs: [String!]
    nights: String
    blurb: String
    sortOrder: Int
  }

  input LandingPageInput {
    heroStamp: String
    heroTitle: String
    heroSubtitle: String
    searchPlaceholder: String
    boardTitle: String
    boardCaption: String
    boardColumns: [String!]
    stripFacts: [LandingStripFactInput!]
    useComputedStripFacts: Boolean
    thesisTitle: String
    thesisHighlight: String
    thesisCards: [LandingThesisCardInput!]
    whosGoingStamp: String
    whosGoingTitle: String
    whosGoingBody: String
    whosGoingBrowseLabel: String
    whosGoingBrowseHref: String
    whosGoingPanelTitle: String
    whosGoingEmptyMessage: String
    whosGoingSideTitle: String
    whosGoingSideBody: String
    whosGoingTags: [String!]
    circuitsStamp: String
    circuitsTitle: String
    circuitsBody: String
    circuits: [LandingCircuitInput!]
    closeTitle: String
    closeBody: String
    closePrimaryCta: String
    closePrimaryHref: String
    closeSecondaryCta: String
    closeSecondaryHref: String
    foundedYear: Int
    isPublished: Boolean
  }

  input LandingHostelBoardInput {
    knownFor: String
    featuredOnLanding: Boolean
    boardPriority: Int
    coverImageUrl: String
    tagline: String
    mapX: Float
    mapY: Float
  }

  extend type Query {
    landingPage: LandingPage!
  }

  extend type Mutation {
    updateLandingPage(input: LandingPageInput!): LandingPage!
    updateHostelLandingBoard(id: ID!, input: LandingHostelBoardInput!): Hostel!
  }
`

module.exports = landingTypeDefs
