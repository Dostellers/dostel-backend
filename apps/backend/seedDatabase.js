const mongoose = require("mongoose");
const User = require("./src/models/user");
const Hostel = require("./src/models/hostel");
const RoomType = require("./src/models/RoomType");
const Room = require("./src/models/room");
const Customer = require("./src/models/customer");
const Booking = require("./src/models/booking");

async function seedDatabase() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dostel";
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  try {
    // Clear existing data
    await Booking.deleteMany({});
    await Customer.deleteMany({});
    await Room.deleteMany({});
    await RoomType.deleteMany({});
    await Hostel.deleteMany({});
    await User.deleteMany({ email: "admin@dostel.test" });
    
    // Create User (required as Hostel owner)
    const user = new User({
      username: "admin",
      email: "admin@dostel.test",
      password: "password123",
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    });
    await user.save();
    console.log("Created user:", user.email);
    
    // Create Hostel with required fields
    const hostel = new Hostel({ 
      name: "Dostel Hostel", 
      slug: "dostel-hostel",
      location: "123 Main Street",
      city: "Test City",
      state: "Test State",
      country: "India",
      description: "A welcoming hostel for travelers and locals alike.",
      pricePerNight: 50.00,
      amenities: ["WiFi", "Kitchen", "Laundry", "Common Area"],
      owner: user._id
    });
    await hostel.save();
    console.log("Created hostel:", hostel.name);
    
    // Create RoomType
    const roomType = new RoomType({
      name: "Deluxe Private Room",
      category: "private",
      capacity: 2,
      basePrice: 75.00,
      hostel: hostel._id
    });
    await roomType.save();
    console.log("Created room type:", roomType.name);
    
    // Create Room
    const room = new Room({
      number: "101",
      type: "private",
      price: 75.00,
      hostel: hostel._id,
      roomType: roomType._id,
      status: "available",
      description: "Comfortable private room with ensuite bathroom",
      features: ["WiFi", "Air Conditioning", "Private Bathroom"],
      capacity: 2
    });
    await room.save();
    console.log("Created room:", room.number);
    
    // Create another room type and room
    const dormType = new RoomType({
      name: "Dormitory Bed",
      category: "dorm",
      capacity: 1,
      basePrice: 25.00,
      hostel: hostel._id
    });
    await dormType.save();
    console.log("Created room type:", dormType.name);
    
    const dormRoom = new Room({
      number: "DORM-01",
      type: "dorm",
      price: 25.00,
      hostel: hostel._id,
      roomType: dormType._id,
      status: "available",
      description: "Shared dormitory bed in mixed dormitory",
      features: ["WiFi", "Locker", "Shared Bathroom"],
      capacity: 1,
      maxCapacity: 1
    });
    await dormRoom.save();
    console.log("Created room:", dormRoom.number);
    
    // Create a Customer
    const customer = new Customer({
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      dateOfBirth: new Date("1990-01-01"),
      address: {
        street: "123 Customer Street",
        city: "Test City",
        state: "Test State",
        country: "India",
        postalCode: "123456"
      },
      password: "customer123"
    });
    await customer.save();
    console.log("Created customer:", customer.fullName);
    
    // Create a Booking with complete required fields
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 10); // 10 days from now
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3); // 3 nights stay
    
    const booking = new Booking({
      reference: "BOOKING-001",
      checkInDate: startDate,
      checkOutDate: endDate,
      customer: customer._id,
      hostel: hostel._id,
      roomType: "private", // String value, not ObjectId
      guests: 2, // Number of guests
      totalAmount: room.price * 3, // 3 nights
      payment: {
        status: "Pending", // Capitalized enum value
        method: "Credit Card", // Exact enum value
        amount: room.price * 3
      },
      status: "Confirmed" // Capitalized enum value
    });
    await booking.save();
    console.log("Created booking for customer:", customer.fullName, "in room:", room.number);
    
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err.message);
    if (err.stack) console.error(err.stack);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();