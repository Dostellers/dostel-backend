const { GraphQLError } = require('graphql');

const inventoryError = (message, code) => new GraphQLError(message, { extensions: { code } });

const buildStayDateKeys = (checkIn, checkOut) => {
    const start = new Date(`${checkIn}T00:00:00Z`);
    const end = new Date(`${checkOut}T00:00:00Z`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw inventoryError('Check-in and check-out must be valid dates', 'INVALID_DATE_RANGE');
    }
    if (start >= end) {
        throw inventoryError('Check-out must be after check-in', 'INVALID_DATE_RANGE');
    }

    const dates = [];
    for (const current = new Date(start); current < end; current.setUTCDate(current.getUTCDate() + 1)) {
        dates.push(current.toISOString().slice(0, 10));
    }
    return dates;
};

module.exports = { buildStayDateKeys, inventoryError };
