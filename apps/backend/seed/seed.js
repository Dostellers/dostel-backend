require('dotenv').config();
const mongoose = require('mongoose');
const Hostel = require('../src/models/Hostel');
const Room = require('../src/models/room');
const User = require('../src/models/user');

const seedHostels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dostel', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('SEED: Connected to MongoDB');

    // Drop the database to start fresh (development only)
    await mongoose.connection.dropDatabase();
    console.log('SEED: Dropped database');

    // Create or get a user for owner
    let owner = await User.findOne({ email: 'admin@dostel.com' });
    if (!owner) {
      owner = await User.create({
        email: 'admin@dostel.com',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        password: 'password123', // In real app, this would be hashed
        isActive: true
      });
      console.log('SEED: Created owner user');
    } else {
      console.log('SEED: Found existing admin user, reusing');
    }

    const hostelsData = [
      { 
        name: 'The Misty Mountains', 
        location: 'Kodaikanal', 
        city: 'Kodaikanal',
        state: 'Tamil Nadu',
        description: 'A beautiful hostel nestled in the misty mountains of Kodaikanal',
        pricePerNight: 800,
        totalRooms: 15
      },
      { 
        name: 'Island Breeze', 
        location: 'Goa', 
        city: 'Goa',
        state: 'Goa',
        description: 'Relaxing beachfront hostel with amazing ocean views',
        pricePerNight: 1200,
        totalRooms: 20
      },
      { 
        name: 'Sunset Valley', 
        location: 'Coorg', 
        city: 'Coorg',
        state: 'Karnataka',
        description: 'Peaceful hostel surrounded by coffee plantations',
        pricePerNight: 1000,
        totalRooms: 12
      }
    ];

    // Create hostels with required fields
    const hostels = [];
    for (const data of hostelsData) {
      hostels.push({
        name: data.name,
        location: data.location,
        city: data.city,
        state: data.state,
        country: 'India',
        description: data.description,
        shortDescription: data.description.substring(0, 100),
        rating: 4.5,
        reviewsCount: Math.floor(Math.random() * 100),
        pricePerNight: data.pricePerNight,
        featured: Math.random() > 0.5,
        owner: owner._id,
        isActive: true,
        isVerified: true,
        slug: data.name.toLowerCase().replace(/\s+/g, '-')
      });
    }

    console.log('SEED: About to create hostels:', hostels);
    const createdHostels = await Hostel.create(hostels);
    console.log('SEED: Created hostels:', createdHostels);
    console.log(`SEED: Created ${createdHostels.length} hostels`);

    const rooms = [];
    const statuses = ['available', 'occupied', 'maintenance', 'out_of_order'];

    createdHostels.forEach((hostel, index) => {
      const totalRooms = hostelsData[index].totalRooms;
      for (let i = 1; i <= totalRooms; i++) {
        rooms.push({
          number: `${i}`,
          hostel: hostel._id,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          capacity: Math.random() > 0.5 ? 2 : 4,
          description: `Room ${i} at ${hostel.name}`,
          price: hostelsData[index].pricePerNight,
        });
      }
    });

    console.log('SEED: About to create rooms:', rooms.length);
    const createdRooms = await Room.create(rooms);
    console.log(`SEED: Created ${createdRooms.length} rooms`);

    createdHostels.forEach(h => {
      console.log(`- ${h.name} (${h.location}) - ${h.totalRooms} rooms`);
    });

    await mongoose.connection.close();
    console.log('SEED: MongoDB connection closed');
  } catch (error) {
    console.error('SEED ERROR:', error.message);
    process.exit(1);
  }
};

seedHostels();
