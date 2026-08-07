const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dostel', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define models (import or require them)
const Hostel = require('../src/models/hostel');
const Room = require('../src/models/room');
const Customer = require('../src/models/customer');
const Booking = require('../src/models/booking');

// Hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

async function seedData() {
  // Clean collections
  await Hostel.deleteMany({});
  await Room.deleteMany({});
  await Customer.deleteMany({});
  await Booking.deleteMany({});

  // 1. Seed Customer first (hostel needs owner reference)
  const password = await hashPassword('test1234');
  const customer = new Customer({
    fullName: 'Test User',
    email: 'test@dostel.in',
    phone: '9999999999',
    password
  });
  await customer.save();

  // 2. Seed Hostel (after customer)
  const hostel = new Hostel({
    name: 'Dostel Vattakanal',
    slug: 'dostel-vattakanal',
    tagline: 'Community hostel in the mountains',
    description: 'Nestled in the pine forests of Vattakanal...',
    city: 'Vattakanal',
    state: 'Tamil Nadu',
    country: 'India',
    rating: 4.5,
    totalReviews: 342,
    amenities: ['bonfire', 'co-working', 'wifi'],
    owner: customer._id,
    pricePerNight: 450,
    location: 'Vattakanal, Tamil Nadu, India'
  });
  await hostel.save();

  // 3. Seed Rooms
  const roomTypes = [
    { name: 'Mixed Dorm (6 Bed)', type: 'dorm', capacity: 6, price: 450, quantity: 3 },
    { name: 'Female Dorm (4 Bed)', type: 'dorm', capacity: 4, price: 550, quantity: 1 },
    { name: 'Private Couple Room', type: 'private', capacity: 2, price: 1200, quantity: 2 },
    { name: 'Deluxe Suite', type: 'private', capacity: 2, price: 2500, quantity: 1 },
    { name: 'Family Room (4 Bed)', type: 'private', capacity: 4, price: 1800, quantity: 1 },
    { name: 'Mountain View Suite', type: 'private', capacity: 2, price: 3000, quantity: 1 }
  ];

  let roomNumber = 100;
  const rooms = [];
  roomTypes.forEach(type => {
    for (let i = 0; i < type.quantity; i++) {
      roomNumber++;
      rooms.push({
        name: type.name,
        type: type.type,
        capacity: type.capacity,
        price: type.price,
        hostel: hostel._id,
        number: roomNumber.toString()
      });
    }
  });

  // We'll use the model's create method
  await Promise.all(rooms.map(room => Room.create(room)));

// 4. Seed Booking
  const booking = new Booking({
    customer: customer._id,
    hostel: hostel._id,
    roomType: 'Mixed Dorm (6 Bed)',
    checkInDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 24 * 60 * 60 * 1000), // 2 nights later
    guests: 2,
    totalAmount: 900, // Assuming 450 per night
    payment: {
      status: 'Pending',
      method: 'Credit Card',
      transactionId: 'TEST123',
      amount: 900
    },
    reference: `DOS-${Date.now()}',
    specialRequests: ''
  });
  await booking.save();

  console.log('Seeded: ', {
    hostel: 1,
    rooms: rooms.length,
    customer: 1,
    booking: 1
  });
}

seedData().catch(console.error);