const mongoose = require('mongoose');

const healthResolvers = {
    Query: {
        health: async () => {
            const dbState = mongoose.connection.readyState;
            const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

            return {
                status: 'ok',
                database: states[dbState] || 'unknown',
                uptime: process.uptime(),
                timestamp: new Date().toISOString()
            };
        }
    }
};

module.exports = healthResolvers;
