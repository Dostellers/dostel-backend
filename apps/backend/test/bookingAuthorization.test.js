const Booking = require('../src/models/booking');
const bookingResolvers = require('../src/resolvers/bookingResolver');

const adminContext = { user: { __type: 'User', role: 'admin', isActive: true } };
const input = {
  reference: 'DOS-TEST',
  customerId: '507f1f77bcf86cd799439011',
  hostelId: '507f1f77bcf86cd799439012',
  roomType: 'Dorm',
  checkInDate: new Date('2026-08-21'),
  checkOutDate: new Date('2026-08-22'),
  guests: 1,
  totalAmount: 1000,
  payment: { status: 'Pending', method: 'Cash', amount: 0 },
  paymentMethod: 'Cash',
  transactionId: 'pending',
  chargeId: 'pending',
};

const expectUnauthenticated = async (resolver, args) => {
  await expect(resolver(null, args, { user: null })).rejects.toMatchObject({
    extensions: { code: 'UNAUTHENTICATED' },
  });
};

describe('admin booking authorization', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('protects createBooking before accessing customer data', async () => {
    const model = jest.spyOn(require('mongoose'), 'model');

    await expectUnauthenticated(bookingResolvers.Mutation.createBooking, { input });
    expect(model).not.toHaveBeenCalled();
  });

  test('protects updateBooking before accessing bookings', async () => {
    const update = jest.spyOn(Booking, 'findByIdAndUpdate');

    await expectUnauthenticated(bookingResolvers.Mutation.updateBooking, {
      id: '507f1f77bcf86cd799439013',
      input,
    });
    expect(update).not.toHaveBeenCalled();
  });

  test('protects adminBookings before accessing bookings', async () => {
    const find = jest.spyOn(Booking, 'find');

    await expectUnauthenticated(bookingResolvers.Query.adminBookings, {});
    expect(find).not.toHaveBeenCalled();
  });

  test.each([
    [{ __type: 'Customer' }],
    [{ __type: 'User', role: 'guest', isActive: true }],
    [{ __type: 'User', role: 'admin', isActive: false }],
  ])('rejects a non-admin user before accessing bookings', async (user) => {
    const find = jest.spyOn(Booking, 'find');

    await expect(bookingResolvers.Query.adminBookings(null, {}, { user })).rejects.toMatchObject({
      extensions: { code: 'FORBIDDEN' },
    });
    expect(find).not.toHaveBeenCalled();
  });

  test('returns paginated admin bookings for an authenticated admin', async () => {
    const query = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([{ reference: 'DOS-TEST' }]),
    };
    jest.spyOn(Booking, 'find').mockReturnValue(query);
    jest.spyOn(Booking, 'countDocuments').mockResolvedValue(1);

    await expect(bookingResolvers.Query.adminBookings(null, {
      limit: 10,
      offset: 0,
    }, adminContext)).resolves.toEqual({
      bookings: [{ reference: 'DOS-TEST' }],
      total: 1,
      page: 1,
    });
  });
});
