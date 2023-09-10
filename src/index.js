const express = require('express');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema');
const resolvers = require('./resolvers');
const connectDB = require('./config/dbConfig');
const { logger } = require('./config/logger');

// Connect to the Database
connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context if any
});

const app = express();

// Apply Apollo GraphQL middleware and set the path to /graphql
server.applyMiddleware({ app, path: '/graphql' });

module.exports = app;
