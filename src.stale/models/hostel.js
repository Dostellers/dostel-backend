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
    contact: {
        phone: String,
        email: String
    },
    location: {
        latitude: Number,
        longitude: Number,
        url: String,
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            country: String,
            pincode: String
        }
    },
    timing: {
        checkin: String,
        checkout: String,
        guestVisit: String,
        cafe: String,
        reception: String,
        other: String
    },
    seo: {
        title: String,
        description: String,
        keywords: String
    },
    thingsToKnow: [String],
    gmapUrl: String,
    url: String,
    images: {
        hero: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
        main: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
        thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
        others: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
    },
    otherInfo: [{
        heading: String,
        content: String,
        iconUrl: String
    }],
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
    policies: {
        general: [String],
        pet: [String],
        covid: [String]
    },
    faqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FAQ' }],
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Hostel', hostelSchema);
