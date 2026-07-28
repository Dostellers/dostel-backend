// src/schema/billTypeDefs.js
const { gql } = require('apollo-server-express');

const billTypeDefs = gql`
  type BillProductReference {
    product: Product!
    quantity: Int!
    total: Float!
  }

  type Bill {
    id: ID!
    customer: Customer!
    booking: Booking
    billItems: [BillProductReference!]!
    subtotal: Float!
    tax: Float!
    discount: Float!
    totalAmount: Float!
    paymentMethod: String!
    transactionId: String
    status: String!
    dateIssued: Date!
  }

  input BillProductReferenceInput {
    productId: ID!
    quantity: Int!
    total: Float!
  }

  input BillInput {
    customer: ID!
    booking: ID
    billItems: [BillProductReferenceInput!]!
    subtotal: Float!
    tax: Float
    discount: Float
    totalAmount: Float!
    paymentMethod: String!
    transactionId: String
    status: String
    dateIssued: Date
  }

  extend type Query {
    bills: [Bill!]!
    bill(id: ID!): Bill
  }

  extend type Mutation {
    createBill(input: BillInput!): Bill!
    updateBill(id: ID!, input: BillInput!): Bill!
    deleteBill(id: ID!): Boolean!
    addProductToBill(billId: ID!, productId: ID!, quantity: Int!, total: Float!): Bill!
    removeProductFromBill(billId: ID!, productId: ID!): Bill!
  }
`;

module.exports = billTypeDefs;
