const amenityResolver = require('./amenityResolver');
const badgeResolver = require('./badgeResolver');
const blogResolver = require('./blogResolver');
const billResolver = require('./billResolver');
const bookingResolver = require('./bookingResolver');
const couponResolver = require('./couponResolver');
const customerResolver = require('./customerResolver');
const faqResolver = require('./faqsResolver');
const hostelResolver = require('./hostelResolver');
const imageResolver = require('./imageResolver');
const permissionResolver = require('./permissionResolver');
const productResolver = require('./productResolver');
const reviewResolver = require('./reviewResolver');
const roomResolver = require('./roomResolver');
const taxRateResolver = require('./taxRateResolver');
const transactionResolver = require('./transactionResolver');
const userResolver = require('./userResolver');

module.exports = {
    Query: {
        ...amenityResolver.Query,
        ...badgeResolver.Query,
        ...blogResolver.Query,
        ...billResolver.Query,
        ...bookingResolver.Query,
        ...couponResolver.Query,
        ...customerResolver.Query,
        ...faqResolver.Query,
        ...hostelResolver.Query,
        ...imageResolver.Query,
        ...permissionResolver.Query,
        ...productResolver.Query,
        ...reviewResolver.Query,
        ...roomResolver.Query,
        ...taxRateResolver.Query,
        ...transactionResolver.Query,
        ...userResolver.Query
    },
    Mutation: {
        ...amenityResolver.Mutation,
        ...badgeResolver.Mutation,
        ...blogResolver.Mutation,
        ...billResolver.Mutation,
        ...bookingResolver.Mutation,
        ...couponResolver.Mutation,
        ...customerResolver.Mutation,
        ...faqResolver.Mutation,
        ...hostelResolver.Mutation,
        ...imageResolver.Mutation,
        ...permissionResolver.Mutation,
        ...productResolver.Mutation,
        ...reviewResolver.Mutation,
        ...roomResolver.Mutation,
        ...taxRateResolver.Mutation,
        ...transactionResolver.Mutation,
        ...userResolver.Mutation
    }
};
