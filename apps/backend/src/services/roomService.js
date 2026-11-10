const Room = require('../models/room');
const Booking = require('../models/booking');

const getRoomAvailability = async (hostelId, checkIn, checkOut) => {
  try {
    // Find all rooms in the hostel
    const rooms = await Room.find({ hostel: hostelId }).populate('roomType').exec();

    // Find existing bookings that overlap with the requested date range
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const overlappingBookings = await Booking.find({
      hostel: hostelId,
      sequenceStatus: { $in: ['Confirmed', 'CheckedIn', 'CheckedOut'] },
      $or: [
        { checkInDate: { $gte: startDate, $lte: endDate } },
        { checkOutDate: { $gte: startDate, $lte: endDate } },
        { checkInDate: { $lte: startDate }, checkOutDate: { $gte: endDate } }
      ]
    });

    const bookedRoomIds = new Set();
    overlappingBookings.forEach(booking => {
      // Booking model doesn't have a rooms array, so just count bookings
    });

    const availability = {
      roomType: rooms.length > 0 ? rooms[0].roomType?.name || 'Standard' : 'Standard',
      totalRooms: rooms.length,
      totalCapacity: rooms.length * 4,
      bookedBeds: overlappingBookings.length * 2,
      availableBeds: (rooms.length - overlappingBookings.length) * 4,
      pricePerNight: rooms.length > 0 ? rooms[0].price || 0 : 0,
      checkIn: checkIn,
      checkOut: checkOut,
      hostelId: hostelId
    };

    return availability;
  } catch (error) {
    console.error('Error fetching room availability:', error);
    return null;
  }
};

module.exports = { getRoomAvailability };
