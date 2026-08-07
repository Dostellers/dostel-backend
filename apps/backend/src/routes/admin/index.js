const express = require('express');

const router = express.Router();

// Import all admin routes
const bookingsRouter = require('./bookings');
const customersRouter = require('./customers');
const hostelsRouter = require('./hostels');
const roomsRouter = require('./rooms');
const paymentsWebhookRouter = require('./payments-webhook');

// Register routes under /api/admin
router.use('/bookings', bookingsRouter);
router.use('/customers', customersRouter);
router.use('/hostels', hostelsRouter);
router.use('/rooms', roomsRouter);
router.use('/payments-webhook', paymentsWebhookRouter);

module.exports = router;