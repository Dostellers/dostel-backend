const { Booking } = require('../models');

async function handlePaymentEvent(transactionId, status) {
  if (!transactionId) {
    throw new Error('transactionId is required');
  }

  // Find booking by transactionId inside payment object
  const booking = await Booking.findOne({
    'payment.transactionId': transactionId
  });

  if (!booking) {
    throw new Error(`Booking with transactionId "${transactionId}" not found`);
  }

  // Update the payment status (and optionally sequenceStatus on completion)
  const update = {
    payment: {
      ...booking.payment,
      status
    }
  };

  // If payment is completed, mark the overall booking status as Completed
  if (status.toLowerCase() === 'completed') {
    update.sequenceStatus = 'Completed';
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    booking._id,
    update,
    { new: true, runValidators: true }
  );

  return updatedBooking;
}

module.exports = { handlePaymentEvent };