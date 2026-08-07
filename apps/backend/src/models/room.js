const mongoose = require('mongoose');

const RoomReservationSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    bookingReference: { type: String, required: true }
});

const RoomSchema = new mongoose.Schema({
    number: { type: String, trim: true },
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomType' },
    floor: Number,
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance', 'out_of_order'],
        default: 'available',
        required: true
    },
    type: { type: String, trim: true },
    capacity: { type: Number, min: 1 },
    maxCapacity: Number,
    price: Number,
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

RoomSchema.index({ hostel: 1, number: 1 }, { unique: true, sparse: true });
RoomSchema.index({ hostel: 1, status: 1 });

module.exports = mongoose.model('Room', RoomSchema);
