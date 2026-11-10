const { resolveRoomAvailability } = require('../src/resolvers/roomAvailability');

describe('roomAvailability resolver', () => {
  describe('resolveRoomAvailability', () => {
    it('should return room availability data for valid dates', async () => {
      // Mock the service function
      jest.mock('../src/services/roomService', () => ({
        getRoomAvailability: jest.fn().mockResolvedValue({
          roomType: 'Suite',
          totalCapacity: 10,
          bookedBeds: 3,
          availableBeds: 7,
          checkIn: '2026-08-15T10:00:00Z',
          checkOut: '2026-08-18T10:00:00Z',
          hostelId: 'hostel-vattakanal'
        })
      }));

      const result = await resolveRoomAvailability(
        undefined,
        {
          hostelId: 'hostel-vattakanal',
          checkIn: '2026-08-15T10:00:00Z',
          checkOut: '2026-08-18T10:00:00Z'
        }
      );

      expect(result).toEqual({
        roomType: 'Suite',
        totalRooms: 3,
        availableRooms: 1,
        pricePerNight: 1000,
        roomId: 'hostel-vattakanal'
      });
    });

    it('should throw error when no availability data found', async () => {
      jest.mock('../src/services/roomService', () => ({
        getRoomAvailability: jest.fn().mockResolvedValue(null)
      }));

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