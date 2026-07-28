// src/schema/roomTypeDefs.js
const { gql } = require('apollo-server-express');

const roomTypeDefs = gql`
  type Room {
    id: ID!
    type: String!
    capacity: Int!
    maxCapacity: Int
    price: Float!
    msp: Float
    additionalGuestPrice: Float
    description: String
    features: [String]
    amenities: [Amenity!]!
    accessibilityFeatures: [String]
    view: String
    size: Float
    bedType: String
    petPolicy: String
    restrictions: [String]
    images: [Image!]!
    reservations: [RoomReservation!]!
    hostel: Hostel!
    createdAt: Date!
    updatedAt: Date
  }

  type RoomReservation {
    startDate: Date!
    endDate: Date!
    customer: Customer
    bookingReference: String!
  }

  input RoomInput {
    type: String!
    capacity: Int!
    maxCapacity: Int
    price: Float!
    msp: Float
    additionalGuestPrice: Float
    description: String
    features: [String]
    amenities: [ID!]!
    accessibilityFeatures: [String]
    view: String
    size: Float
    bedType: String
    petPolicy: String
    restrictions: [String]
    images: [ID!]!
    hostel: ID!
  }

  input RoomReservationInput {
    startDate: Date!
    endDate: Date!
    customer: ID
    bookingReference: String!
  }

  extend type Query {
    rooms: [Room!]!
    room(id: ID!): Room
    roomsByHostel(hostelId: ID!): [Room!]!
    roomsByType(type: String!): [Room!]!
  }

  extend type Mutation {
    createRoom(input: RoomInput!): Room!
    updateRoom(id: ID!, input: RoomInput!): Room!
    deleteRoom(id: ID!): Boolean!
    reserveRoom(roomId: ID!, reservation: RoomReservationInput!): Room!
  }
`;

module.exports = roomTypeDefs;
