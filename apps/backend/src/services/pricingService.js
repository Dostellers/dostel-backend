// Pricing engine logic for Dostel's room bookings
// Implements dynamic pricing based on membership, seasonality, and availability

// Membership discount lookup table (percentage off)
const MEMBERSHIP_DISCOUNTS = {
  basic: 0.05,    // 5% off
  standard: 0.1,  // 10% off
  premium: 0.15,  // 15% off
  dosteller: 0.2  // 20% off
};

// Seasonal pricing factors (multiplier)
const SEASONAL_PRICING = {
  'summer': 1.2,     // 20% premium during high season
  'three-day-weekend': 0.8 // 20% discount
};

// Determines current season for pricing based on month
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 5 && month <= 8) return 'summer';
  return 'normal';
}

/**
 * Calculates room price during check-in
 * @param {Room} room - Room object
 * @param {Date} startDate - Check-in date
 * @param {Date} endDate - Check-out date
 * @param {String} membershipType - Membership status
 * @returns {Object} Pricing breakdown
 */
function calculateFinalPrice(room, startDate, endDate, membershipType) {
  if (!room || !room.price) {
    throw new Error('Room price not set');
  }

  // Calculate number of nights
  const nights = Math.max(1, (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24));
  let basePricePerNight = room.price;

  // Apply seasonal pricing
  const season = getCurrentSeason();
  if (SEASONAL_PRICING[season]) {
    basePricePerNight *= SEASONAL_PRICING[season];
  }

  // Apply membership discount
  const membershipDiscount = MEMBERSHIP_DISCOUNTS[membershipType] || 0;
  const discountedPrice = basePricePerNight * (1 - membershipDiscount);

  // Calculate total price and return breakdown
  const totalPrice = Math.round(discountedPrice * nights * 100) / 100;
  return {
    basePricePerNight,
    discountedPrice,
    totalPrice,
    currency: 'INR',
    taxFactor: 1.18,   // Example tax (18% GST)
    season,
  };
}

// Export all functions and constants
module.exports = {
  calculateFinalPrice,
  getCurrentSeason,
  MEMBERSHIP_DISCOUNTS,
  SEASONAL_PRICING
};