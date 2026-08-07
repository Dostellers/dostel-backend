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
const adminRouter = require('./routes/admin');
const portalRouter = require('./routes/portal');
const whatsappRouter = require('./routes/whatsapp');
const telemetryRouter = require('./routes/telemetry');

const app = express();

// Trust the property router/proxy so req.ip is the guest device, not the LAN hop.
app.set('trust proxy', true);

// Captive portal (DOS-501) is mounted before `authenticate`: guests have no
// token and no internet at this point. The router applies its own rate limiting
// and body parsing.
app.use('/api/portal', portalRouter);

// WhatsApp staff capture (DOS-502) also mounts before `authenticate`: Meta
// authenticates by signing the raw body, not with our tokens, and the router
// needs that body unparsed.
app.use('/api/whatsapp', whatsappRouter);

// Reliability telemetry (DOS-503). The ingest side authenticates with a per-device
// HMAC over the raw body; the read side is deliberately public, since a
// reliability record a guest cannot check is worth nothing.
app.use('/api/telemetry', telemetryRouter);

app.use(authenticate);

// Admin routes
app.use('/api/admin', adminRouter);

async function startServer() {
  await connectDB();

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers,
  context: ({ req }) => {
    return { user: req.user };
  },
  cache: 'bounded',
  persistedQueries: false
});

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { app, startServer };
