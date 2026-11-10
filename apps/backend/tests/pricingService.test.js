const {
  calculateFinalPrice,
  MEMBERSHIP_DISCOUNTS,
  SEASONAL_PRICING
} = require('../../../services/pricingService');

describe('Pricing Service', () => {
  describe('Membership Discounts', () => {
    it('should apply 5% discount for basic membership', () => {
      const room = { price: 1000 };
      const result = calculateFinalPrice(room, new Date('2024-01-01'), new Date('2024-01-03'), 'basic');
      expect(result.discountedPrice).toBe(950); // 1000 * (1 - 0.05)
    });

    it('should apply 10% discount for standard membership', () => {
      const room = { price: 1000 };
      const result = calculateFinalPrice(room, new Date('2024-01-01'), new Date('2024-01-03'), 'standard');
      expect(result.discountedPrice).toBe(900); // 1000 * (1 - 0.1)
    });

    it('should apply 15% discount for premium membership', () => {
      const room = { price: 1000 };
      const result = calculateFinalPrice(room, new Date('2024-01-01'), new Date('2024-01-03'), 'premium');
      expect(result.discountedPrice).toBe(850); // 1000 * (1 - 0.15)
    });

it('should apply 20% discount for dosteller membership', () => {
        const room = { price: 1000 };
        const result = calculateFinalPrice(room, new Date('2024-01-01'), new Date('2024-01-03'), 'dosteller');
        expect(result.discountedPrice).toBe(800); // 1000 * (1 - 0.2)
      });

    it('should use no discount for unknown membership type', () => {
      const room = { price: 1000 };
      const result = calculateFinalPrice(room, new Date('2024-01-01'), new Date('2024-01-03'), 'unknown');
      expect(result.discountedPrice).toBe(1000);
    });
  });

  describe('Seasonal Pricing', () => {
    it('should apply summer premium multiplier', () => {
      jest.spyOn(require('../../../services/pricingService'), 'getCurrentSeason').mockReturnValue('summer');
      const room = { price: 1000 };
      const result = calculateFinalPrice(room, new Date('2024-04-01'), new Date('2024-04-03'), 'standard');
      expect(result.basePricePerNight).toBe(1200); // 1000 * 1.2
      jest.restoreAllMocks();
    });

    it('should not apply seasonal multiplier for default season', () => {
      jest.spyOn(require('../../../services/pricingService'), 'getCurrentSeason').mockReturnValue('normal');
      const room = { price: 1000 };
      const result = calculateFinalPrice(room, new Date('2024-01-01'), new Date('2024-01-03'), 'standard');
      expect(result.basePricePerNight).toBe(1000);
      jest.restoreAllMocks();
    });
  });

  describe('Price Calculations', () => {
    it('should calculate total price correctly for multiple nights', () => {
      const room = { price: 1000 };
      const result = calculateFinalPrice(room, new Date('2024-01-01'), new Date('2024-01-04'), 'standard');
      expect(result.totalPrice).toBe(2700); // 900 * 3 nights
    });

    it('should calculate final amount with tax', () => {
      const room = { price: 1000 };
      const result = calculateFinalPrice(room, new Date('2024-01-01'), new Date('2024-01-02'), 'standard');
      expect(result.totalPrice).toBe(900); // 1000 * 0.9
    });

    it('should handle single night stay', () => {
      const room = { price: 500 };
      const result = calculateFinalPrice(room, new Date('2024-01-01'), new Date('2024-01-02'), 'basic');
      expect(result.discountedPrice).toBe(475); // 500 * 0.95
    });
  });

  describe('Error Handling', () => {
    it('should throw error when room price is missing', () => {
      const room = {};
      expect(() => calculateFinalPrice(room, new Date('2024-01-01'), new Date('2024-01-02'), 'standard')).toThrow('Room price not set');
    });

    it('should throw error when room is null', () => {
      expect(() => calculateFinalPrice(null, new Date('2024-01-01'), new Date('2024-01-02'), 'standard')).toThrow('Room price not set');
    });
  });
});