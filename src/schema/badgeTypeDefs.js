// src/schema/badgeTypeDefs.js
const { gql } = require('apollo-server-express');

const badgeTypeDefs = gql`
  type Badge {
    id: ID!
    name: String!
    description: String
    imageUrl: String
    criteria: String
  }

  input BadgeInput {
    name: String!
    description: String
    imageUrl: String
    criteria: String
  }

  extend type Query {
    badges: [Badge!]!
    badge(id: ID!): Badge
  }

  extend type Mutation {
    createBadge(input: BadgeInput!): Badge!
    updateBadge(id: ID!, input: BadgeInput!): Badge!
    deleteBadge(id: ID!): Boolean!
  }
`;

module.exports = badgeTypeDefs;
