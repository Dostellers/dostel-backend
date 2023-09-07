const mongoose = require('mongoose');

const BillProductReferenceSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    total: {
        type: Number,
        required: true
    }
});

const BillSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    billItems: [BillItemReferenceSchema],
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Wallet']
    },
    transactionId: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded'],
        default: 'Pending'
    },
    dateIssued: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Bill = mongoose.model('Bill', BillSchema);

module.exports = Bill;
