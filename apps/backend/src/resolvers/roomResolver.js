const mongoose = require('mongoose');
const Room = require('../models/room');
const RoomType = require('../models/RoomType');
const Hostel = require('../models/hostel');
const roomAvailabilityResolver = require('./roomAvailabilityResolver');

const populateRoom = query => query
    .populate('amenities')
    .populate('images')
    .populate('hostel')
    .populate('roomType')
    .select('-__v');

const populateRoomType = query => query.populate('hostel');

const parseAvailabilityRange = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error('Check-in and check-out must be valid dates');
    }
    if (start >= end) {
        throw new Error('Check-out must be after check-in');
    }
    return { start, end };
};

const isRoomAvailable = (room, start, end) => {
    if (['maintenance', 'out_of_order'].includes(room.status)) return false;
    
    // Use new bookings array if available, fallback to reservations for backward compatibility
    const bookings = room.bookings || room.reservations || [];
    
    return !bookings.some(booking => {
        const bookingStart = new Date(booking.checkIn || booking.startDate).getTime();
        const bookingEnd = new Date(booking.checkOut || booking.endDate).getTime();
        return bookingStart < end.getTime() && bookingEnd > start.getTime();
    });
};

const serializeRoom = (room) => ({
    ...room.toObject(),
    id: room._id.toString(),
    roomType: room.roomType ? {
        id: room.roomType._id.toString(),
        name: room.roomType.name,
        category: room.roomType.category,
        basePrice: room.roomType.basePrice,
        hostel: room.roomType.hostel ? room.roomType.hostel._id.toString() : null
    } : null,
    hostel: room.hostel ? room.hostel._id.toString() : null
});

const buildRoomAvailability = (rooms, checkIn, checkOut) => {
    const { start, end } = parseAvailabilityRange(checkIn, checkOut);
    const groups = new Map();

    rooms.forEach(room => {
        const key = room.roomType ? room.roomType._id.toString() : null;
        const roomType = room.roomType ? room.roomType.name : room.type || 'Room';
        const price = room.roomType ? room.roomType.basePrice : room.price || 0;
        const current = groups.get(key) || {
            roomType,
            totalRooms: 0,
            availableRooms: 0,
            pricePerNight: price,
            roomId: room.id
        };
        current.totalRooms += 1;
        if (isRoomAvailable(room, start, end)) {
            current.availableRooms += 1;
            current.roomId = room.id;
        }
        groups.set(key, current);
    });

    return Array.from(groups.values()).sort((left, right) => left.roomType.localeCompare(right.roomType));
};

const requireDocument = (document, label) => {
    if (!document) {
        throw new Error(`${label} not found`);
    }
    return document;
};

const validateHostel = async hostelId => {
    requireDocument(await Hostel.findById(hostelId), 'Hostel');
};

const validateRoomTypeHostel = async input => {
    if (!input.roomType) {
        return;
    }

    const roomType = requireDocument(await RoomType.findById(input.roomType), 'Room type');
    if (input.hostel && roomType.hostel.toString() !== input.hostel.toString()) {
        throw new Error('Room type must belong to the selected hostel');
    }
};

