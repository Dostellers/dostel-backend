const mongoose = require('mongoose');

const hostingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
}, { timestamps: true });

module.exports = mongoose.model('Hostel', hostingSchema);