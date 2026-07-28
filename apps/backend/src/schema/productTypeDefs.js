// src/schema/productTypeDefs.js
const { gql } = require('apollo-server-express');

const productTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    type: String!
    price: Float!
    applicableTaxes: [TaxRate]
    availableQuantity: Int
    isActive: Boolean
    createdAt: Date!
    updatedAt: Date
  }

  input ProductInput {
    name: String!
    description: String
    type: String!
    price: Float!
    applicableTaxes: [ID]
    availableQuantity: Int
    isActive: Boolean
  }

  extend type Query {
    products: [Product!]!
    product(id: ID!): Product
    activeProducts: [Product!]!
    productsByType(type: String!): [Product!]!
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    toggleProductStatus(id: ID!): Product!
  }
`;

module.exports = productTypeDefs;
