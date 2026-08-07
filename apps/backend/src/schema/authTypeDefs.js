const { gql } = require('apollo-server-express');

const authTypeDefs = gql`
  type AuthPayload {
    token: String!
    user: User!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  extend type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }

  extend type Query {
    me: User
  }
`;

module.exports = authTypeDefs;
