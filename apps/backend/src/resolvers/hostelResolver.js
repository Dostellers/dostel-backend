const Hostel = require('../models/hostel');

const hostelResolvers = {
    Query: {
        hostels: async () => {
            try {
                const populated = await Hostel.find()
                    .populate('images.hero')
                    .populate('images.main')
                    .populate('images.thumbnail')
                    .populate('images.others')
                    .populate('amenities')
                    .populate('faqs')
                    .populate('blogs')
                    .populate('rooms')
                    .select('id slug name city tagline description createdAt updatedAt rooms');

                return populated.map(hostel => {
                    const obj = hostel.toObject();
                    obj.id = obj._id.toString();
                    if (obj.rooms && obj.rooms.length > 0) {
                        obj.rooms = obj.rooms.map(room => ({
                            ...room.toObject(),
                            id: room._id.toString(),
                            roomType: room.roomType?.id?.toString() || room.roomType
                        }));
                    }
                    return obj;
                });
            } catch (error) {
                return [];
            }
        },
        hostel: async (_, { id }) => {
            const hostel = await Hostel.findById(id)
                .populate('images.hero')
                .populate('images.main')
                .populate('images.thumbnail')
                .populate('images.others')
                .populate('amenities')
                .populate('faqs')
                .populate('blogs')
                .populate('rooms');

            if (!hostel) return null;
            const obj = hostel.toObject();
            obj.id = obj._id.toString();
            if (obj.rooms && obj.rooms.length > 0) {
                obj.rooms = obj.rooms.map(room => ({
                    ...room.toObject(),
                    id: room._id.toString(),
                    roomType: room.roomType?.id?.toString() || room.roomType
                }));
            }
            return obj;
        },
        hostelsByAmenity: async (_, { amenityId }) => {
            const populated = await Hostel.find({ amenities: amenityId })
                .populate('images.hero')
                .populate('images.main')
                .populate('images.thumbnail')
                .populate('amenities')
                .populate('faqs')
                .populate('blogs');

            return populated.map(hostel => {
                const obj = hostel.toObject();
                obj.id = obj._id.toString();
                return obj;
            });
        },
        hostelsByLocation: async (_, { city }) => {
            const populated = await Hostel.find({ 'location.address.city': city })
                .populate('images.hero')
                .populate('images.main')
                .populate('images.thumbnail')
                .populate('amenities')
                .populate('faqs')
                .populate('blogs');

            return populated.map(hostel => {
                const obj = hostel.toObject();
                obj.id = obj._id.toString();
                return obj;
            });
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

module.exports = hostelResolvers;
