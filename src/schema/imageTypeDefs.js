// src/schema/imageTypeDefs.js
const { gql } = require('apollo-server-express');

const imageTypeDefs = gql`
  type Image {
    id: ID!
    url: String
    altText: String
    caption: String
    type: String
  }

  input ImageInput {
    url: String
    altText: String
    caption: String
    type: String
  }

  extend type Query {
    images: [Image!]!
    image(id: ID!): Image
    imagesByType(type: String!): [Image!]!
  }

  extend type Mutation {
    createImage(input: ImageInput!): Image!
    updateImage(id: ID!, input: ImageInput!): Image!
    deleteImage(id: ID!): Boolean!
  }
`;

module.exports = imageTypeDefs;
