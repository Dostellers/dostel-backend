const { gql } = require('apollo-server-express');

const membershipTypeDefs = gql`
  enum MembershipSubscriptionStatus {
    active
    expired
    cancelled
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
  }

  extend type Mutation {
    createMembershipPlan(input: MembershipPlanInput!): MembershipPlan!
    updateMembershipPlan(id: ID!, input: MembershipPlanInput!): MembershipPlan!
    deleteMembershipPlan(id: ID!): Boolean!
  }

  input MembershipPlanInput {
    name: String!
    durationDays: Int!
    price: Float!
    perks: [String!]!
    isActive: Boolean
  }
`;

module.exports = membershipTypeDefs;
