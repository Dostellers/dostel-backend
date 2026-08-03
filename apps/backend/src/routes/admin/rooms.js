const express = require('express');
const router = express.Router();
const Room = require('../../models/room');
const { authenticate } = require('../../middleware/authentication');
const { authorize } = require('../../middleware/authorization');

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(authorize(['admin', 'manager', 'staff']));

// GET /api/admin/rooms - Get all rooms with optional filtering
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            hostelId,
            status,
            type,
            search
        } = req.query;

        const query = {};

        // Apply filters
        if (hostelId) query.hostel = hostelId;
        if (status) query.status = status;
        if (type) query.type = type;
        if (search) {
            query.$or = [
                { number: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [rooms, total] = await Promise.all([
            Room.find(query)
                .populate('hostel', 'name location')
                .populate('roomType', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Room.countDocuments(query)
        ]);

        // Transform data for admin panel
        const transformedRooms = rooms.map(room => ({
            _id: room._id,
            id: room._id,
            number: room.number,
            type: room.type || room.roomType?.name || 'Standard',
            hostelId: room.hostel?._id,
            hostelName: room.hostel?.name || 'Unknown Hostel',
            status: room.status || 'available',
            availability: room.status === 'available' ? true : false,
            capacity: room.capacity || room.maxCapacity,
            pricePerNight: room.price || 0,
            floor: room.floor,
            size: room.size,
            bedType: room.bedType,
            view: room.view,
            amenities: room.amenities || [],
            features: room.features || [],
            description: room.description,
            images: room.images || [],
            createdAt: room.createdAt,
            updatedAt: room.updatedAt
        }));

        res.json({
            data: transformedRooms,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
    }
});

// GET /api/admin/rooms/:id - Get single room
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('hostel', 'name location address phone')
            .populate('roomType', 'name capacity price')
            .populate('amenities', 'name')
            .populate('images')
            .lean();

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const transformedRoom = {
            _id: room._id,
            id: room._id,
            number: room.number,
            type: room.type || room.roomType?.name || 'Standard',
            hostelId: room.hostel?._id,
            hostelName: room.hostel?.name || '',
            status: room.status || 'available',
            capacity: room.capacity || room.maxCapacity,
            pricePerNight: room.price || 0,
            floor: room.floor,
            size: room.size,
            bedType: room.bedType,
            view: room.view,
            amenities: room.amenities?.map(a => a._id) || [],
            features: room.features || [],
            description: room.description,
            images: room.images || [],
            msp: room.msp,
            additionalGuestPrice: room.additionalGuestPrice,
            accessibilityFeatures: room.accessibilityFeatures || [],
            petPolicy: room.petPolicy,
            restrictions: room.restrictions || [],
            reservations: room.reservations || [],
            createdAt: room.createdAt,
            updatedAt: room.updatedAt
        };

        res.json(transformedRoom);
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ message: 'Failed to fetch room', error: error.message });
    }
});

// POST /api/admin/rooms - Create new room
router.post('/', async (req, res) => {
    try {
        const {
            number,
            type,
            hostelId,
            status = 'available',
            capacity,
            pricePerNight: price,
            floor,
            size,
            bedType,
            view,
            amenities = [],
            features = [],
            description,
            msp,
            additionalGuestPrice,
            accessibilityFeatures = [],
            petPolicy,
            restrictions = []
        } = req.body;

        // Validate required fields
        if (!number || !hostelId) {
            return res.status(400).json({ 
                message: 'Missing required fields: number, hostelId' 
            });
        }

        const roomData = {
            number,
            type: type || 'Standard',
            hostel: hostelId,
            status: status || 'available',
            capacity: parseInt(capacity) || 1,
            price: parseFloat(price) || 0,
            floor: floor ? parseInt(floor) : undefined,
            size: size ? parseInt(size) : undefined,
            bedType,
            view,
            amenities,
            features,
            description,
            msp: msp ? parseFloat(msp) : undefined,
            additionalGuestPrice: additionalGuestPrice ? parseFloat(additionalGuestPrice) : undefined,
            accessibilityFeatures,
            petPolicy,
            restrictions
        };

        const room = new Room(roomData);
        await room.save();

        // Populate for response
        await room.populate('hostel', 'name');
        await room.populate('roomType', 'name');

        const transformedRoom = {
            _id: room._id,
            id: room._id,
            number: room.number,
            type: room.type || 'Standard',
            hostelName: room.hostel?.name || '',
            status: room.status || 'available',
            pricePerNight: room.price || 0,
            capacity: room.capacity,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt
        };

        res.status(201).json(transformedRoom);
    } catch (error) {
        console.error('Error creating room:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Room number already exists for this hostel' });
        }
        res.status(500).json({ message: 'Failed to create room', error: error.message });
    }
});

