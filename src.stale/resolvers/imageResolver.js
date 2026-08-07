const Image = require('../models/Image');

const imageResolvers = {
    Query: {
        images: async () => {
            return await Image.find();
        },
        image: async (_, { id }) => {
            return await Image.findById(id);
        },
        imagesByType: async (_, { type }) => {
            return await Image.find({ type });
        }
    },
    Mutation: {
        createImage: async (_, { input }) => {
            const newImage = new Image(input);
            return await newImage.save();
        },
        updateImage: async (_, { id, input }) => {
            return await Image.findByIdAndUpdate(id, input, { new: true });
        },
        deleteImage: async (_, { id }) => {
            return await Image.findByIdAndDelete(id);
        }
    }
};
