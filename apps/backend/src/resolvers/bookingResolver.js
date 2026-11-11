const logger = require('../config/logger');
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const { AuthenticationError, ForbiddenError } = require('apollo-server-errors');
// Hostelworld rate schedules — used by createBooking + processBookingPayment below
const {
  resolvePaymentSchedule,
  paymentStatusForAmount,
  RATE_TYPES,
} = require('../services/ratePlanService');

const ADMIN_ROLES = new Set(['admin', 'manager', 'staff']);

const requireAdmin = (context) => {
    if (!context || !context.user) {
        throw new AuthenticationError('Authentication required');
    }
    if (
        context.user.__type !== 'User' ||
        context.user.isActive === false ||
        !ADMIN_ROLES.has(context.user.role)
    ) {
        throw new ForbiddenError('Admin access required');
    }
    return context.user;
};

const BOOKING_STATUSES = ['Draft', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Completed', 'Abandoned'];
const transitionRules = {
    Draft: ['Confirmed'],
    Confirmed: ['Draft', 'CheckedIn', 'Abandoned'],
    CheckedIn: ['CheckedOut', 'Abandoned'],
    CheckedOut: ['Completed', 'Abandoned'],
    Completed: [],
    Abandoned: []
};
const roundMoney = amount => Math.round((Number(amount) + Number.EPSILON) * 100) / 100;

const getBookingModel = () => {
    try {
        const mongoose = require('mongoose');
        return mongoose.model('Booking');
    } catch (error) {
        logger.error('Failed to get Booking model:', error);
        throw error;
    }
};

const getBookingById = async (ctx, { id }) => {
    try {
        const Booking = getBookingModel();
        const booking = await Booking.findById(id)
          .populate('customer')
          .populate('hostel')
          .exec();

        if (!booking) {
            throw new Error(`Booking with ID ${id} not found`);
        }

        return booking;
    } catch (error) {
        logger.error('Error fetching booking:', error);
        throw error;
    }
};

const getBookingsByCustomer = async (ctx, { customerId }) => {
    try {
        const Booking = getBookingModel();
        return await Booking.find({ customer: customerId })
          .populate('hostel')
          .sort({ createdAt: -1 })
          .exec();
    } catch (error) {
        logger.error('Error fetching bookings by customer:', error);
        throw error;
    }
};

const createBooking = async (_, { input }, context) => {
    try {
        requireAdmin(context);
        const { reference, customerId, hostelId, roomType, checkInDate, checkOutDate, guests, totalAmount, payment, specialRequests } = input;

        // Validate required fields
        if (!customerId || !hostelId || !roomType || !checkInDate || !checkOutDate || !totalAmount || !payment) {
            throw new Error('Missing required booking fields');
        }

        // Fetch customer to get tier and apply discount
        const Customer = mongoose.model('Customer');
        const customer = await Customer.findById(customerId);

        let discountPercentage = 0;
        let appliedDiscount = 0;

        if (customer) {
            // Apply tier-based discounts
            switch (customer.tier) {
                case 'Dosteller':
                    discountPercentage = 15;  // 15% discount for Dosteller members
                    break;
                case 'Contributor':
                    discountPercentage = 10;  // 10% discount for Contributor members
                    break;
                case 'Explorer':
                default:
                    discountPercentage = 0;   // No discount for Explorer tier
                    break;
            }

            // Calculate discount based on tier
            if (discountPercentage > 0) {
                appliedDiscount = Math.round(totalAmount * discountPercentage / 100);
            }
        }

        // Hostelworld-style schedule: deposit now, balance at property (unless Pay Now).
        // Persist discounted net as totalAmount so deposit/balance stay on one base.
        const netTotal = roundMoney(totalAmount - appliedDiscount);
        const schedule = resolvePaymentSchedule(
            input.rateType || RATE_TYPES.FREE_CANCELLATION,
            netTotal,
            payment.method || input.paymentMethod
        );
        const amountPaid = payment.amount || 0;
        const balanceDue = roundMoney(Math.max(netTotal - amountPaid, 0));
        // Until deposit is captured, property balance is still the post-deposit remainder
        const payAtProperty = amountPaid >= schedule.depositRequired
          ? schedule.payAtProperty
          : (schedule.balanceCollection === 'PREPAID' ? 0 : schedule.payAtProperty);
        const payStatus = paymentStatusForAmount(amountPaid, schedule.depositRequired, netTotal);

        let status = 'Draft';
        const normalizedAmountPaid = Number(amountPaid);
        if (normalizedAmountPaid >= netTotal || (schedule.depositRequired > 0 && normalizedAmountPaid >= schedule.depositRequired)) {
            status = 'Confirmed';
        }

        const newBooking = new Booking({
            reference: reference || `DOS-${Date.now()}`,
            customer: customerId,
            hostel: hostelId,
            roomType,
            checkInDate,
            checkOutDate,
            guests,
            totalAmount: netTotal,
            rateType: schedule.rateType,
            depositPercentage: schedule.depositPercentage,
            depositRequired: schedule.depositRequired,
            amountPaid,
            balanceDue,
            payAtProperty,
            balanceCollection: schedule.balanceCollection,
            refundable: schedule.refundable,
            refundAs: schedule.refundAs,
            cancellationDeadlineHours: schedule.cancellationDeadlineHours,
            cancellationPolicy: schedule.cancellationPolicy,
            discountApplied: appliedDiscount,
            payment: {
                status: payment.status
                  ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase()
                  : payStatus,
                method: payment.method,
                transactionId: payment.transactionId,
                amount: payment.amount
            },
            specialRequests,
            sequenceStatus: status,
            source: input.source? {
                name: input.source.name,
                referenceId: input.source.referenceId,
                additionalInfo: input.source.additionalInfo
            } : undefined
        });

        const savedBooking = await newBooking.save();
        logger.info(`Booking created: ${savedBooking.reference} (Tier: ${customer?.tier || 'none'}, Discount: ₹${appliedDiscount})`);
        return savedBooking;
    } catch (error) {
        logger.error('Error creating booking:', error);
        throw error;
    }
};

const updateBooking = async (_, { id, input }, context) => {
    requireAdmin(context);

    const update = {
        reference: input.reference,
        customer: input.customerId,
        hostel: input.hostelId,
        roomType: input.roomType,
        checkInDate: input.checkInDate,
        checkOutDate: input.checkOutDate,
        guests: input.guests,
        totalAmount: input.totalAmount,
        payment: input.payment,
        specialRequests: input.specialRequests,
        source: input.source,
        loyaltyPointsRedeemed: input.loyaltyPointsRedeemed,
        discount: input.discount,
        sequenceStatus: input.status
    };

    Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);
    const booking = await Booking.findByIdAndUpdate(id, update, { new: true, runValidators: true })
        .populate('customer')
        .populate('hostel');

    if (!booking) {
        throw new Error(`Booking with ID ${id} not found`);
    }

    return booking;
};

