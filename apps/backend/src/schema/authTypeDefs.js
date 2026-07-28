const { gql } = require('apollo-server-express');

const authTypeDefs = gql`
  type AuthPayload {
    token: String!
    customer: Customer!
  }

  input SignupInput {
    fullName: String!
    email: String!
    phone: String!
    password: String!
    dateOfBirth: Date
    referralCode: String
  }

  extend type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }

  extend type Query {
    me: Customer
  }
`;

module.exports = authTypeDefs;
