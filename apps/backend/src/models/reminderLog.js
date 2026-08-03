const mongoose = require('mongoose');

const ReminderLogSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  daysBefore: { type: Number, required: true },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  error: { type: String, default: null },
});

module.exports = mongoose.model('ReminderLog', ReminderLogSchema);