const adminBookings = async (_, { hostelId, status, dateFrom, dateTo, search, limit = 20, offset = 0 }, context) => {
    requireAdmin(context);

    const filter = {};
    if (hostelId) filter.hostel = hostelId;
    if (status) filter.sequenceStatus = status;
    if (dateFrom || dateTo) {
        filter.checkInDate = {};
        if (dateFrom) filter.checkInDate.$gte = dateFrom;
        if (dateTo) filter.checkInDate.$lte = dateTo;
    }
    if (search) filter.reference = { $regex: search, $options: 'i' };

    const normalizedLimit = Math.min(Math.max(limit, 1), 100);
    const normalizedOffset = Math.max(offset, 0);
    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate('customer')
            .populate('hostel')
            .sort({ createdAt: -1 })
            .skip(normalizedOffset)
            .limit(normalizedLimit)
            .exec(),
        Booking.countDocuments(filter)
    ]);

    return {
        bookings,
        total,
        page: Math.floor(normalizedOffset / normalizedLimit) + 1
    };
};

const processBookingPayment = async (_, { id, input }) => {
    try {
        const { paymentMethod, transactionId, chargeId, amount, method } = input;
        const Booking = getBookingModel();

        const booking = await Booking.findById(id);
        if (!booking) {
            throw new Error(`Booking with ID ${id} not found`);
        }

        const schedule = resolvePaymentSchedule(
            booking.rateType || RATE_TYPES.FREE_CANCELLATION,
            booking.totalAmount,
            paymentMethod || method || booking.payment?.method
        );
        const chargeAmount = amount != null
          ? roundMoney(amount)
          : schedule.depositRequired;
        const paidTotal = roundMoney(Number(booking.amountPaid || 0) + chargeAmount);
        const normalizedTotal = roundMoney(booking.totalAmount);
        const remaining = roundMoney(Math.max(normalizedTotal - paidTotal, 0));
        const newPaymentStatus = paymentStatusForAmount(paidTotal, schedule.depositRequired, normalizedTotal);
        const sequenceStatus = paidTotal >= schedule.depositRequired ? 'Confirmed' : booking.sequenceStatus;

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            {
                $set: {
                    'payment.status': newPaymentStatus,
                    'payment.method': paymentMethod || method,
                    'payment.transactionId': transactionId,
                    'payment.amount': paidTotal,
                    'payment.chargeId': chargeId,
                    amountPaid: paidTotal,
                    balanceDue: remaining,
                    payAtProperty: schedule.balanceCollection === 'AT_PROPERTY' ? remaining : 0,
                    depositRequired: schedule.depositRequired,
                    depositPercentage: schedule.depositPercentage,
                    sequenceStatus
                }
            },
            { new: true, runValidators: true }
        ).populate('customer').populate('hostel');

        logger.info(`Payment processed for booking ${updatedBooking.reference}: ${newPaymentStatus}`);

        return updatedBooking;
    } catch (error) {
        logger.error('Error processing payment:', error);
        throw error;
    }
};

