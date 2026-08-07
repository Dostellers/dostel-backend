const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: String,
    level: { type: String, enum: ['Read', 'Write', 'Delete', 'Execute'] },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true // Add this option to enable automatic timestamps
});

module.exports = mongoose.model('Permission', permissionSchema);
