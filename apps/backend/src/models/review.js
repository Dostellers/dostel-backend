const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: false  // It's now optional since external reviews might not have a corresponding customer in your DB.
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comments: {
        type: String,
        trim: true
    },
    response: {
        type: String,
        trim: true
    },
    dateVisited: Date,
    photos: [String],
    verified: {
        type: Boolean,
        default: false
    },
    tags: [String],
    source: {
        type: String,
        enum: ['internal', 'Google', 'TripAdvisor', 'Yelp','Others'],  // Add any other platforms you expect to get reviews from.
        default: 'internal'
    },
    externalLink: String,
    externalReviewerName: String
}, {
    timestamps: true
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