const dashboardStats = async (_, { hostelId, dayStart, nextDayStart }) => {
    const start = new Date(dayStart);
    const end = new Date(nextDayStart);
    if (!(start < end)) {
        throw new Error('dayStart/nextDayStart must be valid ascending boundaries');
    }

    const Room = mongoose.model('Room');
    const hostelFilter = hostelId ? { hostel: hostelId } : {};
    const bookingHostel = hostelId ? { hostel: hostelId } : {};

    const [roomsAvailable, roomsOccupied, checkInsToday, checkOutsToday, openBookings] = await Promise.all([
        Room.countDocuments({ ...hostelFilter, status: 'available' }),
        Room.countDocuments({ ...hostelFilter, status: 'occupied' }),
        Booking.countDocuments({
            ...bookingHostel,
            sequenceStatus: { $nin: ['Draft', 'Abandoned'] },
            checkInDate: { $gte: start, $lt: end },
        }),
        Booking.countDocuments({
            ...bookingHostel,
            sequenceStatus: { $nin: ['Draft', 'Abandoned'] },
            checkOutDate: { $gte: start, $lt: end },
        }),
        Booking.countDocuments({
            ...bookingHostel,
            sequenceStatus: { $in: ['Draft', 'Confirmed', 'CheckedIn'] },
        }),
    ]);

    const denom = roomsAvailable + roomsOccupied;
    const occupancyPercent = denom === 0 ? 0 : Math.round((roomsOccupied / denom) * 100);

    return {
        occupancyPercent,
        roomsAvailable,
        checkInsToday,
        checkOutsToday,
        openBookings,
    };
};

const resolvers = {
    Query: {
        booking: getBookingById,
        bookings: () => Booking.find({}).populate('customer').populate('hostel').sort({ createdAt: -1 }),
        bookingsByCustomer: getBookingsByCustomer,
        adminBookings,
        dashboardStats,
    },
    Booking: {
        status: (booking) => booking.sequenceStatus || 'Draft'
    },
    Mutation: {
        createBooking,
        updateBooking,
        confirmBooking: async (_, { id }) => Booking.findByIdAndUpdate(
            id,
            { sequenceStatus: 'Confirmed' },
            { new: true }
        ).populate('customer').populate('hostel'),
        completeBooking: async (_, { id }) => Booking.findByIdAndUpdate(
            id,
            { sequenceStatus: 'Completed' },
            { new: true }
        ).populate('customer').populate('hostel'),
        abandonBooking: async (_, { id }) => Booking.findByIdAndUpdate(
            id,
            { sequenceStatus: 'Abandoned' },
            { new: true }
        ).populate('customer').populate('hostel'),
        changeBookingStatus: async (_, { id, status }, context) => {
            requireAdmin(context);
            if (!BOOKING_STATUSES.includes(status)) {
                throw new Error(`Invalid booking status: ${status}`);
            }

            const current = await Booking.findById(id);
            if (!current) {
                throw new Error(`Booking with ID ${id} not found`);
            }

            const currentStatus = current.sequenceStatus || 'Draft';
            const allowed = transitionRules[currentStatus] || [];
            if (!allowed.includes(status)) {
                throw new Error(`Invalid status transition: ${currentStatus} -> ${status}`);
            }

            return Booking.findByIdAndUpdate(
                id,
                { sequenceStatus: status },
                { new: true, runValidators: true }
            ).populate('customer').populate('hostel');
        },
        processBookingPayment: processBookingPayment
    }
};

module.exports = resolvers;
module.exports.roundMoney = roundMoney;
