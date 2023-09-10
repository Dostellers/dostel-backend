const Hostel = require('../models/Hostel');

const hostelResolvers = {
    Query: {
        hostels: async () => {
            return await Hostel.find()
                .populate('images.hero')
                .populate('images.main')
                .populate('images.thumbnail')
                .populate('images.others')
                .populate('amenities')
                .populate('faqs')
                .populate('blogs');
        },
        hostel: async (_, { id }) => {
            return await Hostel.findById(id)
                .populate('images.hero')
                .populate('images.main')
                .populate('images.thumbnail')
                .populate('images.others')
                .populate('amenities')
                .populate('faqs')
                .populate('blogs');
        },
        hostelsByAmenity: async (_, { amenityId }) => {
            return await Hostel.find({ amenities: amenityId })
                .populate('images.hero')
                .populate('images.main')
                .populate('images.thumbnail')
                .populate('images.others')
                .populate('amenities')
                .populate('faqs')
                .populate('blogs');
        },
        hostelsByLocation: async (_, { city }) => {
            return await Hostel.find({ 'location.address.city': city })
                .populate('images.hero')
                .populate('images.main')
                .populate('images.thumbnail')
                .populate('images.others')
                .populate('amenities')
                .populate('faqs')
                .populate('blogs');
        }
    },
    Mutation: {
        createHostel: async (_, { input }) => {
            const newHostel = new Hostel(input);
            return await newHostel.save();
        },
        updateHostel: async (_, { id, input }) => {
            return await Hostel.findByIdAndUpdate(id, input, { new: true })
                .populate('images.hero')
                .populate('images.main')
                .populate('images.thumbnail')
                .populate('images.others')
                .populate('amenities')
                .populate('faqs')
                .populate('blogs');
        },
        deleteHostel: async (_, { id }) => {
            return await Hostel.findByIdAndDelete(id);
        }
    }
};
