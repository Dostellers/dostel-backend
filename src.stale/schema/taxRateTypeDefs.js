// src/schema/taxRateTypeDefs.js
const { gql } = require('apollo-server-express');

const taxRateTypeDefs = gql`
  type TaxRate {
    id: ID!
    name: String!
    code: String!
    description: String
    rate: Float!
    jurisdiction: String!
    type: String!
    applicableTo: [String!]!
    effectiveFrom: Date!
    effectiveTo: Date
    isActive: Boolean!
    notes: String
    createdAt: Date!
    updatedAt: Date
  }

  input TaxRateInput {
    name: String!
    code: String!
    description: String
    rate: Float!
    jurisdiction: String!
    type: String
    applicableTo: [String!]
    effectiveFrom: Date
    effectiveTo: Date
    isActive: Boolean
    notes: String
  }

  extend type Query {
    taxRates: [TaxRate!]!
    taxRate(id: ID!): TaxRate
    taxRatesByType(type: String!): [TaxRate!]!
  }

  extend type Mutation {
    createTaxRate(input: TaxRateInput!): TaxRate!
    updateTaxRate(id: ID!, input: TaxRateInput!): TaxRate!
    deleteTaxRate(id: ID!): Boolean!
    activateTaxRate(id: ID!): TaxRate!
    deactivateTaxRate(id: ID!): TaxRate!
  }
`;

module.exports = taxRateTypeDefs;
