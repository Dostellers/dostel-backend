const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: Date,
    profileImage: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
