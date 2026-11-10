const { gql } = require('apollo-server-express');

const membershipTypeDefs = gql`
    enum MembershipSubscriptionStatus {
        active
        expired
        cancelled
    }
    
    enum MembershipTier {
        explorer
        contributor
        dosteller
        elder
    }

    type MembershipPlan {
        id: ID!
        name: String!
        durationDays: Int!
        price: Float!
        perks: [String!]!
        isActive: Boolean!
        createdAt: String!
        updatedAt: String!
    }

    type MembershipSubscription {
        id: ID!
        customer: Customer!
        plan: MembershipPlan!
        status: MembershipSubscriptionStatus!
        startDate: String!
        endDate: String!
        autoRenew: Boolean!
        createdAt: String!
        updatedAt: String!
    }
    
    type MembershipInfo {
        tier: MembershipTier!
        points: Int!
        level: Int!
        benefits: [String!]!
        nextLevelName: String
        nextLevelPoints: Int
        pointsToNextLevel: Int
    }

    type Query {
        membershipPlans: [MembershipPlan!]!
        membershipPlan(id: ID!): MembershipPlan
        membershipSubscription(customerId: ID!): MembershipSubscription
        membershipInfo(customerId: ID!): MembershipInfo
    }

    input MembershipPlanInput {
        name: String!
        durationDays: Int!
        price: Float!
        perks: [String!]!
        isActive: Boolean
    }
    
    input CreateMembershipSubscriptionInput {
        customerId: ID!
        planId: ID!
        paymentMethod: String!
    }

    type Mutation {
        createMembershipPlan(input: MembershipPlanInput!): MembershipPlan!
        updateMembershipPlan(id: ID!, input: MembershipPlanInput!): MembershipPlan!
        deleteMembershipPlan(id: ID!): Boolean!
        createMembershipSubscription(input: CreateMembershipSubscriptionInput!): MembershipSubscription!
    }
`;

module.exports = membershipTypeDefs;