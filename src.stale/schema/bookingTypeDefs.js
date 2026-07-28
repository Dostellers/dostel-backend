// src/schema/bookingTypeDefs.js
const { gql } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json'); // Import the library


const bookingTypeDefs = gql`
  scalar JSON
  
  type SourceDetail {
    name: String
    referenceId: String
    additionalInfo: JSON
  }

  type Booking {
    id: ID!
    reference: String!
    customer: Customer!
    hostel: Hostel!
    roomType: String!
    checkInDate: Date!
    checkOutDate: Date!
    guests: Int!
    totalAmount: Float!
    payment: PaymentInfo!
    specialRequests: String
    source: SourceDetail
    loyaltyPointsRedeemed: Int
    discount: DiscountInfo
    status: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type PaymentInfo {
    status: String!
    method: String
    transactionId: String
  }

  type DiscountInfo {
    coupon: String
    amount: Float!
    percentage: Float!
    applied: Float!
  }

  input BookingInput {
    reference: String!
    customerId: ID!
    hostelId: ID!
    roomType: String!
    checkInDate: Date!
    checkOutDate: Date!
    guests: Int!
    totalAmount: Float!
    payment: PaymentInput!
    specialRequests: String
    source: SourceInput
    loyaltyPointsRedeemed: Int
    discount: DiscountInput
    status: String
  }

  input PaymentInput {
    status: String!
    method: String
    transactionId: String
  }

  input DiscountInput {
    couponId: ID
    amount: Float!
    percentage: Float!
    applied: Float!
  }

  input SourceInput {
    name: String
    referenceId: String
    additionalInfo: String
  }

  extend type Query {
    bookings: [Booking!]!
    booking(id: ID!): Booking
    draftBookings: [Booking!]!
    bookingsByCustomer(customerId: ID!): [Booking!]!
    bookingsByStatus(status: String!): [Booking!]!
    abandonedBookings: [Booking!]!
  }

  extend type Mutation {
    createBooking(input: BookingInput!): Booking!
    updateBooking(id: ID!, input: BookingInput!): Booking!
    deleteBooking(id: ID!): Boolean!
    applyCouponToBooking(bookingId: ID!, couponId: ID!): Booking!
    confirmBooking(id: ID!): Booking!
    completeBooking(id: ID!): Booking!
    abandonBooking(id: ID!): Booking!
    reactivateBooking(id: ID!): Booking!
    changeBookingStatus(id: ID!, status: String!): Booking!
  }
`;

module.exports = bookingTypeDefs;
