const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Require models to register them with Mongoose
require('./src/models/user');
require('./src/models/hostel');
require('./src/models/room');
require('./src/models/booking');
require('./src/models/customer');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Serve frontend static files when on port 3001
app.use(express.static(path.join(__dirname, '..', '..', 'apps', 'frontend', 'dist')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});