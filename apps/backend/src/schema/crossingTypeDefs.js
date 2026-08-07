const { gql } = require('apollo-server-express');

/**
 * Crossings (DOS-505) + private labels (DOS-506).
 *
 * Deliberate absences, per spec:
 * - No field ever exposes the counterpart's consent state — only `mutual`.
 *   A decline is indistinguishable from silence, forever.
 * - `counterpartName` is null until BOTH sides revealed, and even then it is
 *   a first name only.
 * - `myLabel` is the viewer's own nickname for the counterpart; the
 *   counterpart's labels never appear in anyone else's payload.
 */
module.exports = gql`
  enum CrossingTier {
    ROOM
    HOSTEL
  }

  enum CrossingConsentStatus {
    PENDING
    REVEALED
    DECLINED
  }

  type MyCrossing {
    id: ID!
    tier: CrossingTier!
    nights: Int!
    overlapStart: String!
    overlapEnd: String!
    hostelName: String!
    hostelCity: String
    "Your side only. The other side's status is never exposed."
    myStatus: CrossingConsentStatus!
    "True only when both sides chose to be revealed."
    mutual: Boolean!
    "First name, and only once mutual."
    counterpartName: String
    "Your private nickname for them (DOS-506). Nobody else ever sees it."
    myLabel: String
  }

  extend type Query {
    "Crossings the signed-in guest may see. Severed edges are gone for good."
    myCrossings: [MyCrossing!]!
  }

  extend type Mutation {
    """
    Answer a crossing. accept=true reveals your side; accept=false declines.
    Declining is silent: the other guest simply never sees it become mutual.
    """
    respondToCrossing(crossingId: ID!, accept: Boolean!): MyCrossing!

    "Hide this crossing from both sides permanently and purge its labels."
    severCrossing(crossingId: ID!): Boolean!

    "Set your private nickname for the person on this crossing (max 60 chars)."
    setCrossingLabel(crossingId: ID!, label: String!): MyCrossing!

    removeCrossingLabel(crossingId: ID!): MyCrossing!

    """
    Recompute crossings for a booking (staff/ops). Consent-gated at
    computation: guests without guest_graph_crossings consent are excluded
    from the query itself.
    """
    computeCrossingsForBooking(reference: String!): Int!
  }
`;
