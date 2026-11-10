// roomAvailabilityResolver.js

// Implement availability checking logic using the new bookings array
// This will handle date comparisons and availability calculations

const buildAvailability = (room, checkIn, checkOut) => {
  // Parse dates
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  
  // Filter active bookings
  const activeBookings = room.bookings.filter(b => {
    const bStart = new Date(b.checkIn).getTime();
    const bEnd = new Date(b.checkOut).getTime();
    
    return (bStart < end && bEnd > start);
  });
  
  // Check if any active bookings overlap
  return activeBookings.length === 0 ? 'available' : 'occupied';
};

// Export availability check function
module.exports = {
  checkAvailability: (room, checkIn, checkOut) => {
    if (!checkIn || !checkOut) throw new Error('Dates required');
    return buildAvailability(room, checkIn, checkOut);
  }
};