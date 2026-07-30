const Booking = require('../models/booking');
const Customer = require('../models/customer');

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const roundMoney = amount => Math.round((Number(amount) + Number.EPSILON) * 100) / 100;

const paymentSummary = booking => {
    const totalAmount = roundMoney(booking.totalAmount);
    const depositPercentage = booking.depositPercentage == null ? 25 : booking.depositPercentage;
    const depositRequired = roundMoney(totalAmount * depositPercentage / 100);
    const payment = booking.payment || {};
    const amountPaid = payment.status === 'Completed' ? Math.min(roundMoney(payment.amount || 0), totalAmount) : 0;

    return {
        depositPercentage,
        depositRequired,
        amountPaid,
        balanceDue: roundMoney(Math.max(totalAmount - amountPaid, 0))
    };
};

const bookingResolvers = {
    Booking: {
        depositPercentage: booking => paymentSummary(booking).depositPercentage,
        depositRequired: booking => paymentSummary(booking).depositRequired,
        amountPaid: booking => paymentSummary(booking).amountPaid,
        balanceDue: booking => paymentSummary(booking).balanceDue
    },
    Query: {
        // Get all bookings
        bookings: async () => {
            return await Booking.find().populate('customer').populate('hostel').populate('discount.coupon');
        },
        // Get a single booking by ID
        booking: async (_, { id }) => {
            return await Booking.findById(id).populate('customer').populate('hostel').populate('discount.coupon');
        },
        // Get all draft bookings
        draftBookings: async () => {
            return await Booking.find({ status: 'Draft' }).populate('customer').populate('hostel').populate('discount.coupon');
        },

        bookingsByCustomer: async (_, { customerId }) => {
            return await Booking.find({ customer: customerId }).populate('hostel').populate('coupon');
        },
        
        bookingsByStatus: async (_, { status }) => {
            return await Booking.find({ status }).populate('customer').populate('hostel').populate('coupon');
        },

        adminBookings: async (_, args) => {
            const limit = Math.min(Math.max(args.limit || 20, 1), 100);
            const offset = Math.max(args.offset || 0, 0);
            const filter = {};

            if (args.hostelId) filter.hostel = args.hostelId;
            if (args.status) filter.status = args.status;
            if (args.dateFrom || args.dateTo) {
                filter.checkInDate = {};
                if (args.dateFrom) filter.checkInDate.$gte = args.dateFrom;
                if (args.dateTo) filter.checkInDate.$lte = args.dateTo;
            }

            if (args.search && args.search.trim()) {
                const search = new RegExp(escapeRegex(args.search.trim()), 'i');
                const customerIds = await Customer.distinct('_id', { fullName: search });
                filter.$or = [
                    { reference: search },
                    { customer: { $in: customerIds } }
                ];
            }

            const [total, bookings] = await Promise.all([
                Booking.countDocuments(filter),
                Booking.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(offset)
                    .limit(limit)
                    .populate('customer')
                    .populate('hostel')
                    .populate('discount.coupon')
            ]);

            return {
                bookings,
                total,
                page: Math.floor(offset / limit) + 1
            };
        },

        // Get all abandoned bookings
        abandonedBookings: async () => {
            return await Booking.find({ status: 'Abandoned' }).populate('customer').populate('hostel').populate('discount.coupon');
        }
    },
    Mutation: {
        // Create a new booking
        createBooking: async (_, { input }) => {
            const newBooking = new Booking(input);
            return await newBooking.save();
        },
        // Update an existing booking
        updateBooking: async (_, { id, input }) => {
            return await Booking.findByIdAndUpdate(id, input, { new: true }).populate('customer').populate('hostel').populate('discount.coupon');
        },
        // Delete a booking
        deleteBooking: async (_, { id }) => {
            return await Booking.findByIdAndDelete(id);
        },
        // Apply a coupon to a booking
        applyCouponToBooking: async (_, { bookingId, couponId }) => {
            const booking = await Booking.findById(bookingId);
            booking.discount.coupon = couponId;
            // Logic to calculate and apply the discount can be added here
            return await booking.save();
        },
        // Confirm a booking
        confirmBooking: async (_, { id }) => {
            const booking = await Booking.findById(id);
            booking.status = 'Confirmed';
            return await booking.save();
        },

        // Mark a booking as completed
        completeBooking: async (_, { id }) => {
            const booking = await Booking.findById(id);
            booking.status = 'Completed';
            return await booking.save();
        },

        // Mark a booking as abandoned
        abandonBooking: async (_, { id }) => {
            const booking = await Booking.findById(id);
            booking.status = 'Abandoned';
            return await booking.save();
        },

        // Reactivate an abandoned booking
        reactivateBooking: async (_, { id }) => {
            const booking = await Booking.findById(id);
            if (booking.status === 'Abandoned') {
                booking.status = 'Draft';
                return await booking.save();
            }
            throw new Error('Only abandoned bookings can be reactivated.');
        },

        changeBookingStatus: async (_, { id, status }) => {
            return await Booking.findByIdAndUpdate(id, { status }, { new: true }).populate('customer').populate('hostel').populate('coupon');
        }
    }
};

module.exports = bookingResolvers;
module.exports.roundMoney = roundMoney;
module.exports.paymentSummary = paymentSummary;
