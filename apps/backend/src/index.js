const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');
const connectDB = require('./config/dbConfig');
const logger = require('./config/logger');
const mergedTypeDefs = require('./schema');
const { authenticate } = require('./middleware/authentication');
const authService = require('./services/authService');

const app = express();
app.use(authenticate);

async function startServer() {
  await connectDB();

  const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers,
    context: ({ req }) => {
      return { user: req.user };
    },
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { app, startServer };
