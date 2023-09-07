const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
    name: String,
    iconUrl: String,
    description: String,
    status: Boolean
});

const Amenity = mongoose.model('Amenity', amenitySchema);

module.exports = Amenity;
