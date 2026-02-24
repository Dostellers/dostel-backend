const { gql } = require('apollo-server-express');

const roleTypeDefs = gql`
  type Role {
    id: ID!
    name: String!
    description: String
    permissions: [Permission!]!
    createdAt: Date!
    updatedAt: Date
  }

  input RoleInput {
    name: String!
    description: String
    permissionIds: [ID!]
  }

  type Query {
    roles: [Role]
    role(id: ID!): Role
  }

  type Mutation {
    createRole(input: RoleInput!): Role!
    updateRole(id: ID!, input: RoleInput!): Role!
    deleteRole(id: ID!): Boolean!
  }
`;

module.exports = roleTypeDefs;
