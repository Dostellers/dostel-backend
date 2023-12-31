const mongoose = require('mongoose');

const RoomReservationSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    bookingReference: { type: String, required: true }
});

const RoomSchema = new mongoose.Schema({
    type: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    maxCapacity: Number,
    price: { type: Number, required: true },
    msp: Number,
    additionalGuestPrice: Number,
    description: { type: String, trim: true },
    features: [String],
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
    accessibilityFeatures: [String],
    view: String,
    size: Number,
    bedType: String,
    petPolicy: String,
    restrictions: [String],
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    reservations: [RoomReservationSchema],
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema);
