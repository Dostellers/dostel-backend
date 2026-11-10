const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: { type: String },
  metaDesc: { type: String },
  shortDesc: { type: String },
  description: {
    heading: { type: String },
    content: { type: String }
  },
  inauguratedOn: { type: Date },
  pricePerNight: { type: Number },
  totalRooms: { type: Number },
  totalBeds: { type: Number },
  contact: {
    phone: { type: String },
    email: { type: String }
  },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    url: { type: String },
    address: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pincode: { type: String }
    }
  },
  timing: {
    checkin: { type: String },
    checkout: { type: String },
    guestVisit: { type: String },
    cafe: { type: String },
    reception: { type: String },
    other: { type: String }
  },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: { type: String }
  },
  thingsToKnow: [{ type: String }],
  gmapUrl: { type: String },
  url: { type: String },
  images: {
    hero: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    main: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    others: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
  },
  otherInfo: [{
    heading: { type: String },
    content: { type: String },
    iconUrl: { type: String }
  }],
  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
  policies: {
    general: [{ type: String }],
    pet: [{ type: String }],
    covid: [{ type: String }]
  },
  faqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FAQ' }],
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hostel', hostelSchema);