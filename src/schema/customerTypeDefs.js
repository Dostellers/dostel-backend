// src/schema/customerTypeDefs.js
const { gql } = require('apollo-server-express');

const customerTypeDefs = gql`
  type Address {
    street: String
    city: String
    state: String
    country: String
    postalCode: String
  }

  type EmergencyContact {
    name: String
    relation: String
    phoneNumber: String
  }

  type SocialMediaHandles {
    twitter: String
    instagram: String
    facebook: String
  }

  type Customer {
    id: ID!
    fullName: String!
    alias: String
    email: String!
    phone: String!
    password: String!
    dateOfBirth: Date
    address: Address
    profilePicture: String
    emergencyContact: EmergencyContact
    bookings: [Booking!]!
    reviews: [Review!]!
    lastActive: Date
    searchPreferences: [String]
    wishlist: [Hostel!]!
    coupons: [Coupon!]!
    socialMediaHandles: SocialMediaHandles
    preferredCommunicationChannel: String
    accountStatus: String
    deviceInfo: String
    badges: [Badge!]!
    loyaltyPoints: Int!
    newsletterSubscription: Boolean
    marketingPreferences: [String]
    referralCode: String
    createdAt: Date!
    updatedAt: Date!
  }

  input AddressInput {
    street: String
    city: String
    state: String
    country: String
    postalCode: String
  }

  input EmergencyContactInput {
    name: String
    relation: String
    phoneNumber: String
  }

  input SocialMediaHandlesInput {
    twitter: String
    instagram: String
    facebook: String
  }

  input CustomerInput {
    fullName: String!
    alias: String
    email: String!
    phone: String!
    password: String!
    dateOfBirth: Date
    address: AddressInput
    profilePicture: String
    emergencyContact: EmergencyContactInput
    socialMediaHandles: SocialMediaHandlesInput
    preferredCommunicationChannel: String
    accountStatus: String
    deviceInfo: String
    newsletterSubscription: Boolean
    marketingPreferences: [String]
    referralCode: String
  }

  extend type Query {
    customers: [Customer!]!
    customer(id: ID!): Customer
    customerByEmail(email: String!): Customer
    customersByStatus(accountStatus: String!): [Customer!]!
  }

  extend type Mutation {
    createCustomer(input: CustomerInput!): Customer!
    updateCustomer(id: ID!, input: CustomerInput!): Customer!
    deleteCustomer(id: ID!): Boolean!
    addBookingToCustomer(customerId: ID!, bookingId: ID!): Customer!
    addReviewToCustomer(customerId: ID!, reviewId: ID!): Customer!
    addCouponToCustomer(customerId: ID!, couponId: ID!): Customer!
    # ... and so on for other mutations like adding wishlist items, badges, etc.
  }
`;

module.exports = customerTypeDefs;
