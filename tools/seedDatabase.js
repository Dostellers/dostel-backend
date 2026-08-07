const mongoose = require("mongoose");
const Hostel = require("../apps/backend/src/models/hostel");
const RoomType = require("../apps/backend/src/models/RoomType");
const Room = require("../apps/backend/src/models/room");

async function seedDatabase() {
  await mongoose.connect("mongodb://127.0.0.1:27017/dostel", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await Hostel.deleteMany({});
    await RoomType.deleteMany({});
    await Room.deleteMany({});

    const hostel = new Hostel({
      name: "Dostel Hostel",
      address: "123 Main Street",
      city: "Test City",
      country: "Test Country",
    });
    await hostel.save();

    const roomType = new RoomType({
      name: "Deluxe",
      category: "private",
      capacity: 2,
      basePrice: 150,
      hostel: hostel._id,
    });
    await roomType.save();

    const room = new Room({
      number: "101",
      type: "private",
      price: 150,
      hostel: hostel._id,
      roomType: roomType._id,
      status: "available",
    });
    await room.save();

    console.log("Database seeded successfully");
    console.log("Hostel:", hostel._id);
    console.log("RoomType:", roomType._id);
    console.log("Room:", room._id);
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();