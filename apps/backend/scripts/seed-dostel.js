// seed-dostel.js
// Create sample hostel and rooms in MongoDB
const mongoose = require('mongoose');
require('dotenv').config(); // Load env vars for connection string and token

// Models (use existing schema definitions for validation)
const User = require('../src/models/user');
const Hostel = require('../src/models/hostel');
const Room = require('../src/models/room');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dostel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.error('DB connection error:', err));

async function main() {
  try {
    // Create a sample owner (dosteller)
    let owner = await User.findOne({ email: 'admin@dostel.test' });
    if (!owner) {
      owner = await User.create({
        username: 'dosteller_admin',
        email: 'admin@dostel.test',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
      });
      console.log('Created owner:', owner._id);
    } else {
      console.log('Found existing owner:', owner._id);
    }

    // Create sample hostel
    const hostel = await Hostel.create({
      name: 'Dostel Bangalore',
      slug: 'dostel-bangalore',
      location: 'Indiranagar, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      tagline: 'Your home away from home',
      description: 'A modern hostel in the heart of Bangalore.',
      shortDescription: 'Located in Indiranagar.',
      pricePerNight: 327,
      owner: owner._id,
    });
    console.log('Created hostel:', hostel._id);

    // Create sample rooms
    await Room.create({
      hostel: hostel._id,
      number: 'D-101',
      type: 'Dormitory',
      capacity: 10,
      maxCapacity: 12,
      price: 327,
      status: 'available',
      description: 'Mixed dorm with bunk beds.',
    });

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  } finally {
    mongoose.disconnect();
  }
}

main();
