const Booking = require('../models/booking');
const Customer = require('../models/customer');
const ReminderLog = require('../models/reminderLog');
const { sendEmail } = require('./emailService');
const logger = require('../config/logger');

const daysBetween = (d1, d2) => {
  const diff = new Date(d2) - new Date(d1);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const sendReminder = async (customer, booking, daysLeft) => {
  const subject = `Dostel: Balance Reminder - ${daysLeft} day(s) until check-in`;
  const html = `<p>Dear ${customer.fullName || customer.email},</p><p>This is a reminder that you have a booking at Dostel (Ref: ${booking.reference}) with ${daysLeft} day(s) until check-in on ${booking.checkInDate.toDateString()}.</p><p>Balance due: ₹${booking.balanceDue}</p><p>Pay online: <a href="https://dostel.com/pay">dostel.com/pay</a></p><p>Thank you for choosing Dostel!</p>`;
  try {
    await sendEmail(customer.email, subject, html);
    await ReminderLog.create({
      booking: booking._id,
      customer: customer._id,
      daysBefore: daysLeft,
      status: 'sent',
    });
    logger.info(`Sent ${daysLeft}-day reminder to ${customer.email} for booking ${booking.reference}`);
  } catch (err) {
    await ReminderLog.create({
      booking: booking._id,
      customer: customer._id,
      daysBefore: daysLeft,
      status: 'failed',
      error: err.message,
    });
    logger.error(`Failed to send ${daysLeft}-day reminder to ${customer.email}:`, err);
  }
};

const checkReminders = async () => {
  const today = new Date();
  try {
    const bookings = await Booking.find({
      sequenceStatus: { $ne: 'Completed' },
      checkInDate: { $gte: today }
    }).populate('customer');

    for (const booking of bookings) {
      const daysLeft = daysBetween(today, booking.checkInDate);
      if ([7, 3, 1].includes(daysLeft)) {
        await sendReminder(booking.customer, booking, daysLeft);
      }
    }
  } catch (err) {
    logger.error('Error in reminder check:', err);
  }
};

module.exports = { checkReminders };
