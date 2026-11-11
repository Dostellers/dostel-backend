const Booking = require('../models/booking');
const Customer = require('../models/customer');
const Hostel = require('../models/hostel');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');
// Existing paymentService (called by booking/checkout helpers). Extends deposit math
// with Hostelworld rate schedules from ratePlanService — schema: Booking deposit/rate fields.
// User: "learn architecture and payment methods and architeuse from hostel world and build it."
const {
  resolvePaymentSchedule,
  paymentStatusForAmount,
  RATE_TYPES,
} = require('./ratePlanService');

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

    const schedule = resolvePaymentSchedule(
      bookingData.rateType || RATE_TYPES.FREE_CANCELLATION,
      totalAmount,
      paymentMethod
    );
    // Deposit capture by default; full amount only for Pay Now / explicit full pay
    const amountPaid = paymentTransactionId
      ? (schedule.balanceCollection === 'PREPAID' ? totalAmount : schedule.depositRequired)
      : 0;
    const balanceDue = Math.max(totalAmount - amountPaid, 0);

    let sequenceStatus = 'Draft';
    if (paymentStatus === 'Completed' || amountPaid >= totalAmount || amountPaid >= schedule.depositRequired) {
      sequenceStatus = 'Confirmed';
    }

    const bookingDataObj = {
      reference: reference || `DOS-${Date.now()}-${uuidv4().substring(0, 8)}`,
      customer: customer._id,
      hostel: hostelId,
      roomType,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      guests,
      totalAmount,
      rateType: schedule.rateType,
      depositPercentage: schedule.depositPercentage,
      depositRequired: schedule.depositRequired,
      amountPaid,
      balanceDue,
      payAtProperty: schedule.payAtProperty,
      balanceCollection: schedule.balanceCollection,
      refundable: schedule.refundable,
      refundAs: schedule.refundAs,
      cancellationDeadlineHours: schedule.cancellationDeadlineHours,
      cancellationPolicy: schedule.cancellationPolicy,
      payment: {
        status: paymentStatus === 'Completed'
          ? paymentStatusForAmount(amountPaid, schedule.depositRequired, totalAmount)
          : paymentStatus,
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

    const schedule = resolvePaymentSchedule(
      booking.rateType || RATE_TYPES.FREE_CANCELLATION,
      booking.totalAmount,
      method || booking.payment?.method
    );

    if (method) booking.payment.method = method;
    if (transactionId) booking.payment.transactionId = transactionId;
    if (amount != null) {
      booking.payment.amount = amount;
      booking.amountPaid = amount;
    }

    booking.depositRequired = schedule.depositRequired;
    booking.depositPercentage = schedule.depositPercentage;
    booking.balanceDue = Math.max(booking.totalAmount - (booking.amountPaid || 0), 0);
    booking.payAtProperty = schedule.balanceCollection === 'PREPAID'
      ? 0
      : Math.max(booking.totalAmount - Math.max(booking.amountPaid || 0, schedule.depositRequired), 0);
    booking.balanceCollection = schedule.balanceCollection;
    booking.payment.status = status || paymentStatusForAmount(
      booking.amountPaid,
      schedule.depositRequired,
      booking.totalAmount
    );

    if (
      booking.payment.status === 'Completed' ||
      (booking.amountPaid || 0) >= booking.totalAmount ||
      (booking.amountPaid || 0) >= schedule.depositRequired
    ) {
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