const { gql } = require('apollo-server-express');

const roomTypeDefs = gql`
  enum RoomTypeCategory {
    dorm
    private
  }

  enum RoomStatus {
    available
    occupied
    maintenance
    out_of_order
  }

  type RoomType {
    id: ID!
    name: String!
    category: RoomTypeCategory!
    capacity: Int!
    basePrice: Float!
    hostel: Hostel!
    createdAt: Date!
    updatedAt: Date
  }

  type Room {
    id: ID!
    name: String
    number: String
    roomType: RoomType
    floor: Int
    status: RoomStatus!
    type: String
    capacity: Int
    maxCapacity: Int
    price: Float
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

  type RoomAvailability {
    roomType: String!
    totalRooms: Int!
    availableRooms: Int!
    pricePerNight: Float!
    roomId: ID!
  }

  input RoomTypeInput {
    name: String!
    category: RoomTypeCategory!
    capacity: Int!
    basePrice: Float!
    hostel: ID!
  }

  input RoomTypeUpdateInput {
    name: String
    category: RoomTypeCategory
    capacity: Int
    basePrice: Float
    hostel: ID
  }

  input RoomInput {
    name: String
    number: String
    roomType: ID
    floor: Int
    status: RoomStatus
    type: String
    capacity: Int
    maxCapacity: Int
    price: Float
    msp: Float
    additionalGuestPrice: Float
    description: String
    features: [String]
    amenities: [ID!]
    accessibilityFeatures: [String]
    view: String
    size: Float
    bedType: String
    petPolicy: String
    restrictions: [String]
    images: [ID!]
    hostel: ID!
  }

  input RoomUpdateInput {
    name: String
    number: String
    roomType: ID
    floor: Int
    status: RoomStatus
    type: String
    capacity: Int
    maxCapacity: Int
    price: Float
    msp: Float
    additionalGuestPrice: Float
    description: String
    features: [String]
    amenities: [ID!]
    accessibilityFeatures: [String]
    view: String
    size: Float
    bedType: String
    petPolicy: String
    restrictions: [String]
    images: [ID!]
    hostel: ID
  }

  input RoomFilterInput {
    hostel: ID
    status: RoomStatus
  }

  input RoomReservationInput {
    startDate: Date!
    endDate: Date!
    customer: ID
    bookingReference: String!
  }

  extend type Query {
    roomTypes(hostel: ID): [RoomType!]!
    roomType(id: ID!): RoomType
    rooms(filter: RoomFilterInput): [Room!]!
    room(id: ID!): Room
    roomsByHostel(hostelId: ID!): [Room!]!
    roomsByType(type: String!): [Room!]!
    roomAvailability(hostelId: ID!, checkIn: Date!, checkOut: Date!): [RoomAvailability!]!
  }

  extend type Mutation {
    createRoomType(input: RoomTypeInput!): RoomType!
    updateRoomType(id: ID!, input: RoomTypeUpdateInput!): RoomType!
    deleteRoomType(id: ID!): Boolean!
    createRoom(input: RoomInput!): Room!
    updateRoom(id: ID!, input: RoomUpdateInput!): Room!
    updateRoomStatus(id: ID!, status: RoomStatus!): Room!
    deleteRoom(id: ID!): Boolean!
    reserveRoom(roomId: ID!, reservation: RoomReservationInput!): Room!
  }
`;

module.exports = roomTypeDefs;
