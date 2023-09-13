const { mergeTypes } = require('merge-graphql-schemas');

const amenityTypeDefs = require('./amenityTypeDefs');
const badgeTypeDefs = require('./badgeTypeDefs');
const billTypeDefs = require('./billTypeDefs');
const blogTypeDefs = require('./blogTypeDefs');
const bookingTypeDefs = require('./bookingTypeDefs');
const customerTypeDefs = require('./customerTypeDefs');
const departmentTypeDefs = require('./departmentTypeDefs'); 
const faqTypeDefs = require('./faqTypeDefs');
const hostelTypeDefs = require('./hostelTypeDefs');
const imageTypeDefs = require('./imageTypeDefs'); 
const permissionTypeDefs = require('./permissionTypeDefs');
const productTypeDefs = require('./productTypeDefs');
const reviewTypeDefs = require('./reviewTypeDefs');
const roomTypeDefs = require('./roomTypeDefs'); 
const taxRateTypeDefs = require('./taxRateTypeDefs'); 
const userTypeDefs = require('./userTypeDefs');
const roleTypeDefs = require('./roleTypeDefs');
const couponTypeDefs = require('./couponTypeDefs');
// Import other typedefs as needed...

const mergedTypeDefs = mergeTypes([
    amenityTypeDefs,
    badgeTypeDefs,
    billTypeDefs,
    blogTypeDefs,
    bookingTypeDefs,
    customerTypeDefs,
    departmentTypeDefs,
    faqTypeDefs,
    hostelTypeDefs,
    imageTypeDefs,
    permissionTypeDefs,
    productTypeDefs,
    reviewTypeDefs,
    roomTypeDefs,
    taxRateTypeDefs,
    userTypeDefs,
    roleTypeDefs,
    couponTypeDefs
]);

module.exports = mergedTypeDefs;
