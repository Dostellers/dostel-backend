const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    membershipPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MembershipPlan',
        default: null
    },
    points: {
        type: Number,
        default: 0
    },
    tier: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        default: 'Bronze'
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true,
        uppercase: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    referralEarnings: {
        type: Number,
        default: 0
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    membershipStartDate: {
        type: Date,
        default: Date.now
    },
    membershipEndDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Membership', membershipSchema);