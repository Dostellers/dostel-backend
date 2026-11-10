const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    activityType: {
        type: String,
        enum: ['free_workshop', 'paid_experience', 'member_exclusive', 'community_event'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    currentAttendees: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    tierAccess: {
        type: [{
            type: String,
            enum: ['Explorer', 'Contributor', 'Dosteller', 'Elder']
        }],
        default: ['Explorer', 'Contributor', 'Dosteller', 'Elder']
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    features: [String],
    accessibilityFeatures: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

activitySchema.index({ startDate: 1, endDate: 1 });
activitySchema.index({ tierAccess: 1 });
activitySchema.index({ activityType: 1 });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;