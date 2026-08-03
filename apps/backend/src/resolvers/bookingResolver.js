const logger = require('../config/logger');
const Booking = require('../models/booking');

const BOOKING_STATUSES = ['Draft', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Completed', 'Abandoned'];
const transitionRules = {
    Draft: ['Confirmed'],
    Confirmed: ['Draft', 'CheckedIn', 'CheckedOut', 'Completed', 'Abandoned'],
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

const createBooking = async (ctx, { input }) => {
    try {
        const { reference, customerId, hostelId, roomType, checkInDate, checkOutDate, guests, totalAmount, payment, specialRequests } = input;

        // Validate required fields
        if (!customerId || !hostelId || !roomType || !checkInDate || !checkOutDate || !totalAmount || !payment) {
            throw new Error('Missing required booking fields');
        }

        // Calculate deposits and balances
        const isUPI = payment.method === 'UPI';
        const depositPercentage = payment.depositPercentage || (isUPI ? 25 : 20); // Default 20% deposit
        const depositRequired = (totalAmount * depositPercentage) / 100;
        const amountPaid = payment.amount || 0;
        const balanceDue = totalAmount - amountPaid;

        // Determine status based on payment
        let status = 'Draft'; // Default status
        const normalizedAmountPaid = Number(amountPaid);
        const normalizedTotal = Number(totalAmount);

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
            payment: {
                status: payment.status? payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase() : (amountPaid >= totalAmount? 'Completed' : 'Pending'),
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
        logger.info(`Booking created: ${savedBooking.reference}`);
        return savedBooking;
    } catch (error) {
        logger.error('Error creating booking:', error);
        throw error;
    }
};

const resolvers = {
    Query: {
        booking: getBookingById,
        bookings: () => Booking.find({}).populate('customer').populate('hostel').sort({ createdAt: -1 }),
        bookingsByCustomer: getBookingsByCustomer
    },
    Booking: {
        status: (booking) => booking.sequenceStatus || 'Draft'
    },
    Mutation: {
        createBooking,
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
        changeBookingStatus: async (_, { id, status }) => {
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
        }
    }
};

module.exports = resolvers;
module.exports.roundMoney = roundMoney;