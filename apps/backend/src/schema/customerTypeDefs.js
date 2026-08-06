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
    referredBy: Customer
    referrals: [Customer!]!
    tier: String
    contributions: Int
    reputation: Int
    tokenBalance: Int
    tokenReceipts: [TokenReceipt!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type TokenReceipt {
    id: ID!
    customer: Customer!
    amount: Int!
    type: String!
    description: String
    transactionId: String
    payment: Transaction
    audits: [ReceiptAuditLog!]!
    createdAt: Date!
  }

  input TokenReceiptInput {
    amount: Int
    type: String
    description: String
    transactionId: String
    payment: ID
  }

  type ReceiptAuditLog {
    id: ID!
    receipt: TokenReceipt!
    field: String!
    oldValue: String
    newValue: String
    action: String!
    actionBy: User
    createdAt: Date!
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
    tier: String
    contributions: Int
    reputation: Int
    tokenBalance: Int
  }

  extend type Query {
    customers: [Customer!]!
    customer(id: ID!): Customer
    customerByEmail(email: String!): Customer
    customersByStatus(accountStatus: String!): [Customer!]!
    tokenReceipts(customerId: ID!): [TokenReceipt!]!
    tokenReceiptsAll(page: Int, limit: Int): [TokenReceipt!]!
    receiptLogs(receiptId: ID!): [ReceiptAuditLog!]!
  }

  extend type Mutation {
    addTokenReceipt(id: ID!, input: TokenReceiptInput!): TokenReceipt!
    createCustomer(input: CustomerInput!): Customer!
    updateCustomer(id: ID!, input: CustomerInput!): Customer!
    deleteCustomer(id: ID!): Boolean!
    addBookingToCustomer(customerId: ID!, bookingId: ID!): Customer!
    addReviewToCustomer(customerId: ID!, reviewId: ID!): Customer!
    addCouponToCustomer(customerId: ID!, couponId: ID!): Customer!
    addReferralToCustomer(customerId: ID!, referralId: ID!): Customer!
    addContributions(id: ID!, points: Int!): Customer!
    updateReputation(id: ID!, points: Int!): Customer!
    addTokens(id: ID!, amount: Int!): Customer!
    updateLoyaltyPoints(id: ID!, points: Int!): Customer!
    updateMembershipTier(id: ID!, tier: String!): Customer!
    findOrCreateCustomer(email: String!, fullName: String!, phone: String): Customer!
    deleteTokenReceipt(id: ID!): Boolean!
    bulkDeleteTokenReceipts(ids: [ID!]!): Boolean!
    restoreTokenReceipt(id: ID!, field: String!, value: String!): TokenReceipt!
    updateTokenReceipt(id: ID!, input: TokenReceiptInput!): TokenReceipt!
    awardReferralReward(customerId: ID!): Customer!
  }
`;

module.exports = customerTypeDefs;
