const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    # Bill
    bills: [Bill!]!
    bill(id: ID!): Bill

    # Booking
    bookings: [Booking!]!
    draftBookings: [Booking!]!
    abandonedBookings: [Booking!]!
    booking(id: ID!): Booking

    # Customer
    customers: [Customer!]!
    customer(id: ID!): Customer

    # Hostel
    hostels: [Hostel!]!
    hostel(id: ID!): Hostel

    # Image
    images: [Image!]!
    image(id: ID!): Image

    # Review
    reviews: [Review!]!
    review(id: ID!): Review

    # Room
    rooms: [Room!]!
    room(id: ID!): Room

    # Transaction
    transactions: [Transaction!]!
    transaction(id: ID!): Transaction

    # User
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    # Add mutation types for each resolver here
    # Example:
    createBill(input: BillInput!): Bill!
    updateBill(id: ID!, input: BillInput!): Bill!
    deleteBill(id: ID!): Boolean!
    # ... and so on for other resolvers
  }

  # Define types for each resolver
  type Bill {
    id: ID!
    # Fields for Bill
  }

  input BillInput {
    name: String!
    # Input fields for creating/updating a Bill
  }

  type Booking {
    id: ID!
    # Fields for Booking
  }

`;

module.exports = typeDefs;
