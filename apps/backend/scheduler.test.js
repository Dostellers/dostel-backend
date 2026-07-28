// Simple test to verify scheduler can be imported without errors
const scheduler = require('./scheduler');
console.log('Scheduler module loaded successfully');

// Test that the scheduler file exists and has expected functions
const fs = require('fs');
const path = require('path');

const schedulerPath = path.join(__dirname, '..', 'scheduler.js');
if (fs.existsSync(schedulerPath)) {
  console.log('Scheduler file exists');
  
  // Check if file contains expected cron patterns
  const content = fs.readFileSync(schedulerPath, 'utf8');
  const hasCronSchedule = content.includes('cron.schedule');
  console.log(`Contains cron.schedule calls: ${hasCronSchedule}`);
  
  // Check for task functions
  const hasRunTask = content.includes('function runTask');
  console.log(`Contains runTask function: ${hasRunTask}`);
} else {
  console.error('Scheduler file not found!');
}

console.log('Scheduler test completed');