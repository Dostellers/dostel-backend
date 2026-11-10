const mongoose = require('mongoose');
const Booking = require('../src/models/booking');
const InventoryDay = require('../src/models/InventoryDay');
const resolvers = require('../src/resolvers/bookingResolver');

describe('deleteBooking resolver', () => {
  let hostelId;
  let inventoryTypeId;
  let customerId;
  let bookingId;
  const testHostelId = new mongoose.Types.ObjectId();
  const testInventoryTypeId = new mongoose.Types.ObjectId();
  const testCustomerId = new mongoose.Types.ObjectId();

  beforeAll(async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Dostel_test';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    hostelId = testHostelId;
    inventoryTypeId = testInventoryTypeId;
    customerId = testCustomerId;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Booking.deleteMany({});
    await InventoryDay.deleteMany({});
  });

  test('should delete a Draft booking and release inventory', async () => {
    const checkIn = new Date('2026-08-01');
    const checkOut = new Date('2026-08-05');
    const timeDiff = checkOut - checkIn;
    const daysDiff = timeDiff / (1000 * 3600 * 24); // 4 days

    // Create inventory days for each night of the booking
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      await InventoryDay.create({
        hostelId,
        inventoryTypeId,
        date: dateString,
        total: 10,
        held: 0,
        sold: 0,
        blocked: 0,
      });
    }

    // Create a Draft booking via the model
    const booking = await Booking.create({
      reference: 'TEST-DELETE-001',
      customer: customerId,
      hostel: hostelId,
      roomType: 'Dorm',
      inventoryType: inventoryTypeId,
      inventoryQuantity: 2,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: 1,
      totalAmount: 4000,
      payment: {
        status: 'Pending',
        method: 'UPI',
        amount: 0,
      },
      depositPercentage: 25,
      sequenceStatus: 'Draft',
    });

    bookingId = booking._id;

    // Simulate the inventory effect of the booking: increment held by inventoryQuantity for each night
    // (as if the booking had been confirmed and held inventory)
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      await InventoryDay.updateOne(
        { hostelId, inventoryTypeId, date: dateString },
        { $inc: { held: 2 } }
      );
    }

    // Verify inventory held increased for each night
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const inventoryDay = await InventoryDay.findOne({ hostelId, inventoryTypeId, date: dateString });
      expect(inventoryDay).not.toBeNull();
      expect(inventoryDay.held).toBe(2);
    }

    // Call deleteBooking mutation resolver
    const deleteBookingFn = resolvers.Mutation.deleteBooking;
    const context = { req: { app: { locals: {} } } }; // Mock context
    
    const result = await deleteBookingFn(null, { id: bookingId.toString() }, context);
    expect(result).toBeDefined();
    expect(result._id.toString()).toBe(bookingId.toString());

    // Verify inventory held decreased for each night (should be back to 0)
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const inventoryDay = await InventoryDay.findOne({ hostelId, inventoryTypeId, date: dateString });
      expect(inventoryDay).not.toBeNull();
      expect(inventoryDay.held).toBe(0);
    }

    // Verify booking is deleted
    const foundBooking = await Booking.findById(bookingId);
    expect(foundBooking).toBeNull();
  });

  test('should not delete a Confirmed booking', async () => {
    const checkIn = new Date('2026-08-01');
    const checkOut = new Date('2026-08-05');
    const timeDiff = checkOut - checkIn;
    const daysDiff = timeDiff / (1000 * 3600 * 24); // 4 days

    // Create inventory days for each night of the booking
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      await InventoryDay.create({
        hostelId,
        inventoryTypeId,
        date: dateString,
        total: 10,
        held: 0,
        sold: 0,
        blocked: 0,
      });
    }

    // Create a Confirmed booking
    const booking = await Booking.create({
      reference: 'TEST-DELETE-002',
      customer: customerId,
      hostel: hostelId,
      roomType: 'Dorm',
      inventoryType: inventoryTypeId,
      inventoryQuantity: 1,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: 1,
      totalAmount: 2000,
      payment: {
        status: 'Completed',
        method: 'UPI',
        amount: 2000,
      },
      depositPercentage: 25,
      sequenceStatus: 'Confirmed',
    });

    bookingId = booking._id;

    // Simulate inventory effect for the booking (as if held)
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      await InventoryDay.updateOne(
        { hostelId, inventoryTypeId, date: dateString },
        { $inc: { held: 1 } }
      );
    }

    // Attempt to delete should throw
    const deleteBookingFn = resolvers.Mutation.deleteBooking;
    const context = { req: { app: { locals: {} } } }; // Mock context
    
    await expect(deleteBookingFn(null, { id: bookingId.toString() }, context)).rejects.toThrow('Only Draft or Abandoned bookings can be deleted');

    // Verify booking still exists
    const foundBooking = await Booking.findById(bookingId);
    expect(foundBooking).not.toBeNull();
    expect(foundBooking.sequenceStatus).toBe('Confirmed');

    // Verify inventory held unchanged (should still be 1 for each night)
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const inventoryDay = await InventoryDay.findOne({ hostelId, inventoryTypeId, date: dateString });
      expect(inventoryDay).not.toBeNull();
      expect(inventoryDay.held).toBe(1);
    }
  });
});