const assert = require('assert');
const Booking = require('../src/models/booking');
const Room = require('../src/models/room');

const run = async () => {
    const originalBookingCount = Booking.countDocuments;
    const originalRoomCount = Room.countDocuments;
    const bookingFilters = [];
    const roomFilters = [];

    try {
        Room.countDocuments = async filter => {
            roomFilters.push(filter);
            return filter.status === 'available' ? 6 : 2;
        };
        Booking.countDocuments = async filter => {
            bookingFilters.push(filter);
            if (filter.checkInDate) return 3;
            if (filter.checkOutDate) return 1;
            return 5;
        };

        const resolver = require('../src/resolvers/bookingResolver').Query.dashboardStats;
        const result = await resolver(null, {
            hostelId: 'hostel-1',
            dayStart: '2026-08-13T00:00:00.000Z',
            nextDayStart: '2026-08-14T00:00:00.000Z'
        });

        assert.deepStrictEqual(result, {
            occupancyPercent: 25,
            roomsAvailable: 6,
            checkInsToday: 3,
            checkOutsToday: 1,
            openBookings: 5
        });
        assert.deepStrictEqual(roomFilters, [
            { hostel: 'hostel-1', status: 'available' },
            { hostel: 'hostel-1', status: 'occupied' }
        ]);
        assert.deepStrictEqual(bookingFilters[0].sequenceStatus, { $nin: ['Draft', 'Abandoned'] });
        assert.deepStrictEqual(bookingFilters[0].checkInDate, {
            $gte: new Date('2026-08-13T00:00:00.000Z'),
            $lt: new Date('2026-08-14T00:00:00.000Z')
        });
        assert.deepStrictEqual(bookingFilters[1].checkOutDate, {
            $gte: new Date('2026-08-13T00:00:00.000Z'),
            $lt: new Date('2026-08-14T00:00:00.000Z')
        });
        assert.deepStrictEqual(bookingFilters[2], {
            hostel: 'hostel-1',
            sequenceStatus: { $in: ['Draft', 'Confirmed', 'CheckedIn'] }
        });

        Room.countDocuments = async () => 0;
        Booking.countDocuments = async () => 0;
        const emptyResult = await resolver(null, {
            dayStart: '2026-08-13T00:00:00.000Z',
            nextDayStart: '2026-08-14T00:00:00.000Z'
        });
        assert.strictEqual(emptyResult.occupancyPercent, 0);

        await assert.rejects(
            resolver(null, {
                dayStart: '2026-08-14T00:00:00.000Z',
                nextDayStart: '2026-08-13T00:00:00.000Z'
            }),
            /valid ascending boundaries/
        );
    } finally {
        Booking.countDocuments = originalBookingCount;
        Room.countDocuments = originalRoomCount;
    }
};

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
