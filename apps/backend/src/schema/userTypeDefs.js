// userTypeDefs.js
const { gql } = require('apollo-server-express');
const { GraphQLDate } = require('graphql-scalars');

const userTypeDefs = gql`
  scalar Date  # Define the Date scalar type
  
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    dateOfBirth: Date
    profileImage: String
    department: Department
    roles: [Role!]!
    isActive: Boolean
    createdAt: Date!
    updatedAt: Date
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    dateOfBirth: Date
    profileImage: String
    departmentId: ID
    roleIds: [ID!]!
    isActive: Boolean
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    dateOfBirth: Date
  }

  type Query { 
    users: [User]
    user(id: ID!): User
    me: User
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;

module.exports = userTypeDefs;
