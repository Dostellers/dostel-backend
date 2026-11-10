const express = require('express');
const router = express.Router();

const paymentHooksService = require('../services/paymentHooks');

router.post('/webhook', (req, res) => {
  try {
    const { transactionId, status } = req.body;
    paymentHooksService.handlePaymentEvent(transactionId, status);
    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

module.exports = router;
