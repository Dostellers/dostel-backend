const mongoose = require('mongoose');


// Define Source Detail Schema
const SourceDetailSchema = new mongoose.Schema({
    sourceName: String,  // Name of the booking source e.g., "Booking.com", "Airbnb", "Direct", etc.
    referenceId: String, // A reference or booking ID provided by the source.
    additionalInfo: {    // A flexible structure to capture any unique details provided by the source.
        type: Map,
        of: String
    }
});


const bookingSchema = new mongoose.Schema({
    bookingReference: {
        type: String,
        unique: true,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash', 'Others']
    },
    transactionId: String,
    specialRequests: String,
    bookingSource: SourceDetailSchema,
    loyaltyPointsRedeemed: {
        type: Number,
        default: 0
    },
    discount: {
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon'
        },
        discountAmount: { 
            type: Number, 
            default: 0 
        },
        discountPercentage: { 
            type: Number, 
            default: 0 
        },
        appliedDiscount: { 
            type: Number, 
            default: 0 
        }
    }
    
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
