const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    name: String,
    tagline: String,
    metaDesc: String,
    shortDesc: String,
    description: {
        heading: String,
        content: String
    },
    inauguratedOn: Date,
    basePrice: Number,
    totalRooms: Number,
    totalBeds: Number,
    phone: String,
    email: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    locationUrl: String,
    status: Boolean,
    checkinTime: String,
    checkoutTime: String,
    address: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        country: String,
        pincode: String
    },
    timingInformation: {
        checkin: String,
        checkout: String,
        guestVisit: String,
        cafe: String,
        reception: String,
        other: String
    },
    seo: {
        metaTitle: String,
        metaDesc: String,
        keywords: String
    },
    thingsToKnow: [String],
    gmapUrl: String,
    url: String,
    heroImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    },
    mainImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    },
    thumbnailImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    otherInfo: [{
        heading: String,
        content: String,
        iconUrl: String
    }],
    amenities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Amenity'
    }],
    hostelPolicies: {
        general: [String],
        pet: [String],
        covid: [String]
    },
    hostelFaqs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FAQ'
    }],
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
}, {
    timestamps: true
});

const Hostel = mongoose.model('Hostel', hostelSchema);

module.exports = Hostel;
