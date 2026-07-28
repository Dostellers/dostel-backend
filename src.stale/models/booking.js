const mongoose = require('mongoose');

const SourceDetailSchema = new mongoose.Schema({
    name: String,
    referenceId: String,
    additionalInfo: { type: Map, of: String }
});

const bookingSchema = new mongoose.Schema({
    reference: { type: String, unique: true, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
    roomType: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    payment: {
        status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
        method: { type: String, enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash', 'Others'] },
        transactionId: String
    },
    specialRequests: String,
    source: SourceDetailSchema,
    loyaltyPointsRedeemed: { type: Number, default: 0 },
    discount: {
        coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
        amount: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
        applied: { type: Number, default: 0 }
    },
    status: { type: String, enum: ['Draft', 'Confirmed', 'Completed', 'Abandoned'], default: 'Draft' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
