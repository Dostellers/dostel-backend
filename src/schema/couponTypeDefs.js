const { gql } = require('apollo-server-express');

const couponTypeDefs = gql`
  type Coupon {
    id: ID!
    code: String!
    description: String
    discountAmount: Float
    discountPercentage: Float
    maxDiscountAmount: Float
    minimumPurchaseAmount: Float
    applicableTo: CouponApplicability
    isActive: Boolean
    startDate: Date
    endDate: Date
    redemptionLimit: Int
    timesRedeemed: Int
    createdAt: Date!
    updatedAt: Date
  }

  type CouponApplicability {
    hostels: [Hostel]
    services: [String]
  }

  input CouponInput {
    code: String!
    description: String
    discountAmount: Float
    discountPercentage: Float
    maxDiscountAmount: Float
    minimumPurchaseAmount: Float
    applicableTo: CouponApplicabilityInput
    isActive: Boolean
    startDate: Date
    endDate: Date
    redemptionLimit: Int
    timesRedeemed: Int
  }

  input CouponApplicabilityInput {
    hostels: [ID]
    services: [String]
  }

  type Query {
    coupons: [Coupon]
    coupon(id: ID!): Coupon
    activeCoupons: [Coupon]
  }

  type Mutation {
    createCoupon(input: CouponInput!): Coupon!
    updateCoupon(id: ID!, input: CouponInput!): Coupon!
    deleteCoupon(id: ID!): Boolean!
  }
`;

module.exports = couponTypeDefs;
