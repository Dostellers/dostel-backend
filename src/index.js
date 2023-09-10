const logger = require('./config/logger');
const connectDB = require('./config/dbConfig');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

module.exports = {
    logger,
    connectDB,
    typeDefs,
    resolvers
    // ... any other utilities or configurations you want to export
};
