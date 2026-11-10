const logger = require('../config/logger');
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const { AuthenticationError, ForbiddenError } = require('apollo-server-errors');

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

        // Calculate deposits and balances
        const isUPI = payment.method === 'UPI';
        const depositPercentage = payment.depositPercentage || (isUPI ? 25 : 20); // Default 20% deposit
        const depositRequired = ((totalAmount - appliedDiscount) * depositPercentage) / 100;
        const amountPaid = payment.amount || 0;
        const balanceDue = (totalAmount - appliedDiscount) - amountPaid;

        // Determine status based on payment
        let status = 'Draft'; // Default status
        const normalizedAmountPaid = Number(amountPaid);
        const normalizedTotal = Number(totalAmount - appliedDiscount);

        if (normalizedAmountPaid >= normalizedTotal) {
            status = 'Confirmed';
        } else if (depositRequired > 0 && normalizedAmountPaid >= depositRequired) {
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
            totalAmount,
            depositPercentage,
            depositRequired,
            amountPaid,
            balanceDue,
            discountApplied: appliedDiscount,
            payment: {
                status: payment.status? payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase() : (amountPaid >= totalAmount - appliedDiscount? 'Completed' : 'Pending'),
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
        const { paymentMethod, transactionId, chargeId } = input;
        const Booking = getBookingModel();

        const booking = await Booking.findById(id);
        if (!booking) {
            throw new Error(`Booking with ID ${id} not found`);
        }

        const normalizedAmountPaid = Number(booking.amountPaid);
        const normalizedTotal = Number(booking.totalAmount);

        const newPaymentStatus = normalizedAmountPaid >= normalizedTotal ? 'Completed' : 'Pending';

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            {
                $set: {
                    'payment.status': newPaymentStatus,
                    'payment.method': paymentMethod,
                    'payment.transactionId': transactionId,
                    'payment.amount': normalizedTotal,
                    'payment.chargeId': chargeId,
                    amountPaid: normalizedTotal,
                    balanceDue: 0,
                    sequenceStatus: 'Completed'
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

const resolvers = {
    Query: {
        booking: getBookingById,
        bookings: () => Booking.find({}).populate('customer').populate('hostel').sort({ createdAt: -1 }),
        bookingsByCustomer: getBookingsByCustomer,
        adminBookings
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
