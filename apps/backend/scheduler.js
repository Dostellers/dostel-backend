const cron = require('node-cron');
const { execSync } = require('child_process');
const path = require('path');

// Function to run a task
function runTask(taskName, command) {
  console.log(`[${new Date().toISOString()}] Starting task: ${taskName}`);
  try {
    execSync(command, { stdio: 'inherit', cwd: path.resolve(__dirname) });
    console.log(`[${new Date().toISOString()}] Completed task: ${taskName}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in task ${taskName}:`, error.message);
  }
}

// Schedule tasks
console.log('Starting Dostel scheduler...');

// Example: Run database backup every day at 2 AM
cron.schedule('0 2 * * *', () => {
  runTask('Database Backup', 'npm run db:backup');
});

// Example: Run data cleanup every Sunday at 3 AM
cron.schedule('0 3 * * 0', () => {
  runTask('Data Cleanup', 'npm run data:cleanup');
});

// Example: Send daily report every morning at 8 AM
cron.schedule('0 8 * * *', () => {
  runTask('Daily Report', 'npm run report:daily');
});

// Example: Check for expired bookings every hour
cron.schedule('0 * * * *', () => {
  runTask('Expired Booking Check', 'npm run booking:check-expired');
});

// Example: Generate analytics report every 6 hours
cron.schedule('0 */6 * * *', () => {
  runTask('Analytics Report', 'npm run analytics:generate');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Scheduler shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Scheduler shutting down...');
  process.exit(0);
});

console.log('Scheduler is running. Press Ctrl+C to stop.');