const Blog = require('../models/blogs');

const blogResolvers = {
    Query: {
        blogs: async () => {
            return await Blog.find();
        },
        blog: async (_, { id }) => {
            return await Blog.findById(id);
        },
        blogsByAuthor: async (_, { authorName }) => {
            return await Blog.find({ authorName });
        }
    },
    Mutation: {
        createBlog: async (_, { input }) => {
            const newBlog = new Blog(input);
            return await newBlog.save();
        },
        updateBlog: async (_, { id, input }) => {
            return await Blog.findByIdAndUpdate(id, input, { new: true });
        },
        deleteBlog: async (_, { id }) => {
            return await Blog.findByIdAndDelete(id);
        }
    }
};
