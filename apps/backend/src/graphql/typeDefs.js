const { gql } = require('apollo-server').gql;

const typeDefs = gql`
  type Referral {
    code: ID!
    rewardAmount: Int!
    referredUsers: [User!]!
    createdAt: String!
    active: Boolean!
    expiredAt: String

    # Relationships
    referrer: User!
    referredBy: [User!]!
    customField: String
`

  type Query {
    getReferral(code: String!): Referral
    searchReferrals(redeemed: Boolean, activeOnly: Boolean): [Referral!]!
  }

  type Mutation {
    generateReferral(rewardAmount: Int!, expiryMonths: Int!): Referral
    useReferral(code: String!, forUserId: String!): Boolean
    applyReward(referralCode: String!, amount: Int!): Boolean
  }
`;

module.exports = { typeDefs };;