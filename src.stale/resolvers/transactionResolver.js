const Transaction = require('../models/Transaction');

const transactionResolvers = {
    Query: {
        transactions: async () => {
            return await Transaction.find().populate('user').populate('booking');
        },
        transaction: async (_, { id }) => {
            return await Transaction.findById(id).populate('user').populate('booking');
        },
        transactionsByStatus: async (_, { status }) => {
            return await Transaction.find({ status }).populate('user').populate('booking');
        },
        transactionsByUser: async (_, { userId }) => {
            return await Transaction.find({ user: userId }).populate('booking');
        }
    },
    Mutation: {
        createTransaction: async (_, { input }) => {
            const newTransaction = new Transaction(input);
            return await newTransaction.save();
        },
        updateTransaction: async (_, { id, input }) => {
            return await Transaction.findByIdAndUpdate(id, input, { new: true });
        },
        deleteTransaction: async (_, { id }) => {
            return await Transaction.findByIdAndDelete(id);
        }
    }
};
