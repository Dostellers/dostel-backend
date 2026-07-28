// src/schema/transactionTypeDefs.js
const { gql } = require('apollo-server-express');

const transactionTypeDefs = gql`
  type Transaction {
    id: ID!
    transactionId: String!
    user: User!
    booking: Booking
    amount: Float!
    currency: String
    paymentMethod: String!
    status: String!
    description: String
    date: Date!
    createdAt: Date!
    updatedAt: Date
  }

  input TransactionInput {
    transactionId: String!
    user: ID!
    booking: ID
    amount: Float!
    currency: String
    paymentMethod: String!
    status: String
    description: String
  }

  extend type Query {
    transactions: [Transaction!]!
    transaction(id: ID!): Transaction
    transactionsByStatus(status: String!): [Transaction!]!
    transactionsByUser(userId: ID!): [Transaction!]!
  }

  extend type Mutation {
    createTransaction(input: TransactionInput!): Transaction!
    updateTransaction(id: ID!, input: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;

module.exports = transactionTypeDefs;