const roomResolvers = {
    Query: {
        roomTypes: async (_, { hostel }) => {
            const filter = hostel ? { hostel } : {};
            return await populateRoomType(RoomType.find(filter).sort({ name: 1 }));
        },
        roomType: async (_, { id }) => {
            return await populateRoomType(RoomType.findById(id));
        },
        rooms: async (_, { filter = {} }) => {
            const query = {};
            if (filter.hostel) query.hostel = filter.hostel;
            if (filter.status) query.status = filter.status;
            try {
                return await populateRoom(Room.find(query).sort({ number: 1 }));
            } catch (error) {
                return [];
            }
        },
        room: async (_, { id }) => {
            return await populateRoom(Room.findById(id));
        },
        roomsByHostel: async (_, { hostelId }) => {
            return await populateRoom(Room.find({ hostel: hostelId }).sort({ number: 1 }));
        },
        roomsByType: async (_, { type }) => {
            return await populateRoom(Room.find({ type }));
        },
        roomAvailability: async (_, { hostelId, checkIn, checkOut }) => {
            parseAvailabilityRange(checkIn, checkOut);
            try {
                const hostelObjectId = new mongoose.Types.ObjectId(hostelId);
                const rooms = await Room.find({ hostel: hostelObjectId }).populate('roomType');
                return buildRoomAvailability(rooms, checkIn, checkOut);
            } catch (error) {
                // If hostelId is not a valid ObjectId, return empty array
                return [];
            }
        }
    },
    Mutation: {
        createRoomType: async (_, { input }) => {
            if (input.hostel) input.hostel = new mongoose.Types.ObjectId(input.hostel);
            const roomType = await new RoomType(input).save();
            return await populateRoomType(RoomType.findById(roomType.id));
        },
        updateRoomType: async (_, { id, input }) => {
            const currentRoomType = requireDocument(await RoomType.findById(id), 'Room type');
            if (input.hostel && input.hostel.toString() !== currentRoomType.hostel.toString() && await Room.exists({ roomType: id })) {
                throw new Error('Cannot move a room type while it is assigned to rooms');
            }
            const roomType = await populateRoomType(RoomType.findByIdAndUpdate(id, input, {
                new: true,
                runValidators: true
            }));
            return requireDocument(roomType, 'Room type');
        },
        deleteRoomType: async (_, { id }) => {
            if (await Room.exists({ roomType: id })) {
                throw new Error('Room type is assigned to one or more rooms');
            }
            return Boolean(await RoomType.findByIdAndDelete(id));
        },
        createRoom: async (_, { input }) => {
            await validateHostel(input.hostel);
            await validateRoomTypeHostel(input);
            const room = await new Room(input).save();
            return await populateRoom(Room.findById(room.id));
        },
        updateRoom: async (_, { id, input }) => {
            const currentRoom = requireDocument(await Room.findById(id), 'Room');
            const hostel = input.hostel || currentRoom.hostel;
            await validateHostel(hostel);
            await validateRoomTypeHostel({
                roomType: input.roomType || currentRoom.roomType,
                hostel
            });
            const room = await populateRoom(Room.findByIdAndUpdate(id, input, {
                new: true,
                runValidators: true
            }));
            return requireDocument(room, 'Room');
        },
        updateRoomStatus: async (_, { id, status }) => {
            const room = await populateRoom(Room.findByIdAndUpdate(id, { status }, {
                new: true,
                runValidators: true
            }));
            return requireDocument(room, 'Room');
        },
        deleteRoom: async (_, { id }) => {
            return Boolean(await Room.findByIdAndDelete(id));
        },
        reserveRoom: async (_, { roomId, reservation }) => {
            const room = requireDocument(await Room.findById(roomId), 'Room');
            room.reservations.push(reservation);
            await room.save();
            return await populateRoom(Room.findById(room.id));
        },
        createRoomBooking: async (_, { roomId, input }) => {
            const room = requireDocument(await Room.findById(roomId), 'Room');
            const booking = {
                guestName: input.guestName,
                guestEmail: input.guestEmail,
                guestPhone: input.guestPhone || null,
                checkIn: input.checkIn,
                checkOut: input.checkOut,
                status: input.status || 'confirmed',
                totalPrice: input.totalPrice || null,
                specialRequests: input.specialRequests || null,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            room.bookings.push(booking);
            await room.save();
            return await populateRoom(Room.findById(room.id));
        },
        updateRoomBooking: async (_, { roomId, bookingId, input }) => {
            const room = requireDocument(await Room.findById(roomId), 'Room');
            const booking = room.bookings.id(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }
            if (input.guestName !== undefined) booking.guestName = input.guestName;
            if (input.guestEmail !== undefined) booking.guestEmail = input.guestEmail;
            if (input.guestPhone !== undefined) booking.guestPhone = input.guestPhone;
            if (input.checkIn !== undefined) booking.checkIn = input.checkIn;
            if (input.checkOut !== undefined) booking.checkOut = input.checkOut;
            if (input.status !== undefined) booking.status = input.status;
            if (input.totalPrice !== undefined) booking.totalPrice = input.totalPrice;
            if (input.specialRequests !== undefined) booking.specialRequests = input.specialRequests;
            booking.updatedAt = new Date();
            await room.save();
            return await populateRoom(Room.findById(room.id));
        },
        cancelRoomBooking: async (_, { roomId, bookingId }) => {
            const room = requireDocument(await Room.findById(roomId), 'Room');
            const booking = room.bookings.id(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }
            booking.status = 'cancelled';
            await room.save();
            return await populateRoom(Room.findById(room.id));
        },
        deleteRoomBooking: async (_, { roomId, bookingId }) => {
            const room = requireDocument(await Room.findById(roomId), 'Room');
            const result = room.bookings.pull(bookingId);
            if (!result) {
                throw new Error('Booking not found');
            }
            await room.save();
            return true;
        }
    }
};

module.exports = roomResolvers;
