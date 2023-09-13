// src/schema/amenityTypeDefs.js
const { gql } = require('apollo-server-express');

const amenityTypeDefs = gql`
  type Amenity {
    id: ID!
    name: String
    iconUrl: String
    description: String
    status: Boolean
  }

  input AmenityInput {
    name: String
    iconUrl: String
    description: String
    status: Boolean
  }

  extend type Query {
    amenities: [Amenity!]!
    amenity(id: ID!): Amenity
  }

  extend type Mutation {
    createAmenity(input: AmenityInput!): Amenity!
    updateAmenity(id: ID!, input: AmenityInput!): Amenity!
    deleteAmenity(id: ID!): Boolean!
  }
`;

module.exports = amenityTypeDefs;
