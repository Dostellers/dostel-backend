const Hostel = require('../models/hostel');
const Room = require('../models/room');
const reliability = require('../services/reliabilityService');
const { resolveRoomAvailability } = require('./roomAvailability');

const hostelResolvers = {
    Hostel: {
        /**
         * The measured reliability record (DOS-503).
         *
         * Computed on request rather than stored, so the published numbers can
         * always be re-derived from the raw events — which is the whole basis
         * for asking a guest to believe them.
         *
         * Only resolved when the query asks for it; hostel listings that do not
         * select `reliability` pay nothing for it.
         */
        reliability: async hostel => {
            const record = await reliability.buildReliability(hostel._id || hostel.id);

            // No telemetry at all reads as "no record", not as a perfect one.
            if (!record.totalObservations) return null;

            const { windows, ...rest } = record;
            return {
                ...rest,
                computedAt: record.computedAt.toISOString(),
                last7d: windows['7d'],
                last30d: windows['30d'],
                last90d: windows['90d']
            };
        }
    },

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
                    .populate('rooms.roomType')
                    .select('id slug name city tagline description pricePerNight isActive createdAt updatedAt rooms');

                return populated.map(hostel => {
                    const obj = hostel.toObject();
                    obj.id = obj._id.toString();
                    if (obj.rooms && obj.rooms.length > 0) {
                        obj.rooms = obj.rooms.map(room => {
                            const roomObj = room.toObject();
                            const roomTypeObj = room.roomType?.toObject?.() || {};
                            const roomType = {
                                id: roomTypeObj._id?.toString(),
                                name: roomTypeObj.name || null,
                                category: roomTypeObj.category || null,
                                capacity: roomTypeObj.capacity || 0,
                                basePrice: roomTypeObj.basePrice || 0.0
                            };
                            delete roomObj._id;
                            return {
                                ...roomObj,
                                roomType
                            };
                        });
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
                obj.rooms = obj.rooms.map(room => {
                    const roomObj = room.toObject();
                    const roomTypeObj = room.roomType?.toObject?.() || {};
                    const roomType = {
                        id: roomTypeObj._id?.toString(),
                        name: roomTypeObj.name || null,
                        category: roomTypeObj.category || null,
                        capacity: roomTypeObj.capacity || 0,
                        basePrice: roomTypeObj.basePrice || 0.0
                    };
                    delete roomObj._id;
                    return {
                        ...roomObj,
                        roomType
                    };
                });
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
        },
        roomAvailability: resolveRoomAvailability,
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
