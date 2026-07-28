// src/schema/permissionTypeDefs.js
const { gql } = require('apollo-server-express');

const permissionTypeDefs = gql`
  type Permission {
    id: ID!
    name: String!
    category: String
    level: String
    description: String
    createdBy: User
    lastUpdatedBy: User
    # createdAt: Date!
    # updatedAt: Date
  }

  input PermissionInput {
    name: String!
    category: String
    level: String
    description: String
  }

  extend type Query {
    permissions: [Permission!]!
    permission(id: ID!): Permission
    permissionsByCategory(category: String!): [Permission!]!
    permissionsByLevel(level: String!): [Permission!]!
  }

  extend type Mutation {
    createPermission(input: PermissionInput!): Permission!
    updatePermission(id: ID!, input: PermissionInput!): Permission!
    deletePermission(id: ID!): Boolean!
  }
`;

module.exports = permissionTypeDefs;
