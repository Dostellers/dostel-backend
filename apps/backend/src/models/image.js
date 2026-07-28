const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: String,
    altText: String,
    caption: String,
    type: String  // e.g., 'hero', 'thumbnail', 'main', etc.
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
