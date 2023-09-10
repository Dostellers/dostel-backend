const Amenity = require('../models/amenity');

const amenityResolvers = {
    Query: {
        amenities: async () => {
            return await Amenity.find();
        },
        amenity: async (_, { id }) => {
            return await Amenity.findById(id);
        }
    },
    Mutation: {
        createAmenity: async (_, { input }) => {
            const newAmenity = new Amenity(input);
            return await newAmenity.save();
        },
        updateAmenity: async (_, { id, input }) => {
            return await Amenity.findByIdAndUpdate(id, input, { new: true });
        },
        deleteAmenity: async (_, { id }) => {
            return await Amenity.findByIdAndDelete(id);
        }
    }
};
