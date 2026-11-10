const Booking = require('../src/models/booking');
const bookingResolvers = require('../src/resolvers/bookingResolver');

const bookingId = '507f1f77bcf86cd799439013';
const adminContext = { user: { __type: 'User', role: 'admin', isActive: true } };

const populatedBooking = (status) => ({
  sequenceStatus: status,
  populate: jest.fn().mockReturnThis(),
});

describe('changeBookingStatus', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test.each([
    ['Confirmed', 'CheckedIn'],
    ['CheckedIn', 'CheckedOut'],
    ['CheckedOut', 'Completed'],
  ])('allows %s -> %s', async (currentStatus, nextStatus) => {
    jest.spyOn(Booking, 'findById').mockResolvedValue({ sequenceStatus: currentStatus });
    const updated = populatedBooking(nextStatus);
    const update = jest.spyOn(Booking, 'findByIdAndUpdate').mockReturnValue(updated);

    const result = await bookingResolvers.Mutation.changeBookingStatus(null, {
      id: bookingId,
      status: nextStatus,
    }, adminContext);

    expect(update).toHaveBeenCalledWith(
      bookingId,
      { sequenceStatus: nextStatus },
      { new: true, runValidators: true }
    );
    expect(updated.populate).toHaveBeenNthCalledWith(1, 'customer');
    expect(updated.populate).toHaveBeenNthCalledWith(2, 'hostel');
    expect(result).toBe(updated);
  });

  test.each([
    ['Confirmed', 'CheckedOut'],
    ['Confirmed', 'Completed'],
    ['CheckedIn', 'Completed'],
  ])('rejects desk shortcut %s -> %s', async (currentStatus, nextStatus) => {
    jest.spyOn(Booking, 'findById').mockResolvedValue({ sequenceStatus: currentStatus });
    const update = jest.spyOn(Booking, 'findByIdAndUpdate');

    await expect(bookingResolvers.Mutation.changeBookingStatus(null, {
      id: bookingId,
      status: nextStatus,
    }, adminContext)).rejects.toThrow(`Invalid status transition: ${currentStatus} -> ${nextStatus}`);
    expect(update).not.toHaveBeenCalled();
  });

  test('rejects an unknown status', async () => {
    const find = jest.spyOn(Booking, 'findById');

    await expect(bookingResolvers.Mutation.changeBookingStatus(null, {
      id: bookingId,
      status: 'InHouse',
    }, adminContext)).rejects.toThrow('Invalid booking status: InHouse');
    expect(find).not.toHaveBeenCalled();
  });

  test('rejects a missing booking', async () => {
    jest.spyOn(Booking, 'findById').mockResolvedValue(null);

    await expect(bookingResolvers.Mutation.changeBookingStatus(null, {
      id: bookingId,
      status: 'CheckedIn',
    }, adminContext)).rejects.toThrow(`Booking with ID ${bookingId} not found`);
  });

  test('rejects an unauthenticated request before accessing bookings', async () => {
    const find = jest.spyOn(Booking, 'findById');

    await expect(bookingResolvers.Mutation.changeBookingStatus(null, {
      id: bookingId,
      status: 'CheckedIn',
    }, { user: null })).rejects.toMatchObject({ extensions: { code: 'UNAUTHENTICATED' } });
    expect(find).not.toHaveBeenCalled();
  });

  test('rejects a customer token before accessing bookings', async () => {
    const find = jest.spyOn(Booking, 'findById');

    await expect(bookingResolvers.Mutation.changeBookingStatus(null, {
      id: bookingId,
      status: 'CheckedIn',
    }, { user: { __type: 'Customer' } })).rejects.toMatchObject({ extensions: { code: 'FORBIDDEN' } });
    expect(find).not.toHaveBeenCalled();
  });
});
