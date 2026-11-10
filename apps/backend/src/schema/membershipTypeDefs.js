const { gql } = require('apollo-server-express');

const membershipTypeDefs = gql`
  enum MembershipSubscriptionStatus {
    active
    expired
    cancelled
  }

  enum MembershipTier {
    Bronze
    Silver
    Gold
    Platinum
  }

  type MembershipPlan {
    id: ID!
    name: String!
    durationDays: Int!
    price: Float!
    perks: [String!]!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Membership {
    id: ID!
    user: User!
    membershipPlan: MembershipPlan
    points: Int!
    tier: MembershipTier!
    referralCode: String
    referredBy: User
    referralEarnings: Float!
    totalBookings: Int!
    totalSpent: Float!
    isActive: Boolean!
    membershipStartDate: Date!
    membershipEndDate: Date
    createdAt: Date!
    updatedAt: Date!
  }

  type MembershipSubscription {
    id: ID!
    customer: Customer!
    plan: MembershipPlan!
    status: MembershipSubscriptionStatus!
    startDate: Date!
    endDate: Date!
    autoRenew: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  extend type Query {
    membershipPlans: [MembershipPlan!]!
    membershipPlan(id: ID!): MembershipPlan
    membership(id: ID!): Membership
    memberships: [Membership!]!
  }

  extend type Mutation {
    createMembershipPlan(input: MembershipPlanInput!): MembershipPlan!
    updateMembershipPlan(id: ID!, input: MembershipPlanInput!): MembershipPlan!
    deleteMembershipPlan(id: ID!): Boolean!
    createMembership(input: MembershipInput!): Membership!
    updateMembership(id: ID!, input: MembershipInput!): Membership!
    deleteMembership(id: ID!): Boolean!
  }

  input MembershipPlanInput {
    name: String!
    durationDays: Int!
    price: Float!
    perks: [String!]!
    isActive: Boolean
  }

  input MembershipInput {
    user: ID!
    membershipPlan: ID
    points: Int
    tier: MembershipTier
    referralCode: String
    referredBy: ID
    referralEarnings: Float
    totalBookings: Int
    totalSpent: Float
    isActive: Boolean
    membershipStartDate: Date
    membershipEndDate: Date
  }
`;

module.exports = membershipTypeDefs;
