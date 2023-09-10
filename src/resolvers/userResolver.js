const User = require('../models/User');

const userResolvers = {
    Query: {
        // Get all users
        users: async () => {
            return await User.find();
        },
        // Get a single user by ID
        user: async (_, { id }) => {
            return await User.findById(id);
        }
    },
    Mutation: {
        // Create a new user
        createUser: async (_, { input }) => {
            const newUser = new User(input);
            return await newUser.save();
        },
        // Update an existing user
        updateUser: async (_, { id, input }) => {
            return await User.findByIdAndUpdate(id, input, { new: true });
        },
        // Delete a user
        deleteUser: async (_, { id }) => {
            return await User.findByIdAndDelete(id);
        }
    }
};

module.exports = userResolvers;
