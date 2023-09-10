const Badge = require('../models/badge');

const badgeResolvers = {
    Query: {
        badges: async () => {
            return await Badge.find();
        },
        badge: async (_, { id }) => {
            return await Badge.findById(id);
        }
    },
    Mutation: {
        createBadge: async (_, { input }) => {
            const newBadge = new Badge(input);
            return await newBadge.save();
        },
        updateBadge: async (_, { id, input }) => {
            return await Badge.findByIdAndUpdate(id, input, { new: true });
        },
        deleteBadge: async (_, { id }) => {
            return await Badge.findByIdAndDelete(id);
        }
    }
};
