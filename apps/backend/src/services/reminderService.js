const mongoose = require('mongoose');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { Booking } = require('./models');

// Initialize database connection
async function initDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dostel', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Reminder Service: Connected to MongoDB');
  } catch (error) {
    console.error('Reminder Service: MongoDB connection failed:', error);
    process.exit(1);
  }
}

async function checkAndSendReminders() {
  try {
    const now = new Date();
    
    // Find confirmed bookings
    const bookings = await Booking.find({
      sequenceStatus: 'Confirmed',
      'payment.status': 'Pending'
    }).populate('customer', 'name phone email').populate('hostel', 'name');
    
    if (!bookings || bookings.length === 0) {
      return;
    }
    
    for (const booking of bookings) {
      // Check if deposit is due in 7 days
      const depositDueDate = new Date(booking.createdAt);
      depositDueDate.setDate(depositDueDate.getDate() + 7);
      
      if (isDueDate(depositDueDate, now)) {
        await sendReminder(booking, 7, 'Deposit due in 7 days');
      }
      
      // Check if deposit is due in 1 day
      depositDueDate.setDate(depositDueDate.getDate() - 6);
      if (isDueDate(depositDueDate, now)) {
        await sendReminder(booking, 1, 'Deposit due in 1 day');
      }
    }
  } catch (error) {
    console.error('Reminder Service: Error checking bookings:', error);
  }
}

function isDueDate(dueDate, now) {
  return dueDate.toDateString() === now.toDateString();
}

async function sendReminder(booking, days, message) {
  try {
    const { customer, hostel, roomType, checkInDate, checkOutDate } = booking;
    const amount = booking.depositRequired || 0;
    
    const reminderMessage = `
    Reminder: ${message}
    Booking Reference: ${booking.reference || 'N/A'}
    Room Type: ${roomType}
    Check-in: ${checkInDate}
    Check-out: ${checkOutDate}
    Amount Due: ${amount}
    Hostel: ${hostel.name}
    
    Please complete your ${booking.payment.depositPercentage || 25}% deposit payment.
    `;
    
    console.log(`Reminder Service: ${reminderMessage}
Customer: ${customer.name} (${customer.email})`);
    
    // TODO: Implement actual SMS sending when Twilio is configured
    // const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilioClient.messages.create({
    //   body: reminderMessage,
    //   to: customer.phone,
    //   from: process.env.TWILIO_PHONE_NUMBER
    // });
    
  } catch (error) {
    console.error('Reminder Service: Failed to send reminder:', error);
  }
}

async function startReminderService() {
  await initDB();
  
  // Run every hour to check for reminders
  cron.schedule('0 * * * *', async () => {
    console.log('Reminder Service: Checking for due reminders...');
    await checkAndSendReminders();
  });
  
  // Initial run
  await checkAndSendReminders();
  
  console.log('Reminder Service: Started successfully');
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Reminder Service: Shutting down gracefully');
  mongoose.disconnect();
  process.exit(0);
});

module.exports = { startReminderService };