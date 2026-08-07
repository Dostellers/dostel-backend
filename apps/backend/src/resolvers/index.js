const amenityResolver = require('./amenityResolver.js');
const authResolver = require('./authResolver.js');
const badgeResolver = require('./badgeResolver.js');
const blogResolver = require('./blogResolver.js');
const billResolver = require('./billResolver.js');
const bookingResolver = require('./bookingResolver.js');
const couponResolver = require('./couponResolver.js');
const customerResolver = require('./customerResolver.js');
const faqResolver = require('./faqsResolver.js');
const hostelResolver = require('./hostelResolver.js');
const imageResolver = require('./imageResolver.js');
const permissionResolver = require('./permissionResolver.js');
const productResolver = require('./productResolver.js');
const reviewResolver = require('./reviewResolver.js');
const roomResolver = require('./roomResolver.js');
const taxRateResolver = require('./taxRateResolver.js');
const transactionResolver = require('./transactionResolver.js');
const userResolver = require('./userResolver.js');
const roleResolver = require('./roleResolver.js');
const departmentResolver = require('./departmentResolver.js');
const healthResolver = require('./healthResolver.js');
const membershipResolver = require('./membershipResolver.js');
const crossingResolver = require('./crossingResolver.js');

module.exports = {
    Query: {
        ...amenityResolver.Query,
        ...authResolver.Query,
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
        ...userResolver.Query,
        ...roleResolver.Query,
        ...departmentResolver.Query,
        ...healthResolver.Query,
        ...membershipResolver.Query,
        ...crossingResolver.Query
    },
    Booking: {
        ...bookingResolver.Booking
    },
    Mutation: {
        ...amenityResolver.Mutation,
        ...authResolver.Mutation,
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
        ...userResolver.Mutation,
        ...roleResolver.Mutation,
        ...departmentResolver.Mutation,
        ...membershipResolver.Mutation,
        ...crossingResolver.Mutation
    }
};
