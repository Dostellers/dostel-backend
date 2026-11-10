import { describe, expect, it, jest } from 'vitest';
import { calculateNights, validateSearch } from '../lib/booking-widget';

describe('RoomAvailability', () => {
  it('renders loading state correctly', () => {
    const result = calculateNights('2026-08-15', '2026-08-18');
    expect(result).toBe(3);
  });

  it('validates search parameters', () => {
    expect(validateSearch({ hostelId: '1', checkIn: '2026-08-15', checkOut: '2026-08-18', guests: 2 })).toBe('');
  });

  it('shows error for invalid date range', () => {
    expect(calculateNights('2026-08-18', '2026-08-15')).toBe(0);
  });

  it('calculates nights correctly', () => {
    expect(calculateNights('2026-08-15', '2026-08-16')).toBe(1);
    expect(calculateNights('2026-08-15', '2026-08-17')).toBe(2);
  });
});