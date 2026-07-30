const assert = require('assert');
const Hostel = require('../src/models/hostel');
const Room = require('../src/models/room');

const createRejectedQuery = error => {
    const query = {
        sort: () => query,
        populate: () => query,
        then: (_, reject) => Promise.reject(error).then(undefined, reject)
    };
    return query;
};

const run = async () => {
    const originalHostelFind = Hostel.find;
    const originalRoomFind = Room.find;

    try {
        const hostelError = new Error('hostel query failed');
        const roomError = new Error('room query failed');
        Hostel.find = () => createRejectedQuery(hostelError);
        Room.find = () => createRejectedQuery(roomError);

        const hostelResolvers = require('../src/resolvers/hostelResolver');
        const roomResolvers = require('../src/resolvers/roomResolver');

        assert.deepStrictEqual(await hostelResolvers.Query.hostels(), []);
        assert.deepStrictEqual(await roomResolvers.Query.rooms(null, {}), []);
    } finally {
        Hostel.find = originalHostelFind;
        Room.find = originalRoomFind;
    }
};

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
