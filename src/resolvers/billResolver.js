const Bill = require('../models/bill');

const billResolvers = {
    Query: {
        // Get all bills
        bills: async () => {
            return await Bill.find().populate('customer').populate('booking').populate('billItems.product');
        },
        // Get a single bill by ID
        bill: async (_, { id }) => {
            return await Bill.findById(id).populate('customer').populate('booking').populate('billItems.product');
        }
    },
    Mutation: {
        // Create a new bill
        createBill: async (_, { input }) => {
            const newBill = new Bill(input);
            return await newBill.save();
        },
        // Update an existing bill
        updateBill: async (_, { id, input }) => {
            return await Bill.findByIdAndUpdate(id, input, { new: true }).populate('customer').populate('booking').populate('billItems.product');
        },
        // Delete a bill
        deleteBill: async (_, { id }) => {
            return await Bill.findByIdAndDelete(id);
        },
        // Add a product to a bill
        addProductToBill: async (_, { billId, productId, quantity, total }) => {
            const bill = await Bill.findById(billId);
            bill.billItems.push({ product: productId, quantity, total });
            return await bill.save();
        },
        // Remove a product from a bill
        removeProductFromBill: async (_, { billId, productId }) => {
            const bill = await Bill.findById(billId);
            bill.billItems = bill.billItems.filter(item => item.product.toString() !== productId);
            return await bill.save();
        }
    }
};

module.exports = billResolvers;
