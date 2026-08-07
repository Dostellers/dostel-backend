const User = require('../models/user');
const authService = require('../services/authService');
const bcrypt = require('bcryptjs');

const userResolvers = {
    Query: {
        users: async () => {
            return await User.find().select('-password');
        },
        user: async (_, { id }) => {
            return await User.findById(id).select('-password');
        },
        me: async (_, __, context) => {
            if (!context.user) throw new Error('Not authenticated');
            return await User.findById(context.user.id).select('-password');
        }
    },
    Mutation: {
        signup: async (_, { input }) => {
            return await authService.signup(input);
        },
        login: async (_, { input }) => {
            return await authService.login(input);
        },
        createUser: async (_, { input }) => {
            const hashedPassword = await bcrypt.hash(input.password, 12);
            const newUser = new User({ ...input, password: hashedPassword });
            return await newUser.save();
        },
        updateUser: async (_, { id, input }) => {
            if (input.password) {
                input.password = await bcrypt.hash(input.password, 12);
            }
            return await User.findByIdAndUpdate(id, input, { new: true }).select('-password');
        },
        deleteUser: async (_, { id }) => {
            return await User.findByIdAndDelete(id);
        }
    }
};

module.exports = userResolvers;
