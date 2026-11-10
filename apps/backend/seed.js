const mongoose = require("mongoose");
const User = require("./src/models/user");
const Hostel = require("./src/models/hostel");
const RoomType = require("./src/models/RoomType");
const Room = require("./src/models/room");
const Customer = require("./src/models/customer");
const Booking = require("./src/models/booking");
const MembershipPlan = require("./src/models/membershipPlan");
const MembershipSubscription = require("./src/models/membershipSubscription");

async function seedDatabase() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dostel";
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Clear existing data
    await Booking.deleteMany({});
    await Customer.deleteMany({});
    await User.deleteMany({});
    await Hostel.deleteMany({});
    await RoomType.deleteMany({});
    await Room.deleteMany({});
    await MembershipPlan.deleteMany({});
    await MembershipSubscription.deleteMany({});

    // Create User (required as Hostel owner)
    const user = new User({
      username: "admin",
      email: "admin@dostel.test",
      password: "password123",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      dosteller: {
        isDosteller: true,
        tier: "EXPLORER",
        points: 0,
        joinedAt: new Date()
      }
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

    // Create another room type and room for variety
    const dormType = new RoomType({
      name: "Dormitory Bed",
      category: "dorm",
      capacity: 6,
      basePrice: 30.00,
      hostel: hostel._id
    });
    await dormType.save();

    const dormRoom = new Room({
      number: "102",
      type: "dorm",
      price: 30.00,
      hostel: hostel._id,
      roomType: dormType._id,
      status: "available",
      description: "Shared dormitory bed with bunk setup",
      features: ["WiFi", "Shared Bathroom"],
      capacity: 6
    });
    await dormRoom.save();

    // Create membership plans with discount arrays
    const bronzePlan = new MembershipPlan({
      name: "Bronze",
      durationDays: 365,
      price: 99.99,
      discounts: [{
        type: "percentage",
        value: 10
      }],
      perks: ["Standard activity notifications", "Basic discount access"],
      isActive: true
    });
    await bronzePlan.save();
    console.log("Created Bronze plan:", bronzePlan.name);

    const silverPlan = new MembershipPlan({
      name: "Silver",
      durationDays: 365,
      price: 199.99,
      discounts: [{
        type: "percentage",
        value: 20
      }],
      perks: ["20% discount on bookings", "Access to special events", "Priority support", "Points earned at 2x rate"],
      isActive: true
    });
    await silverPlan.save();
    console.log("Created Silver plan:", silverPlan.name);

    const goldPlan = new MembershipPlan({
      name: "Gold",
      durationDays: 730,
      price: 399.99,
      discounts: [{
        type: "percentage",
        value: 25
      }],
      perks: ["25% discount on bookings", "Access to exclusive destinations", "Premium support", "Points earned at 3x rate"],
      isActive: true
    });
    await goldPlan.save();
    console.log("Created Gold plan:", goldPlan.name);

    // Create membership subscription records
    const customer = await Customer.findOne({ username: "admin" });
    if (customer) {
      const plans = await MembershipPlan.find();
      for (const plan of plans) {
        const subscription = await MembershipSubscription.create({
          customer: customer._id,
          plan: plan._id,
          status: "active",
          startDate: new Date(),
          endDate: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000),
          autoRenew: true
        });
        console.log("Created subscription:", subscription.id);
      }
    }

    console.log("All data seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run seed function if executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
