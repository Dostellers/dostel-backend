const mongoose = require('mongoose');

const taxRateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    rate: {
        type: Number,
        required: true,
        min: 0,
        max: 100  // Assuming a percentage-based rate
    },
    jurisdiction: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Sales', 'Service', 'Import', 'Export', 'Other'],
        default: 'Sales'
    },
    applicableTo: {
        type: [String],
        enum: ['Product', 'Service'],
        default: ['Product']
    },
    effectiveFrom: {
        type: Date,
        default: Date.now
    },
    effectiveTo: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const TaxRate = mongoose.model('TaxRate', taxRateSchema);

module.exports = TaxRate;
