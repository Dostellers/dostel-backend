const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blogTitle: String,
    authorName: String,
    shortDescription: String,
    content: String,
    url: String,
    publishDate: Date,
    timeToRead: String,
    featuredImage: String
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
