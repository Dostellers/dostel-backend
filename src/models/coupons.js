const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    description: {
        type: String,
        trim: true
    },
    discountAmount: {  // Flat discount amount
        type: Number,
        default: 0
    },
    discountPercentage: {  // Percentage-based discount
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    maxDiscountAmount: Number,  // Maximum discount amount when using percentage-based discount
    minimumPurchaseAmount: Number,  // Minimum purchase amount to avail the discount
    applicableTo: {
        // If you want the coupon to be applicable to specific hostels or services
        hostels: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hostel'
        }],
        services: [String]  // e.g., ["FOOD", "TRAVEL"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: Date,  // Date from when the coupon becomes valid
    endDate: Date,  // Date after which the coupon is no longer valid
    redemptionLimit: Number,  // Number of times this coupon can be redeemed
    timesRedeemed: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
