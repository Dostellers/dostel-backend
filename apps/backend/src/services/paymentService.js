const Booking = require('../models/booking');
const Customer = require('../models/customer');
const Hostel = require('../models/hostel');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

/**
 * Create a booking with guest details and payment info
 * @param {Object} bookingData - The booking data including customer info, hostel, dates, etc.
 * @returns {Promise<Object>} - The created booking object
 */
const createBookingWithPayment = async (bookingData) => {
  try {
    const {
      reference,
      fullName,
      email,
      phone,
      specialRequests,
      govtIdType,
      govtIdNumber,
      hostelId,
      roomType,
      checkInDate,
      checkOutDate,
      guests,
      totalAmount,
      paymentMethod,
      paymentTransactionId,
      paymentStatus = 'Pending'
    } = bookingData;

    // Validate required fields
    if (!reference || !fullName || !email || !phone || !hostelId || !roomType || !checkInDate || !checkOutDate || !guests || !totalAmount) {
      throw new Error('Missing required booking fields');
    }

    // Check if customer exists or create new one
    let customer = await Customer.findOne({ email });
    if (!customer) {
      customer = await Customer.create({
        fullName,
        email,
        phone,
        govtIdType,
        govtIdNumber
      });
    }

    // Calculate deposit and balance
    const depositPercentage = paymentMethod === 'UPI' ? 25 : 20;
    const depositRequired = (totalAmount * depositPercentage) / 100;
    const amountPaid = paymentTransactionId ? totalAmount : 0; // For now, assume full payment if transaction ID exists
    const balanceDue = totalAmount - amountPaid;

    // Determine booking status based on payment
    let sequenceStatus = 'Draft';
    if (paymentStatus === 'Completed' || amountPaid >= totalAmount) {
      sequenceStatus = 'Confirmed';
    } else if (amountPaid >= depositRequired) {
      sequenceStatus = 'Confirmed';
    }

    // Create booking
    const bookingDataObj = {
      reference: reference || `DOS-${Date.now()}-${uuidv4().substring(0, 8)}`,
      customer: customer._id,
      hostel: hostelId,
      roomType,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      guests,
      totalAmount,
      depositPercentage,
      depositRequired,
      amountPaid,
      balanceDue,
      payment: {
        status: paymentStatus,
        method: paymentMethod,
        transactionId: paymentTransactionId,
        amount: amountPaid,
        documentType: 'PaymentNote'
      },
      sequenceStatus,
      specialRequests: specialRequests || '',
      source: {
        name: 'Website',
        referenceId: bookingData.sourceReferenceId || `WEB-${Date.now()}`,
        additionalInfo: {}
      }
    };

    const newBooking = new Booking(bookingDataObj);
    const savedBooking = await newBooking.save();

    logger.info(`Booking created: ${savedBooking.reference} for customer ${customer.email}`);
    return savedBooking;
  } catch (error) {
    logger.error('Error creating booking with payment:', error);
    throw error;
  }
};

/**
 * Update booking payment status
 * @param {string} bookingId - The booking ID
 * @param {Object} paymentData - Payment details including status, method, transactionId
 * @returns {Promise<Object>} - Updated booking object
 */
const updateBookingPayment = async (bookingId, paymentData) => {
  try {
    const { status, method, transactionId, amount } = paymentData;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }

    // Update payment details
    booking.payment.status = status;
    if (method) booking.payment.method = method;
    if (transactionId) booking.payment.transactionId = transactionId;
    if (amount) booking.payment.amount = amount;
    booking.amountPaid = amount || booking.amountPaid;
    booking.balanceDue = booking.totalAmount - (amount || booking.amountPaid);

    // Update sequence status based on payment
    if (status === 'Completed' || (amount || booking.amountPaid) >= booking.totalAmount) {
      booking.sequenceStatus = 'Confirmed';
    } else if ((amount || booking.amountPaid) >= booking.depositRequired) {
      booking.sequenceStatus = 'Confirmed';
    } else {
      booking.sequenceStatus = 'Draft';
    }

    const updatedBooking = await booking.save();
    logger.info(`Payment updated for booking: ${updatedBooking.reference}`);
    return updatedBooking;
  } catch (error) {
    logger.error('Error updating booking payment:', error);
    throw error;
  }
};

/**
 * Get booking by reference
 * @param {string} reference - The booking reference
 * @returns {Promise<Object>} - The booking object
 */
const getBookingByReference = async (reference) => {
  try {
    const booking = await Booking.findOne({ reference })
      .populate('customer')
      .populate('hostel')
      .exec();
    
    if (!booking) {
      throw new Error(`Booking with reference ${reference} not found`);
    }
    
    return booking;
  } catch (error) {
    logger.error('Error fetching booking by reference:', error);
    throw error;
  }
};

module.exports = {
  createBookingWithPayment,
  updateBookingPayment,
  getBookingByReference
};