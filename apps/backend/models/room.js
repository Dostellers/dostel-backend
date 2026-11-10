const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  status: { type: String, enum: ['confirmed', 'pending', 'cancelled', 'checked_in', 'checked_out'], default: 'confirmed' },
  totalPrice: { type: Number },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const roomSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  name: {
    en: { type: String, required: true },
    default: { type: String }
  },
  number: { type: String },
  status: { type: String, enum: ['available', 'occupied', 'maintenance', 'out_of_order'], default: 'available' },
  type: { type: String },
  capacity: { type: Number },
  maxCapacity: { type: Number },
  price: { type: Number },
  msp: { type: Number },
  additionalGuestPrice: { type: Number },
  description: { type: String },
  features: [{ type: String }],
  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
  accessibilityFeatures: [{ type: String }],
  view: { type: String },
  size: { type: Number },
  bedType: { type: String },
  petPolicy: { type: String },
  restrictions: [{ type: String }],
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  floor: { type: Number },
  bookings: [bookingSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);