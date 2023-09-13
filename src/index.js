const express = require('express');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');
const connectDB = require('./config/dbConfig');
const { logger } = require('./config/logger');
const mergedTypeDefs = require('./schema');

// Connect to the Database
connectDB();

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers,
  // context if any
});

const app = express();

async function startServer() {
  await server.start(); // Start the Apollo Server

  // Apply Apollo GraphQL middleware and set the path to /graphql
  server.applyMiddleware({ app, path: '/graphql' });
}

startServer(); // Call the async function to start the server

module.exports = app; // Export the Express app
