const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');

const createBooking = async (bookingData) => {
  try {
    // Validate dates
    if (!isValidDateRange(bookingData.checkInDate, bookingData.checkOutDate)) {
      throw new Error('Invalid date range');
    }

    // Check room availability
    const roomCheck = await checkRoomAvailability(bookingData.hostelId, bookingData.roomType, bookingData.checkInDate, bookingData.checkOutDate);
    if (!roomCheck.available) {
      throw new Error('No rooms available for selected dates');
    }

    // Process payment (simplified)
    const paymentResult = await processPayment(bookingData.totalAmount);
    if (!paymentResult.success) {
      throw new Error('Payment failed');
    }

    // Create booking document
    const newBooking = new Booking({
      ...bookingData,
      payment: { status: 'success', method: 'credit_card', transactionId: paymentResult.id }
    });

    await newBooking.save();
    return newBooking;
  } catch (error) {
    console.error('Booking creation failed:', error.message);
    throw error;
  }
};

module.exports = {
  createBooking
};
