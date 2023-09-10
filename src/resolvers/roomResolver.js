const Room = require('../models/Room');

const roomResolvers = {
    Query: {
        rooms: async () => {
            return await Room.find().populate('amenities').populate('images').populate('hostel');
        },
        room: async (_, { id }) => {
            return await Room.findById(id).populate('amenities').populate('images').populate('hostel');
        },
        roomsByHostel: async (_, { hostelId }) => {
            return await Room.find({ hostel: hostelId }).populate('amenities').populate('images');
        },
        roomsByType: async (_, { type }) => {
            return await Room.find({ type }).populate('amenities').populate('images').populate('hostel');
        }
    },
    Mutation: {
        createRoom: async (_, { input }) => {
            const newRoom = new Room(input);
            return await newRoom.save();
        },
        updateRoom: async (_, { id, input }) => {
            return await Room.findByIdAndUpdate(id, input, { new: true }).populate('amenities').populate('images').populate('hostel');
        },
        deleteRoom: async (_, { id }) => {
            return await Room.findByIdAndDelete(id);
        },
        reserveRoom: async (_, { roomId, reservation }) => {
            const room = await Room.findById(roomId);
            room.reservations.push(reservation);
            return await room.save();
        }
    }
};
