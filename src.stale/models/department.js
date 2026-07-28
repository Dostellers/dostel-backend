const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: String,
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    budget: Number,
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

module.exports = mongoose.model('Department', departmentSchema);
