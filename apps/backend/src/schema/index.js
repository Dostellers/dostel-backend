const { mergeTypeDefs } = require('@graphql-tools/merge');

const amenityTypeDefs = require('./amenityTypeDefs.js');
const authTypeDefs = require('./authTypeDefs.js');
const badgeTypeDefs = require('./badgeTypeDefs.js');
const billTypeDefs = require('./billTypeDefs.js');
const blogTypeDefs = require('./blogTypeDefs.js');
const bookingTypeDefs = require('./bookingTypeDefs.js');
const customerTypeDefs = require('./customerTypeDefs.js');
const departmentTypeDefs = require('./departmentTypeDefs.js');
const faqTypeDefs = require('./faqTypeDefs.js');
const hostelTypeDefs = require('./hostelTypeDefs.js');
const imageTypeDefs = require('./imageTypeDefs.js');
const permissionTypeDefs = require('./permissionTypeDefs.js');
const productTypeDefs = require('./productTypeDefs.js');
const reviewTypeDefs = require('./reviewTypeDefs.js');
const roomTypeDefs = require('./roomTypeDefs.js');
const taxRateTypeDefs = require('./taxRateTypeDefs.js');
const transactionTypeDefs = require('./transactionTypeDefs.js');
const userTypeDefs = require('./userTypeDefs.js');
const roleTypeDefs = require('./roleTypeDefs.js');
const couponTypeDefs = require('./couponTypeDefs.js');
const healthTypeDefs = require('./healthTypeDefs.js');
const membershipTypeDefs = require('./membershipTypeDefs.js');

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
    transactionTypeDefs,
    userTypeDefs,
    roleTypeDefs,
    couponTypeDefs,
    healthTypeDefs,
    membershipTypeDefs
]);

module.exports = mergedTypeDefs;
