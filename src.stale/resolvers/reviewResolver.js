const Review = require('../models/Review');

const reviewResolvers = {
    Query: {
        reviews: async () => {
            return await Review.find().populate('customer').populate('hostel');
        },
        review: async (_, { id }) => {
            return await Review.findById(id).populate('customer').populate('hostel');
        },
        reviewsByHostel: async (_, { hostelId }) => {
            return await Review.find({ hostel: hostelId }).populate('customer');
        },
        reviewsBySource: async (_, { source }) => {
            return await Review.find({ source }).populate('customer').populate('hostel');
        }
    },
    Mutation: {
        createReview: async (_, { input }) => {
            const newReview = new Review(input);
            return await newReview.save();
        },
        updateReview: async (_, { id, input }) => {
            return await Review.findByIdAndUpdate(id, input, { new: true }).populate('customer').populate('hostel');
        },
        deleteReview: async (_, { id }) => {
            return await Review.findByIdAndDelete(id);
        },
        verifyReview: async (_, { id }) => {
            const review = await Review.findById(id);
            review.verified = true;
            return await review.save();
        }
    }
};
