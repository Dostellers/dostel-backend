const billResolver = require('./billResolver');
const bookingResolver = require('./bookingResolver');
const customerResolver = require('./customerResolver');
const hostelResolver = require('./hostelResolver');
const imageResolver = require('./imageResolver');
const reviewResolver = require('./reviewResolver');
const roomResolver = require('./roomResolver');
const transactionResolver = require('./transactionResolver');
const userResolver = require('./userResolver');

module.exports = {
    Query: {
        ...billResolver.Query,
        ...bookingResolver.Query,
        ...customerResolver.Query,
        ...hostelResolver.Query,
        ...imageResolver.Query,
        ...reviewResolver.Query,
        ...roomResolver.Query,
        ...transactionResolver.Query,
        ...userResolver.Query
    },
    Mutation: {
        ...billResolver.Mutation,
        ...bookingResolver.Mutation,
        ...customerResolver.Mutation,
        ...hostelResolver.Mutation,
        ...imageResolver.Mutation,
        ...reviewResolver.Mutation,
        ...roomResolver.Mutation,
        ...transactionResolver.Mutation,
        ...userResolver.Mutation
    }
};
