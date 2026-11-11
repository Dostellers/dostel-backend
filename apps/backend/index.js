const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./src/resolvers');
const connectDB = require('./src/config/dbConfig');
const logger = require('./src/config/logger');
const mergedTypeDefs = require('./src/schema');
const { authenticate } = require('./src/middleware/authentication');
const authService = require('./src/services/authService');
const adminRouter = require('./src/routes/admin');
const portalRouter = require('./src/routes/portal');
const whatsappRouter = require('./src/routes/whatsapp');
const telemetryRouter = require('./src/routes/telemetry');
const authRouter = require('./src/routes/auth');  // Added for DOS-32 authentication fix

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
    return {
      user: req.user,
      editKey: req.headers['x-dostel-edit-key'] || null,
    };
  },
  cache: 'bounded',
  persistedQueries: false,
  introspection: true
});

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = { app, startServer };