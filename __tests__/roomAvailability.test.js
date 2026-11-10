const { getRoomAvailability } = require('../../apps/backend/src/services/roomService');

jest.mock('../src/services/roomService', () => ({
  getRoomAvailability: jest.fn()
}));

describe('roomAvailability resolver', () => {
  const { resolveRoomAvailability } = require('../src/resolvers/roomAvailability');

  describe('resolveRoomAvailability', () => {
    it('should return room availability data for valid dates', async () => {
      const mockAvailability = {
        roomType: 'Suite',
        totalCapacity: 10,
        bookedBeds: 3,
        availableBeds: 7,
        checkIn: '2026-08-15T10:00:00Z',
        checkOut: '2026-08-18T10:00:00Z',
        hostelId: 'hostel-vattakanal'
      };

      getRoomAvailability.mockResolvedValue(mockAvailability);

      const result = await resolveRoomAvailability(
        undefined,
        {
          hostelId: 'hostel-vattakanal',
          checkIn: '2026-08-15T10:00:00Z',
          checkOut: '2026-08-18T10:00:00Z'
        }
      );

      expect(result).toEqual(mockAvailability);
      expect(getRoomAvailability).toHaveBeenCalledWith(
        'hostel-vattakanal',
        '2026-08-15T10:00:00Z',
        '2026-08-18T10:00:00Z'
      );
    });

    it('should throw error when no availability data found', async () => {
      getRoomAvailability.mockResolvedValue(null);

      await expect(resolveRoomAvailability(
        undefined,
        {
          hostelId: 'hostel-vattakanal',
          checkIn: '2026-08-15T10:00:00Z',
          checkOut: '2026-08-18T10:00:00Z'
        }
      )).rejects.toThrow('No availability data found');
    });
  });
});