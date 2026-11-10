// src/schema/bookingTypeDefs.js
const { gql } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json'); // Import the library


const bookingTypeDefs = gql`
  scalar JSON

  enum BookingStatus {
    Draft
    Confirmed
    CheckedIn
    CheckedOut
    Completed
    Abandoned
  }

  enum RateType {
    FREE_CANCELLATION
    FLEXIBLE
    NON_REFUNDABLE
    PAY_NOW
  }

  enum BalanceCollection {
    AT_PROPERTY
    PREPAID
  }
   
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
    depositPercentage: Float!
    depositRequired: Float!
    amountPaid: Float!
    balanceDue: Float!
    rateType: RateType
    balanceCollection: BalanceCollection
    payAtProperty: Float
    refundable: Boolean
    refundAs: String
    cancellationDeadlineHours: Int
    cancellationPolicy: String
    payment: PaymentInfo!
    specialRequests: String
    source: SourceDetail
    loyaltyPointsToUse: Int
    loyaltyPointsRedeemed: Int
    discount: DiscountInfo
    status: BookingStatus
    paymentMethod: String!
    transactionId: String!
    chargeId: String!
  }
   
  type AdminBookingsResult {
    bookings: [Booking!]!
    total: Int!
    page: Int!
  }
   
  type PaymentInfo {
    status: String!
    method: String
    transactionId: String
    amount: Float!
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
     rateType: RateType
     specialRequests: String
     source: SourceInput
     loyaltyPointsToUse: Int
     loyaltyPointsRedeemed: Int
     discount: DiscountInput
     status: BookingStatus
     paymentMethod: String!
     transactionId: String!
     chargeId: String!
   }
   
  input PaymentInput {
    status: String!
    method: String
    transactionId: String
    amount: Float!
    depositPercentage: Float
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
    adminBookings(
      hostelId: ID
      status: String
      dateFrom: Date
      dateTo: Date
      search: String
      limit: Int
      offset: Int
    ): AdminBookingsResult!
  }
   
extend type Mutation {
    createBooking(input: BookingInput!): Booking!
    updateBooking(id: ID!, input: BookingInput!): Booking!
    deleteBooking(id: [ID!]!): Boolean!
    applyCouponToBooking(bookingId: ID!, couponId: ID!): Booking!
    confirmBooking(id: ID!): Booking!
    completeBooking(id: ID!): Booking!
    abandonBooking(id: ID!): Booking!
    reactivateBooking(id: ID!): Booking!
    changeBookingStatus(id: ID!, status: String!): Booking!
    processBookingPayment(id: ID!, input: PaymentInput!): Booking!
  }
`;

module.exports = bookingTypeDefs;