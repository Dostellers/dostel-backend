import { describe, expect, it } from "vitest";
import { calculateNights, validateSearch, buildBookingInput } from "./booking-widget.js";

describe("calculateNights", () => {
  it("returns 0 for missing dates", () => {
    expect(calculateNights("", "")).toBe(0);
    expect(calculateNights("2026-08-01", "")).toBe(0);
    expect(calculateNights("", "2026-08-05")).toBe(0);
  });

  it("returns correct nights for valid date ranges", () => {
    expect(calculateNights("2026-08-01", "2026-08-02")).toBe(1);
    expect(calculateNights("2026-08-01", "2026-08-03")).toBe(2);
    expect(calculateNights("2026-08-01", "2026-08-10")).toBe(9);
  });

  it("returns 0 for check-out before check-in", () => {
    expect(calculateNights("2026-08-10", "2026-08-01")).toBe(0);
  });

  it("returns 0 for same-day check-in and check-out", () => {
    expect(calculateNights("2026-08-01", "2026-08-01")).toBe(0);
  });
});

describe("validateSearch", () => {
  it("returns error for missing hostelId", () => {
    expect(validateSearch({ hostelId: "", checkIn: "2026-08-01", checkOut: "2026-08-02", guests: 2 }))
      .toBe("Choose a hostel.");
  });

  it("returns error for missing checkIn", () => {
    expect(validateSearch({ hostelId: "1", checkIn: "", checkOut: "2026-08-02", guests: 2 }))
      .toBe("Choose check-in and check-out dates.");
  });

  it("returns error for missing checkOut", () => {
    expect(validateSearch({ hostelId: "1", checkIn: "2026-08-01", checkOut: "", guests: 2 }))
      .toBe("Choose check-in and check-out dates.");
  });

  it("returns error for check-out before check-in", () => {
    expect(validateSearch({ hostelId: "1", checkIn: "2026-08-10", checkOut: "2026-08-01", guests: 2 }))
      .toBe("Check-out must be after check-in.");
  });

  it("returns error for guests < 1", () => {
    expect(validateSearch({ hostelId: "1", checkIn: "2026-08-01", checkOut: "2026-08-02", guests: 0 }))
      .toBe("Guests must be at least 1.");
  });

  it("returns error for non-integer guests", () => {
    expect(validateSearch({ hostelId: "1", checkIn: "2026-08-01", checkOut: "2026-08-02", guests: 1.5 }))
      .toBe("Guests must be at least 1.");
  });

  it("returns empty string for valid input", () => {
    expect(validateSearch({ hostelId: "1", checkIn: "2026-08-01", checkOut: "2026-08-02", guests: 2 }))
      .toBe("");
  });
});

describe("buildBookingInput", () => {
  const baseParams = {
    customerId: "cust-123",
    hostelId: "hostel-456",
    room: { roomType: "dorm", pricePerNight: 500 },
    checkIn: "2026-08-01",
    checkOut: "2026-08-04",
    guests: 2,
  };

  it("creates correct booking input with all required fields", () => {
    const input = buildBookingInput(baseParams);

    expect(input.reference).toMatch(/^DIRECT-\d+$/);
    expect(input.customerId).toBe("cust-123");
    expect(input.hostelId).toBe("hostel-456");
    expect(input.roomType).toBe("dorm");
    expect(input.checkInDate).toBe("2026-08-01");
    expect(input.checkOutDate).toBe("2026-08-04");
    expect(input.guests).toBe(2);
    expect(input.totalAmount).toBe(1500); // 3 nights * 500
    expect(input.payment.status).toBe("Pending");
    expect(input.payment.method).toBe("Mock UPI");
    expect(input.payment.amount).toBe(0);
    expect(input.source.name).toBe("Direct Booking Widget");
    expect(input.status).toBe("Draft");
  });

  it("calculates totalAmount correctly for different night counts", () => {
    expect(buildBookingInput({ ...baseParams, checkIn: "2026-08-01", checkOut: "2026-08-02" }).totalAmount)
      .toBe(500); // 1 night
    expect(buildBookingInput({ ...baseParams, checkIn: "2026-08-01", checkOut: "2026-08-03" }).totalAmount)
      .toBe(1000); // 2 nights
    expect(buildBookingInput({ ...baseParams, checkIn: "2026-08-01", checkOut: "2026-08-07" }).totalAmount)
      .toBe(3000); // 6 nights
  });

  it("handles room with different pricePerNight", () => {
    expect(buildBookingInput({ ...baseParams, room: { roomType: "private", pricePerNight: 1200 } }).totalAmount)
      .toBe(3600); // 3 nights * 1200
  });
});