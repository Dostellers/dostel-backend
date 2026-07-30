const mongoose = require('mongoose');

const dateKeyPattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const InventoryDaySchema = new mongoose.Schema({
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
    inventoryTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryType', required: true },
    date: { type: String, required: true, match: dateKeyPattern },
    total: { type: Number, required: true, min: 0 },
    held: { type: Number, default: 0, required: true, min: 0 },
    sold: { type: Number, default: 0, required: true, min: 0 },
    blocked: { type: Number, default: 0, required: true, min: 0 },
    version: { type: Number, default: 0, required: true, min: 0 }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

InventoryDaySchema.virtual('availability').get(function getAvailability() {
    return Math.max(0, this.total - this.held - this.sold - this.blocked);
});

InventoryDaySchema.path('blocked').validate(function validateCounts() {
    return this.held + this.sold + this.blocked <= this.total;
}, 'Held, sold, and blocked inventory cannot exceed total inventory');

InventoryDaySchema.index({ inventoryTypeId: 1, date: 1 }, { unique: true });
InventoryDaySchema.index({ hostelId: 1, date: 1 });

module.exports = mongoose.model('InventoryDay', InventoryDaySchema);
