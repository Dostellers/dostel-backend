const { mergeTypeDefs } = require('@graphql-tools/merge');

const amenityTypeDefs = require('./amenityTypeDefs');
const authTypeDefs = require('./authTypeDefs');
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
const transactionTypeDefs = require('./transactionTypeDefs');
const userTypeDefs = require('./userTypeDefs');
const roleTypeDefs = require('./roleTypeDefs');
const couponTypeDefs = require('./couponTypeDefs');
const healthTypeDefs = require('./healthTypeDefs');
// Import other typedefs as needed...

const mergedTypeDefs = mergeTypeDefs([
    amenityTypeDefs,
    authTypeDefs,
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
    couponTypeDefs,
    transactionTypeDefs,
    healthTypeDefs
]);

module.exports = mergedTypeDefs;
