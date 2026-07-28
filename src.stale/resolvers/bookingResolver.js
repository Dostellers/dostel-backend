const Booking = require('../models/Booking');

const bookingResolvers = {
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
