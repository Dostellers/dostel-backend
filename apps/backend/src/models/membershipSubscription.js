const mongoose = require('mongoose');

const membershipSubscriptionSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MembershipPlan',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    autoRenew: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

membershipSubscriptionSchema.index({ customer: 1, status: 1 });

module.exports = mongoose.model('MembershipSubscription', membershipSubscriptionSchema);
