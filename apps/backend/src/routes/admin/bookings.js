const express = require('express');
const router = express.Router();
const Booking = require('../../models/booking');
const { authenticate } = require('../../middleware/authentication');
const { authorize } = require('../../middleware/authorization');

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(authorize(['admin', 'manager', 'staff']));

// GET /api/admin/bookings - Get all bookings with optional filtering
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            hostelId,
            startDate,
            endDate,
            search
        } = req.query;

        const query = {};

        // Apply filters
        if (status) query.status = status;
        if (hostelId) query.hostel = hostelId;
        if (startDate && endDate) {
            query.checkInDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            query.checkInDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.checkInDate = { $lte: new Date(endDate) };
        }
        if (search) {
            query.$or = [
                { reference: { $regex: search, $options: 'i' } },
                { 'customer.name': { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [bookings, total] = await Promise.all([
            Booking.find(query)
                .populate('customer', 'name email phone')
                .populate('hostel', 'name location')
                .populate('roomType', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Booking.countDocuments(query)
        ]);

        // Transform data for admin panel
        const transformedBookings = bookings.map(booking => ({
            _id: booking._id,
            id: booking._id,
            reference: booking.reference,
            guestName: booking.customer?.name || 'Unknown Guest',
            hostelName: booking.hostel?.name || 'Unknown Hostel',
            roomNumber: booking.roomType?.name || booking.roomType || 'N/A',
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
            status: booking.status?.toLowerCase() || 'pending',
            total: booking.totalAmount,
            paymentStatus: booking.payment?.status?.toLowerCase() || 'pending',
            specialRequests: booking.specialRequests,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }));

        res.json({
            data: transformedBookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
});

// GET /api/admin/bookings/:id - Get single booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('customer', 'name email phone address')
            .populate('hostel', 'name location address phone')
            .populate('roomType', 'name capacity price')
            .populate('discount.coupon', 'code discountPercent discountAmount')
            .lean();

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Transform for admin panel
        const transformedBooking = {
            _id: booking._id,
            id: booking._id,
            reference: booking.reference,
            guestName: booking.customer?.name || 'Unknown Guest',
            guestEmail: booking.customer?.email || '',
            guestPhone: booking.customer?.phone || '',
            hostelId: booking.hostel?._id,
            hostelName: booking.hostel?.name || 'Unknown Hostel',
            roomId: booking.roomType?._id,
            roomNumber: booking.roomType?.name || booking.roomType || 'N/A',
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
            guests: booking.guests,
            status: booking.status?.toLowerCase() || 'pending',
            total: booking.totalAmount,
            payment: {
                status: booking.payment?.status?.toLowerCase() || 'pending',
                method: booking.payment?.method || '',
                transactionId: booking.payment?.transactionId || '',
                amount: booking.payment?.amount || 0
            },
            specialRequests: booking.specialRequests,
            discount: booking.discount ? {
                couponId: booking.discount.coupon?._id,
                couponCode: booking.discount.coupon?.code || '',
                amount: booking.discount.amount || 0,
                percentage: booking.discount.percentage || 0
            } : null,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };

        res.json(transformedBooking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
    }
});

// POST /api/admin/bookings - Create new booking
router.post('/', async (req, res) => {
    try {
        const {
            guestName,
            guestEmail,
            guestPhone,
            hostelId,
            roomId,
            checkIn,
            checkOut,
            guests = 1,
            status = 'Draft',
            total,
            payment,
            specialRequests,
            discount
        } = req.body;

        // Validate required fields
        if (!guestName || !hostelId || !checkIn || !checkOut || !total) {
            return res.status(400).json({ 
                message: 'Missing required fields: guestName, hostelId, checkIn, checkOut, total' 
            });
        }

        // Generate reference
        const reference = `BKG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        const bookingData = {
            reference,
            customer: {
                name: guestName,
                email: guestEmail,
                phone: guestPhone
            },
            hostel: hostelId,
            roomType: roomId,
            checkInDate: new Date(checkIn),
            checkOutDate: new Date(checkOut),
            guests: parseInt(guests),
            totalAmount: parseFloat(total),
            status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
            specialRequests,
            payment: payment || {
                status: 'Pending',
                method: 'Cash',
                amount: parseFloat(total)
            }
        };

        if (discount) {
            bookingData.discount = {
                amount: discount.amount || 0,
                percentage: discount.percentage || 0
            };
        }

        const booking = new Booking(bookingData);
        await booking.save();

        // Populate for response
        await booking.populate('customer', 'name email phone');
        await booking.populate('hostel', 'name');
        await booking.populate('roomType', 'name');

        const transformedBooking = {
            _id: booking._id,
            id: booking._id,
            reference: booking.reference,
            guestName: booking.customer?.name || guestName,
            hostelName: booking.hostel?.name || '',
            roomNumber: booking.roomType?.name || '',
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
            status: booking.status?.toLowerCase() || 'pending',
            total: booking.totalAmount,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };

        res.status(201).json(transformedBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Booking reference already exists' });
        }
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
});

// PUT /api/admin/bookings/:id - Update booking
router.put('/:id', async (req, res) => {
    try {
        const {
            guestName,
            guestEmail,
            guestPhone,
            hostelId,
            roomId,
            checkIn,
            checkOut,
            guests,
            status,
            total,
            payment,
            specialRequests,
            discount
        } = req.body;

        const updateData = {};
        if (guestName) updateData['customer.name'] = guestName;
        if (guestEmail) updateData['customer.email'] = guestEmail;
        if (guestPhone) updateData['customer.phone'] = guestPhone;
        if (hostelId) updateData.hostel = hostelId;
        if (roomId) updateData.roomType = roomId;
        if (checkIn) updateData.checkInDate = new Date(checkIn);
        if (checkOut) updateData.checkOutDate = new Date(checkOut);
        if (guests) updateData.guests = parseInt(guests);
        if (total) updateData.totalAmount = parseFloat(total);
        if (specialRequests !== undefined) updateData.specialRequests = specialRequests;
        if (status) updateData.status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        if (payment) updateData.payment = payment;
        if (discount) updateData.discount = discount;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate('customer', 'name email phone')
        .populate('hostel', 'name')
        .populate('roomType', 'name');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const transformedBooking = {
            _id: booking._id,
            id: booking._id,
            reference: booking.reference,
            guestName: booking.customer?.name || '',
            hostelName: booking.hostel?.name || '',
            roomNumber: booking.roomType?.name || '',
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
            status: booking.status?.toLowerCase() || 'pending',
            total: booking.totalAmount,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };

        res.json(transformedBooking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Failed to update booking', error: error.message });
    }
});

// DELETE /api/admin/bookings/:id - Delete booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking deleted successfully', deletedId: req.params.id });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Failed to delete booking', error: error.message });
    }
});

// PATCH /api/admin/bookings/:id/status - Update booking status only
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { $set: { status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() } },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({
            _id: booking._id,
            id: booking._id,
            status: booking.status?.toLowerCase(),
            message: 'Status updated successfully'
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Failed to update booking status', error: error.message });
    }
});

// PATCH /api/admin/bookings/:id/payment - Update payment status
router.patch('/:id/payment', async (req, res) => {
    try {
        const { status, method, transactionId, amount } = req.body;

        const updateData = {};
        if (status) updateData['payment.status'] = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        if (method) updateData['payment.method'] = method;
        if (transactionId) updateData['payment.transactionId'] = transactionId;
        if (amount) updateData['payment.amount'] = parseFloat(amount);

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({
            _id: booking._id,
            id: booking._id,
            payment: {
                status: booking.payment?.status?.toLowerCase(),
                method: booking.payment?.method,
                transactionId: booking.payment?.transactionId,
                amount: booking.payment?.amount
            },
            message: 'Payment updated successfully'
        });
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Failed to update payment', error: error.message });
    }
});

module.exports = router;