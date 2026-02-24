// src/schema/hostelTypeDefs.js
const { gql } = require('apollo-server-express');

const hostelTypeDefs = gql`
  type Hostel {
    id: ID!
    name: String
    tagline: String
    metaDesc: String
    shortDesc: String
    description: HostelDescription
    inauguratedOn: Date
    basePrice: Float
    totalRooms: Int
    totalBeds: Int
    contact: HostelContact
    location: HostelLocation
    timing: HostelTiming
    seo: HostelSEO
    thingsToKnow: [String]
    gmapUrl: String
    url: String
    images: HostelImages
    otherInfo: [HostelOtherInfo]
    amenities: [Amenity]
    policies: HostelPolicies
    faqs: [FAQ]
    blogs: [Blog]
    createdAt: Date!
    updatedAt: Date
  }

  type HostelDescription {
    heading: String
    content: String
  }

  type HostelContact {
    phone: String
    email: String
  }

  type HostelLocation {
    latitude: Float
    longitude: Float
    url: String
    address: HostelAddress
  }

  type HostelAddress {
    line1: String
    line2: String
    city: String
    state: String
    country: String
    pincode: String
  }

  type HostelTiming {
    checkin: String
    checkout: String
    guestVisit: String
    cafe: String
    reception: String
    other: String
  }

  type HostelSEO {
    title: String
    description: String
    keywords: String
  }

  type HostelImages {
    hero: Image
    main: Image
    thumbnail: Image
    others: [Image]
  }

  type HostelOtherInfo {
    heading: String
    content: String
    iconUrl: String
  }

  type HostelPolicies {
    general: [String]
    pet: [String]
    covid: [String]
  }

  input HostelInput {
    name: String
    tagline: String
    metaDesc: String
    shortDesc: String
    description: HostelDescriptionInput
    inauguratedOn: Date
    basePrice: Float
    totalRooms: Int
    totalBeds: Int
    contact: HostelContactInput
    location: HostelLocationInput
    timing: HostelTimingInput
    seo: HostelSEOInput
    thingsToKnow: [String]
    gmapUrl: String
    url: String
    images: HostelImagesInput
    otherInfo: [HostelOtherInfoInput]
    amenities: [ID]
    policies: HostelPoliciesInput
    faqs: [ID]
    blogs: [ID]
  }

  input HostelDescriptionInput {
    heading: String
    content: String
  }

  input HostelContactInput {
    phone: String
    email: String
  }

  input HostelLocationInput {
    latitude: Float
    longitude: Float
    url: String
    address: HostelAddressInput
  }

  input HostelAddressInput {
    line1: String
    line2: String
    city: String
    state: String
    country: String
    pincode: String
  }

  input HostelTimingInput {
    checkin: String
    checkout: String
    guestVisit: String
    cafe: String
    reception: String
    other: String
  }

  input HostelSEOInput {
    title: String
    description: String
    keywords: String
  }

  input HostelImagesInput {
    hero: ID
    main: ID
    thumbnail: ID
    others: [ID]
  }

  input HostelOtherInfoInput {
    heading: String
    content: String
    iconUrl: String
  }

  input HostelPoliciesInput {
    general: [String]
    pet: [String]
    covid: [String]
  }

  extend type Query {
    hostels: [Hostel!]!
    hostel(id: ID!): Hostel
    hostelsByAmenity(amenityId: ID!): [Hostel!]!
    hostelsByLocation(city: String!): [Hostel!]!
  }

  extend type Mutation {
    createHostel(input: HostelInput!): Hostel!
    updateHostel(id: ID!, input: HostelInput!): Hostel!
    deleteHostel(id: ID!): Boolean!
  }
`;

module.exports = hostelTypeDefs;