// PUT /api/admin/rooms/:id - Update room
router.put('/:id', async (req, res) => {
    try {
        const {
            number,
            type,
            hostelId,
            status,
            capacity,
            pricePerNight: price,
            floor,
            size,
            bedType,
            view,
            amenities = [],
            features = [],
            description,
            msp,
            additionalGuestPrice,
            accessibilityFeatures = [],
            petPolicy,
            restrictions = []
        } = req.body;

        const updateData = {};
        if (number) updateData.number = number;
        if (type) updateData.type = type;
        if (hostelId) updateData.hostel = hostelId;
        if (status) updateData.status = status;
        if (capacity) updateData.capacity = parseInt(capacity);
        if (price !== undefined) updateData.price = parseFloat(price);
        if (floor !== undefined) updateData.floor = parseInt(floor);
        if (size !== undefined) updateData.size = parseInt(size);
        if (bedType) updateData.bedType = bedType;
        if (view) updateData.view = view;
        if (amenities) updateData.amenities = amenities;
        if (features) updateData.features = features;
        if (description !== undefined) updateData.description = description;
        if (msp !== undefined) updateData.msp = parseFloat(msp);
        if (additionalGuestPrice !== undefined) updateData.additionalGuestPrice = parseFloat(additionalGuestPrice);
        if (accessibilityFeatures) updateData.accessibilityFeatures = accessibilityFeatures;
        if (petPolicy) updateData.petPolicy = petPolicy;
        if (restrictions) updateData.restrictions = restrictions;

        const room = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate('hostel', 'name')
        .populate('roomType', 'name');

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const transformedRoom = {
            _id: room._id,
            id: room._id,
            number: room.number,
            type: room.type || 'Standard',
            hostelName: room.hostel?.name || '',
            status: room.status || 'available',
            pricePerNight: room.price || 0,
            capacity: room.capacity,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt
        };

        res.json(transformedRoom);
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ message: 'Failed to update room', error: error.message });
    }
});

// DELETE /api/admin/rooms/:id - Delete room
router.delete('/:id', async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json({ message: 'Room deleted successfully', deletedId: req.params.id });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Failed to delete room', error: error.message });
    }
});

// PATCH /api/admin/rooms/:id/status - Update room status only
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const validStatuses = ['available', 'occupied', 'maintenance', 'out_of_order'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
            });
        }

        const room = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json({
            _id: room._id,
            id: room._id,
            status: room.status,
            message: 'Room status updated successfully'
        });
    } catch (error) {
        console.error('Error updating room status:', error);
        res.status(500).json({ message: 'Failed to update room status', error: error.message });
    }
});

// POST /api/admin/rooms/:id/reservation - Add a reservation to a room
router.post('/:id/reservation', async (req, res) => {
    try {
        const { startDate, endDate, customerId, bookingReference } = req.body;

        if (!startDate || !endDate || !bookingReference) {
            return res.status(400).json({ 
                message: 'Missing required fields: startDate, endDate, bookingReference' 
            });
        }

        const room = await Room.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    reservations: {
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        customer: customerId,
                        bookingReference
                    }
                }
            },
            { new: true, runValidators: true }
        );

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json({
            _id: room._id,
            id: room._id,
            reservations: room.reservations,
            message: 'Reservation added successfully'
        });
    } catch (error) {
        console.error('Error adding reservation:', error);
        res.status(500).json({ message: 'Failed to add reservation', error: error.message });
    }
});

module.exports = router;