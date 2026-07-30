const mongoose = require('mongoose');

const RoomTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['dorm', 'private'], required: true },
    capacity: { type: Number, required: true, min: 1 },
    basePrice: { type: Number, required: true, min: 0 },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true }
}, {
    timestamps: true
});

RoomTypeSchema.index({ hostel: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('RoomType', RoomTypeSchema);
