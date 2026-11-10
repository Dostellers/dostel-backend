const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED'], default: 'PENDING' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);