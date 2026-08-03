const { checkReminders } = require('./reminderService');

// Schedule daily reminder check
cron.schedule('0 0 * * *', () => {
  checkReminders();
});

console.log('Reminder service started');
