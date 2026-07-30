const assert = require('assert');
const Room = require('../src/models/room');
const roomResolvers = require('../src/resolvers/roomResolver');

const roomType = { id: 'type-1', name: 'Deluxe Dorm', basePrice: 1200 };
const rooms = [
    {
        id: 'room-1',
        roomType,
        status: 'available',
        reservations: [{ startDate: new Date('2026-08-02'), endDate: new Date('2026-08-05') }]
    },
    {
        id: 'room-2',
        roomType,
        status: 'occupied',
        reservations: []
    },
    {
        id: 'room-3',
        roomType,
        status: 'maintenance',
        reservations: []
    }
];

const originalFind = Room.find;

const run = async () => {
    Room.find = filter => {
        assert.deepStrictEqual(filter, { hostel: 'hostel-1' });
        return { populate: async path => {
            assert.strictEqual(path, 'roomType');
            return rooms;
        } };
    };

    const partial = await roomResolvers.Query.roomAvailability(null, {
        hostelId: 'hostel-1',
        checkIn: '2026-08-03',
        checkOut: '2026-08-04'
    });
    assert.deepStrictEqual(partial, [{
        roomType: 'Deluxe Dorm',
        totalRooms: 3,
        availableRooms: 1,
        price: 1200,
        roomId: 'room-2'
    }]);

    const boundary = await roomResolvers.Query.roomAvailability(null, {
        hostelId: 'hostel-1',
        checkIn: '2026-08-05',
        checkOut: '2026-08-06'
    });
    assert.strictEqual(boundary[0].availableRooms, 2);

    await assert.rejects(
        roomResolvers.Query.roomAvailability(null, {
            hostelId: 'hostel-1',
            checkIn: 'not-a-date',
            checkOut: '2026-08-06'
        }),
        /Check-in and check-out must be valid dates/
    );

    await assert.rejects(
        roomResolvers.Query.roomAvailability(null, {
            hostelId: 'hostel-1',
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
