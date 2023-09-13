// src/schema/reviewTypeDefs.js
const { gql } = require('apollo-server-express');

const reviewTypeDefs = gql`
  type Review {
    id: ID!
    customer: Customer
    hostel: Hostel!
    rating: Float!
    comments: String
    response: String
    dateVisited: Date
    photos: [String]
    verified: Boolean
    tags: [String]
    source: String
    externalLink: String
    externalReviewerName: String
    createdAt: Date!
    updatedAt: Date
  }

  input ReviewInput {
    customer: ID
    hostel: ID!
    rating: Float!
    comments: String
    response: String
    dateVisited: Date
    photos: [String]
    verified: Boolean
    tags: [String]
    source: String
    externalLink: String
    externalReviewerName: String
  }

  extend type Query {
    reviews: [Review!]!
    review(id: ID!): Review
    reviewsByHostel(hostelId: ID!): [Review!]!
    reviewsBySource(source: String!): [Review!]!
  }

  extend type Mutation {
    createReview(input: ReviewInput!): Review!
    updateReview(id: ID!, input: ReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
    verifyReview(id: ID!): Review!
  }
`;

module.exports = reviewTypeDefs;
