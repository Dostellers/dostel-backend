const mongoose = require('mongoose');

const InventoryTypeSchema = new mongoose.Schema({
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    mode: { type: String, enum: ['private_room', 'bed'], required: true },
    capacityPerUnit: { type: Number, required: true, min: 1 },
    totalUnits: { type: Number, required: true, min: 1 },
    physicalRoomIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    active: { type: Boolean, default: true, required: true }
}, {
    timestamps: true
});

InventoryTypeSchema.index({ hostelId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('InventoryType', InventoryTypeSchema);
