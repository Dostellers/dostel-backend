const app = require('./src'); // Import the initialized Express app from src/index.js
const { logger } = require('./src/config/logger');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`);
});
