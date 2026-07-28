const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    // Basic Information
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    alias: String,  // Added alias
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: Date,
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    profilePicture: String,
    emergencyContact: {
        name: String,
        relation: String,
        phoneNumber: String
    },
    
    // Activity
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    lastActive: Date,
    searchPreferences: [String],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    }],
    coupons: [{  // Reference to Coupon model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    }],

    // Preferences
    socialMediaHandles: {
        twitter: String,
        instagram: String,
        facebook: String
    },
    preferredCommunicationChannel: {
        type: String,
        default: 'email'
    },

    // Security
    accountStatus: {
        type: String,
        default: 'active'
    },
    deviceInfo: String,

    // Marketing & Loyalty
    badges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
    }],
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    newsletterSubscription: {
        type: Boolean,
        default: false
    },
    marketingPreferences: [String],
    referralCode: String,

}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
