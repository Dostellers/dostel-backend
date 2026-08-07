const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        trim: true,
        enum: ['General', 'Booking', 'Rooms', 'Amenities', 'Policies', 'Other'], // Add or remove as needed
        default: 'General'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;
