// src/schema/faqTypeDefs.js
const { gql } = require('apollo-server-express');

const faqTypeDefs = gql`
  type FAQ {
    id: ID!
    question: String!
    answer: String!
    category: String!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date
  }

  input FAQInput {
    question: String!
    answer: String!
    category: String
    isActive: Boolean
  }

  extend type Query {
    faqs: [FAQ!]!
    faq(id: ID!): FAQ
    activeFaqs: [FAQ!]!
    faqsByCategory(category: String!): [FAQ!]!
  }

  extend type Mutation {
    createFaq(input: FAQInput!): FAQ!
    updateFaq(id: ID!, input: FAQInput!): FAQ!
    deleteFaq(id: ID!): Boolean!
    toggleFaqStatus(id: ID!): FAQ!
  }
`;

module.exports = faqTypeDefs;
