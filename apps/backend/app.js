const logger = require('./src/config/logger');
const { app, startServer } = require('./src');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

startServer().then(() => {
  app.listen(PORT, HOST, () => {
    logger.info(`Server started on http://${HOST}:${PORT}`);
  });
}).catch(err => {
  logger.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});
