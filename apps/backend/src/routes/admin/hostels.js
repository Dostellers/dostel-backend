const express = require('express');
const router = express.Router();
const Hostel = require('../../models/hostel');
const { authenticate } = require('../../middleware/authentication');
const { authorize } = require('../../middleware/authorization');

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(authorize(['admin', 'manager', 'staff']));

// GET /api/admin/hostels - Get all hostels with optional filtering
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            city,
            search
        } = req.query;

        const query = {};

        // Apply filters
        if (status) query.status = status;
        if (city) query.city = city;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [hostels, total] = await Promise.all([
            Hostel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Hostel.countDocuments(query)
        ]);

        // Transform data for admin panel
        const transformedHostels = hostels.map(hostel => ({
            _id: hostel._id,
            id: hostel._id,
            name: hostel.name,
            city: hostel.city,
            country: hostel.country,
            description: hostel.description,
            shortDescription: hostel.shortDescription,
            rating: hostel.rating,
            reviewsCount: hostel.reviewsCount,
            pricePerNight: hostel.pricePerNight,
            featured: hostel.featured,
            image: hostel.image,
            thumbnail: hostel.thumbnail,
            amenities: hostel.amenities || [],
            roomsCount: hostel.rooms?.length || 0,
            owner: hostel.owner,
            isActive: hostel.isActive,
            isVerified: hostel.isVerified,
            createdAt: hostel.createdAt,
            updatedAt: hostel.updatedAt
        }));

        res.json({
            data: transformedHostels,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching hostels:', error);
        res.status(500).json({ message: 'Failed to fetch hostels', error: error.message });
    }
});

// GET /api/admin/hostels/:id - Get single hostel
router.get('/:id', async (req, res) => {
    try {
        const hostel = await Hostel.findById(req.params.id)
            .populate('amenities')
            .populate('rooms')
            .lean();

        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }

        const transformedHostel = {
            _id: hostel._id,
            id: hostel._id,
            name: hostel.name,
            slug: hostel.slug,
            city: hostel.city,
            country: hostel.country,
            description: hostel.description,
            shortDescription: hostel.shortDescription,
            rating: hostel.rating,
            reviewsCount: hostel.reviewsCount,
            pricePerNight: hostel.pricePerNight,
            featured: hostel.featured,
            image: hostel.image,
            thumbnail: hostel.thumbnail,
            amenities: hostel.amenities || [],
            rooms: hostel.rooms || [],
            owner: hostel.owner,
            isActive: hostel.isActive,
            isVerified: hostel.isVerified,
            createdAt: hostel.createdAt,
            updatedAt: hostel.updatedAt
        };

        res.json(transformedHostel);
    } catch (error) {
        console.error('Error fetching hostel:', error);
        res.status(500).json({ message: 'Failed to fetch hostel', error: error.message });
    }
});

// POST /api/admin/hostels - Create new hostel
router.post('/', async (req, res) => {
    try {
        const {
            name,
            city,
            country,
            description,
            shortDescription,
            rating,
            reviewsCount,
            pricePerNight,
            featured,
            image,
            thumbnail,
            amenities = [],
            owner,
            isActive = true,
            isVerified = false
        } = req.body;

        // Validate required fields
        if (!name || !city || !country || !description || pricePerNight === undefined) {
            return res.status(400).json({ 
                message: 'Missing required fields: name, city, country, description, pricePerNight' 
            });
        }

        const hostel = new Hostel({
            name,
            city,
            country,
            description,
            shortDescription,
            rating: rating || 0,
            reviewsCount: reviewsCount || 0,
            pricePerNight: parseFloat(pricePerNight),
            featured: featured || false,
            image,
            thumbnail,
            amenities,
            owner,
            isActive,
            isVerified
        });

        await hostel.save();

        res.status(201).json({
            _id: hostel._id,
            id: hostel._id,
            name: hostel.name,
            city: hostel.city,
            country: hostel.country,
            createdAt: hostel.createdAt,
            updatedAt: hostel.updatedAt
        });
    } catch (error) {
        console.error('Error creating hostel:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Hostel with this name already exists' });
        }
        res.status(500).json({ message: 'Failed to create hostel', error: error.message });
    }
});

// PUT /api/admin/hostels/:id - Update hostel
router.put('/:id', async (req, res) => {
    try {
        const {
            name,
            city,
            country,
            description,
            shortDescription,
            rating,
            reviewsCount,
            pricePerNight,
            featured,
            image,
            thumbnail,
            amenities,
            owner,
            isActive,
            isVerified
        } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (city) updateData.city = city;
        if (country) updateData.country = country;
        if (description) updateData.description = description;
        if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
        if (rating !== undefined) updateData.rating = rating;
        if (reviewsCount !== undefined) updateData.reviewsCount = reviewsCount;
        if (pricePerNight !== undefined) updateData.pricePerNight = parseFloat(pricePerNight);
        if (featured !== undefined) updateData.featured = featured;
        if (image !== undefined) updateData.image = image;
        if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
        if (amenities) updateData.amenities = amenities;
        if (owner) updateData.owner = owner;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (isVerified !== undefined) updateData.isVerified = isVerified;

        updateData.updatedAt = new Date();

        const hostel = await Hostel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }

        res.json({
            _id: hostel._id,
            id: hostel._id,
            name: hostel.name,
            city: hostel.city,
            country: hostel.country,
            updatedAt: hostel.updatedAt
        });
    } catch (error) {
        console.error('Error updating hostel:', error);
        res.status(500).json({ message: 'Failed to update hostel', error: error.message });
    }
});

// DELETE /api/admin/hostels/:id - Delete hostel
router.delete('/:id', async (req, res) => {
    try {
        const hostel = await Hostel.findByIdAndDelete(req.params.id);

        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }

        res.json({ message: 'Hostel deleted successfully', deletedId: req.params.id });
    } catch (error) {
        console.error('Error deleting hostel:', error);
        res.status(500).json({ message: 'Failed to delete hostel', error: error.message });
    }
});

// PATCH /api/admin/hostels/:id/status - Update hostel status (active/inactive)
router.patch('/:id/status', async (req, res) => {
    try {
        const { isActive } = req.body;

        if (isActive === undefined) {
            return res.status(400).json({ message: 'isActive is required' });
        }

        const hostel = await Hostel.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive } },
            { new: true, runValidators: true }
        );

        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }

        res.json({
            _id: hostel._id,
            id: hostel._id,
            isActive: hostel.isActive,
            message: 'Hostel status updated successfully'
        });
    } catch (error) {
        console.error('Error updating hostel status:', error);
        res.status(500).json({ message: 'Failed to update hostel status', error: error.message });
    }
});

module.exports = router;