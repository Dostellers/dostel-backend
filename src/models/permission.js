const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: String,
    level: { type: String, enum: ['Read', 'Write', 'Delete', 'Execute'] },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

module.exports = mongoose.model('Permission', permissionSchema);
