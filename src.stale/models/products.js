const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['Physical', 'Service'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    applicableTaxes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaxRate'
    }],
    availableQuantity: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
