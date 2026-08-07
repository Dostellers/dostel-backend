const assert = require('assert');
const mongoose = require('mongoose');
const Room = require('../src/models/room');
const roomResolvers = require('../src/resolvers/roomResolver');

const RoomId = mongoose.Types.ObjectId;

// Test data with proper roomType structure for mock
const roomId = new RoomId('507f1f77bcf86cd799439011');
const hostelId = new RoomId('507f1f77bcf86cd799439010');

const rooms = [
    {
        _id: new RoomId('507f1f77bcf86cd799439012'),
        id: '507f1f77bcf86cd799439012',
        roomType: {
            _id: roomId,
            id: roomId.toString(),
            name: 'Deluxe Dorm',
            category: 'dorm',
            capacity: 2,
            basePrice: 1200,
            hostel: hostelId
        },
        status: 'available',
        reservations: [{ startDate: new Date('2026-08-02'), endDate: new Date('2026-08-05'), bookingReference: 'ref1' }],
        hostel: roomId
    },
    {
        _id: new RoomId('507f1f77bcf86cd799439013'),
        id: '507f1f77bcf86cd799439013',
        roomType: {
            _id: roomId,
            id: roomId.toString(),
            name: 'Deluxe Dorm',
            category: 'dorm',
            capacity: 2,
            basePrice: 1200,
            hostel: hostelId
        },
        status: 'occupied',
        reservations: [],
        hostel: roomId
    },
    {
        _id: new RoomId('507f1f77bcf86cd799439014'),
        id: '507f1f77bcf86cd799439014',
        roomType: {
            _id: roomId,
            id: roomId.toString(),
            name: 'Deluxe Dorm',
            category: 'dorm',
            capacity: 2,
            basePrice: 1200,
            hostel: hostelId
        },
        status: 'maintenance',
        reservations: [],
        hostel: roomId
    }
];

const originalFind = Room.find;

Room.find = filter => {
    const roomsCopy = [...rooms];
    return {
        populate: async path => {
            return roomsCopy;
        }
    };
};

const run = async () => {
    const partial = await roomResolvers.Query.roomAvailability(null, {
        hostelId: hostelId.toString(),
        checkIn: '2026-08-03',
        checkOut: '2026-08-04'
    });
    
    assert.strictEqual(partial.length, 1);
    const result = partial[0];
    assert.strictEqual(result.roomType, 'Deluxe Dorm');
    assert.strictEqual(result.totalRooms, 3);
    assert.strictEqual(result.availableRooms, 1);
    assert.strictEqual(result.pricePerNight, 1200);
    assert.strictEqual(result.roomId, '507f1f77bcf86cd799439013');

    const boundary = await roomResolvers.Query.roomAvailability(null, {
        hostelId: hostelId.toString(),
        checkIn: '2026-08-05',
        checkOut: '2026-08-06'
    });
    assert.strictEqual(boundary[0].availableRooms, 2);

    await assert.rejects(
        roomResolvers.Query.roomAvailability(null, {
            hostelId: hostelId.toString(),
            checkIn: 'not-a-date',
            checkOut: '2026-08-06'
        }),
        /Check-in and check-out must be valid dates/
    );

    await assert.rejects(
        roomResolvers.Query.roomAvailability(null, {
            hostelId: hostelId.toString(),
            checkIn: '2026-08-06',
            checkOut: '2026-08-06'
        }),
        /Check-out must be after check-in/
    );
};

run().finally(() => {
    Room.find = originalFind;
}).catch(error => {
    console.error(error);
    process.exitCode = 1;
});