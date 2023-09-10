const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const { logger, connectDB, typeDefs, resolvers } = require('./src');

const app = express();

// Use body parser
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
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
