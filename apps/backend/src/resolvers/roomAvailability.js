/**
 * Room Availability Query Resolver
 * Implements the missing roomAvailability GraphQL query
 * for Dostel booking flow
 */

const { getRoomAvailability } = require('../services/roomService');
const { GraphQLError } = require('graphql');

exports.resolveRoomAvailability = async (
  _args, __args
) => {
  try {
    const availability = await getRoomAvailability(
      __args.hostelId,
      __args.checkIn,
      __args.checkOut
    );

    if (!availability) {
      throw new Error('No availability data found');
    }

    return {
      roomType: availability.roomType,
      totalRooms: Math.ceil(availability.totalCapacity / 4), // Assuming 4 beds per room
      availableRooms: Math.ceil(availability.availableBeds / 4), // Assuming 4 beds per room
      pricePerNight: 1000, // Placeholder - should be calculated from room types
      roomId: availability.hostelId // Using hostelId as placeholder - should return actual room IDs
    };

  } catch (error) {
    throw new GraphQLError(
      `Failed to retrieve room availability: ${error.message}`, {
        extra: { originalError: error.message }
      }
    );
  }
};
