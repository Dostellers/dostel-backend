const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { config } = require('./config');
const { logger } = require('./config/logger');

// Import typeDefs and resolvers
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers'); // Assuming you have an index.js in resolvers that exports all resolvers

const app = express();

// Use body parser
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  logger.info('MongoDB connected successfully.');
}).catch((error) => {
  logger.error('Error connecting to MongoDB: ', error);
});

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Here you can extract user information from the request, for authentication/authorization purposes
    return {
      // user: ...
    };
  }
});

// Apply Apollo GraphQL middleware and set the path to /graphql
server.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
});

module.exports = app;
