const mongoose = require('mongoose');


const RoomReservationSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    bookingReference: {
        type: String,
        required: true
    }
});

const RoomSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    features: [String],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    reservations: [RoomReservationSchema],
    // bookedDates: [Date],
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    }
}, {
    timestamps: true
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
