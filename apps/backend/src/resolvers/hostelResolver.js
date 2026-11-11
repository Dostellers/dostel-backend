const Hostel = require('../models/hostel');
const Room = require('../models/room');
const RoomType = require('../models/RoomType');
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
                require('../models/RoomType');
                const populated = await Hostel.find({ isActive: { $ne: false } })
                    .populate({
                        path: 'rooms',
                        populate: { path: 'roomType' },
                    })
                    .select('slug name city tagline knownFor featuredOnLanding boardPriority coverImageUrl mapX mapY description pricePerNight isActive inauguratedOn createdAt updatedAt rooms');

                return populated.map(hostel => {
                    const obj = hostel.toObject();
                    obj.id = obj._id.toString();
                    if (obj.rooms && obj.rooms.length > 0) {
                        obj.rooms = obj.rooms.map(room => {
                            const roomObj = room.toObject ? room.toObject() : { ...room };
                            const roomTypeObj = room.roomType?.toObject?.() || room.roomType || {};
                            const roomType = {
                                id: roomTypeObj._id?.toString?.() || roomTypeObj.id || null,
                                name: roomTypeObj.name || null,
                                category: roomTypeObj.category || null,
                                capacity: roomTypeObj.capacity || 0,
                                basePrice: roomTypeObj.basePrice || 0.0
                            };
                            return {
                                ...roomObj,
                                id: roomObj._id?.toString?.() || roomObj.id,
                                roomType
                            };
                        });
                    } else {
                        obj.rooms = [];
                    }
                    return obj;
                });
            } catch (error) {
                console.error('[hostels query]', error && error.message ? error.message : error);
                // Fail soft for listings, but keep enough shape for the guest grid.
                const fallback = await Hostel.find({ isActive: { $ne: false } })
                    .select('slug name city tagline knownFor featuredOnLanding boardPriority coverImageUrl mapX mapY pricePerNight isActive inauguratedOn createdAt updatedAt')
                    .lean();
                return fallback.map((h) => ({
                    ...h,
                    id: String(h._id),
                    rooms: [],
                }));
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
