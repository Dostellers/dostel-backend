/**
 * Test suite for roomAvailability resolver
 */

import { describe, it, expect } from "vitest";
import { resolveRoomAvailability, resolveRoomAvailabilityDirect } from "./roomAvailability";

describe("roomAvailability resolver", () => {
  describe("resolveRoomAvailability", () => {
    it("should return room availability data for valid dates", async () => {
      // Mock the service function
      jest.mock("../src/services/roomService", () => ({
        getRoomAvailability: jest.fn().mockResolvedValue({
          roomType: "Suite",
          totalCapacity: 10,
          bookedBeds: 3,
          availableBeds: 7,
          checkIn: "2026-08-15T10:00:00Z",
          checkOut: "2026-08-18T10:00:00Z",
          hostelId: "hostel-vattakanal"
        })
      }));

      const result = await resolveRoomAvailability(
        undefined,
        {
          hostelId: "hostel-vattakanal",
          checkIn: "2026-08-15T10:00:00Z",
          checkOut: "2026-08-18T10:00:00Z"
        }
      );

      expect(result).toEqual({
        roomType: "Suite",
        totalCapacity: 10,
        bookedBeds: 3,
        availableBeds: 7,
        checkIn: "2026-08-15T10:00:00Z",
        checkOut: "2026-08-18T10:00:00Z",
        hostelId: "hostel-vattakanal"
      });
    });

    it("should throw error when no availability data found", async () => {
      jest.mock("../src/services/roomService", () => ({
        getRoomAvailability: jest.fn().mockResolvedValue(null)
      }));

      await expect(resolveRoomAvailability(
        undefined,
        {
          hostelId: "hostel-vattakanal",
          checkIn: "2026-08-15T10:00:00Z",
          checkOut: "2026-08-18T10:00:00Z"
        }
      )).rejects.toThrow("No availability data found");
    });
  });

  describe("resolveRoomAvailabilityDirect", () => {
    it("should return room availability via GraphQL query", async () => {
      // Mock GraphQL execution
      jest.spyOn(global, "graphqlClient").mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue({
          data: {
            roomAvailability: {
              roomType: "Suite",
              totalCapacity: 10,
              bookedBeds: 3,
              availableBeds: 7,
              checkIn: "2026-08-15T10:00:00Z",
              checkOut: "2026-08-18T10:00:00Z",
              hostelId: "hostel-vattakanal"
            }
          }
        })
      }))
      });

      const result = await resolveRoomAvailabilityDirect(
        undefined,
        {
          hostelId: "hostel-vattakanal",
          checkIn: "2026-08-15T10:00:00Z",
          checkOut: "2026-08-18T10:00:00Z"
        }
      );

      expect(result).toEqual({
        roomType: "Suite",
        totalCapacity: 10,
        bookedBeds: 3,
        availableBeds: 7,
        checkIn: "2026-08-15T10:00:00Z",
        checkOut: "2026-08-18T10:00:00Z",
        hostelId: "hostel-vattakanal"
      });
    });
  });
});
