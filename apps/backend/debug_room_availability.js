const mongoose = require('mongoose');
const Room = require('./src/models/room');
const roomResolvers = require('./src/resolvers/roomResolver');

const roomType = { id: 'type-1', name: 'Deluxe Dorm', basePrice: 1200 };
const rooms = [
    {
        _id: { toString: () => 'room-1' },
        id: 'room-1',
        roomType: { ...roomType, hostel: { _id: { toString: () => 'hostel-1' } } },
        status: 'available',
        reservations: [{ startDate: new Date('2026-08-02'), endDate: new Date('2026-08-05'), bookingReference: 'ref1' }],
        hostel: { _id: { toString: () => 'hostel-1' } }
    },
    {
        _id: { toString: () => 'room-2' },
        id: 'room-2',
        roomType: { ...roomType, hostel: { _id: { toString: () => 'hostel-1' } } },
        status: 'occupied',
        reservations: [],
        hostel: { _id: { toString: () => 'hostel-1' } }
    },
    {
        _id: { toString: () => 'room-3' },
        id: 'room-3',
        roomType: { ...roomType, hostel: { _id: { toString: () => 'hostel-1' } } },
        status: 'maintenance',
        reservations: [],
        hostel: { _id: { toString: () => 'hostel-1' } }
    }
];

const originalFind = Room.find;

Room.find = filter => {
    console.log('Room.find called with filter:', JSON.stringify(filter));
    return {
        populate: async path => {
            console.log('populate called with path:', path);
            console.log('Returning rooms:', JSON.stringify(rooms.map(r => ({ id: r.id, status: r.status }))));
            return {
                toObject: () => rooms[0],
                forEach: (fn) => rooms.forEach(fn),
                map: (fn) => rooms.map(fn)
            };
        }
    };
};

(async () => {
    try {
        const result = await roomResolvers.Query.roomAvailability(null, {
            hostelId: 'hostel-1',
            checkIn: '2026-08-03',
            checkOut: '2026-08-04'
        });
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
    } finally {
        Room.find = originalFind;
    }
})();
