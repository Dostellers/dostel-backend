const Customer = require('../models/customer');

const customerResolvers = {
    Query: {
        customers: async () => {
            return await Customer.find().populate('bookings').populate('reviews').populate('wishlist').populate('coupons').populate('badges');
        },
        customer: async (_, { id }) => {
            return await Customer.findById(id).populate('bookings').populate('reviews').populate('wishlist').populate('coupons').populate('badges');
        },
        customerByEmail: async (_, { email }) => {
            return await Customer.findOne({ email }).populate('bookings').populate('reviews').populate('wishlist').populate('coupons').populate('badges');
        },
        customersByStatus: async (_, { accountStatus }) => {
            return await Customer.find({ accountStatus }).populate('bookings').populate('reviews').populate('wishlist').populate('coupons').populate('badges');
        }
    },
    Mutation: {
        createCustomer: async (_, { input }) => {
            const newCustomer = new Customer(input);
            return await newCustomer.save();
        },
        updateCustomer: async (_, { id, input }) => {
            return await Customer.findByIdAndUpdate(id, input, { new: true }).populate('bookings').populate('reviews').populate('wishlist').populate('coupons').populate('badges');
        },
        deleteCustomer: async (_, { id }) => {
            return await Customer.findByIdAndDelete(id);
        },
        addBookingToCustomer: async (_, { customerId, bookingId }) => {
            const customer = await Customer.findById(customerId);
            customer.bookings.push(bookingId);
            return await customer.save();
        },
        addReviewToCustomer: async (_, { customerId, reviewId }) => {
            const customer = await Customer.findById(customerId);
            customer.reviews.push(reviewId);
            return await customer.save();
        },
        addCouponToCustomer: async (_, { customerId, couponId }) => {
            const customer = await Customer.findById(customerId);
            customer.coupons.push(couponId);
            return await customer.save();
        }
        // ... and so on for other mutations like adding wishlist items, badges, etc.
    }
};
