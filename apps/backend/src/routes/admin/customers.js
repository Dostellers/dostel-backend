const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const { authenticate } = require('../../middleware/authentication');
const { authorize } = require('../../middleware/authorization');

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(authorize(['admin', 'manager', 'staff']));

// GET /api/admin/customers - Get all customers with optional filtering
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};

        // Apply filters
        if (status) query.accountStatus = status;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const [customers, total] = await Promise.all([
            Customer.find(query)
                .select('-password') // Exclude password from results
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Customer.countDocuments(query)
        ]);

        // Transform data for admin panel
        const transformedCustomers = customers.map(customer => ({
            _id: customer._id,
            id: customer._id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            alias: customer.alias || '',
            accountStatus: customer.accountStatus || 'active',
            loyaltyPoints: customer.loyaltyPoints || 0,
            newsletterSubscription: customer.newsletterSubscription || false,
            lastActive: customer.lastActive,
            bookingsCount: customer.bookings?.length || 0,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt
        }));

        res.json({
            data: transformedCustomers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Failed to fetch customers', error: error.message });
    }
});

// GET /api/admin/customers/:id - Get single customer
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .select('-password')
            .populate('bookings', 'reference status totalAmount checkInDate checkOutDate')
            .lean();

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const transformedCustomer = {
            _id: customer._id,
            id: customer._id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            alias: customer.alias || '',
            dateOfBirth: customer.dateOfBirth,
            address: customer.address,
            profilePicture: customer.profilePicture,
            emergencyContact: customer.emergencyContact,
            accountStatus: customer.accountStatus || 'active',
            lastActive: customer.lastActive,
            searchPreferences: customer.searchPreferences || [],
            wishlist: customer.wishlist || [],
            coupons: customer.coupons || [],
            socialMediaHandles: customer.socialMediaHandles || {},
            preferredCommunicationChannel: customer.preferredCommunicationChannel || 'email',
            newsletterSubscription: customer.newsletterSubscription || false,
            marketingPreferences: customer.marketingPreferences || [],
            referralCode: customer.referralCode,
            badges: customer.badges || [],
            loyaltyPoints: customer.loyaltyPoints || 0,
            bookings: customer.bookings || [],
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt
        };

        res.json(transformedCustomer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ message: 'Failed to fetch customer', error: error.message });
    }
});

// POST /api/admin/customers - Create new customer
router.post('/', async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            alias,
            dateOfBirth,
            address,
            emergencyContact,
            accountStatus = 'active',
            newsletterSubscription = false,
            preferredCommunicationChannel = 'email',
            searchPreferences = [],
            marketingPreferences = [],
            loyaltyPoints = 0
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone) {
            return res.status(400).json({ 
                message: 'Missing required fields: fullName, email, phone' 
            });
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingCustomer) {
            return res.status(400).json({ 
                message: 'Customer with this email or phone already exists' 
            });
        }

        const customer = new Customer({
            fullName,
            email,
            phone,
            alias,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            address,
            emergencyContact,
            accountStatus,
            newsletterSubscription,
            preferredCommunicationChannel,
            searchPreferences,
            marketingPreferences,
            loyaltyPoints
        });

        await customer.save();

        // Return without password
        const customerObj = customer.toObject();
        delete customerObj.password;

        res.status(201).json(customerObj);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ message: 'Failed to create customer', error: error.message });
    }
});

// PUT /api/admin/customers/:id - Update customer
router.put('/:id', async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            alias,
            dateOfBirth,
            address,
            emergencyContact,
            accountStatus,
            newsletterSubscription,
            preferredCommunicationChannel,
            searchPreferences,
            marketingPreferences,
            loyaltyPoints,
            wishlist
        } = req.body;

        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (alias !== undefined) updateData.alias = alias;
        if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
        if (address) updateData.address = address;
        if (emergencyContact) updateData.emergencyContact = emergencyContact;
        if (accountStatus) updateData.accountStatus = accountStatus;
        if (newsletterSubscription !== undefined) updateData.newsletterSubscription = newsletterSubscription;
        if (preferredCommunicationChannel) updateData.preferredCommunicationChannel = preferredCommunicationChannel;
        if (searchPreferences) updateData.searchPreferences = searchPreferences;
        if (marketingPreferences) updateData.marketingPreferences = marketingPreferences;
        if (loyaltyPoints !== undefined) updateData.loyaltyPoints = loyaltyPoints;
        if (wishlist) updateData.wishlist = wishlist;

        updateData.updatedAt = new Date();

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Failed to update customer', error: error.message });
    }
});

// DELETE /api/admin/customers/:id - Delete customer (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: { accountStatus: 'inactive', updatedAt: new Date() } },
            { new: true }
        ).select('-password');

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({ message: 'Customer marked as inactive', id: req.params.id });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Failed to delete customer', error: error.message });
    }
});

// PATCH /api/admin/customers/:id/status - Update customer status only
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const validStatuses = ['active', 'inactive', 'suspended'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
            });
        }

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: { accountStatus: status, updatedAt: new Date() } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({
            _id: customer._id,
            id: customer._id,
            accountStatus: customer.accountStatus,
            message: 'Customer status updated successfully'
        });
    } catch (error) {
        console.error('Error updating customer status:', error);
        res.status(500).json({ message: 'Failed to update customer status', error: error.message });
    }
});

// PATCH /api/admin/customers/:id/loyalty-points - Add/subtract loyalty points
router.patch('/:id/loyalty-points', async (req, res) => {
    try {
        const { points, action = 'add' } = req.body;

        if (points === undefined || points === null) {
            return res.status(400).json({ message: 'Points value is required' });
        }

        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (action === 'add') {
            customer.loyaltyPoints = (customer.loyaltyPoints || 0) + parseInt(points);
        } else if (action === 'subtract') {
            const newPoints = (customer.loyaltyPoints || 0) - parseInt(points);
            customer.loyaltyPoints = Math.max(0, newPoints);
        } else if (action === 'set') {
            customer.loyaltyPoints = parseInt(points);
        }

        await customer.save();

        res.json({
            _id: customer._id,
            id: customer._id,
            loyaltyPoints: customer.loyaltyPoints,
            message: 'Loyalty points updated successfully'
        });
    } catch (error) {
        console.error('Error updating loyalty points:', error);
        res.status(500).json({ message: 'Failed to update loyalty points', error: error.message });
    }
});

// ---------------------------------------------------------------------------
// Guest memory (DOS-502)
//
// Staff-side surfacing of what the house knows about a guest. Unlike the
// guest-facing GraphQL fields, these use the 'staff' audience and so include
// caution notes.
// ---------------------------------------------------------------------------

// GET /api/admin/customers/:id/guest-facts — what to know before greeting them
router.get('/:id/guest-facts', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).select('fullName guestFacts');
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const active = customer.activeGuestFacts('staff');

        res.json({
            customerId: String(customer._id),
            fullName: customer.fullName,
            // Grouped so a staff member reads dietary and accessibility first
            // rather than scanning a flat list at the desk.
            facts: active.map(formatFact),
            byCategory: active.reduce((acc, fact) => {
                (acc[fact.category] = acc[fact.category] || []).push(formatFact(fact));
                return acc;
            }, {}),
            pendingReviewCount: (customer.guestFacts || []).filter(f => f.reviewStatus === 'pending').length
        });
    } catch (error) {
        console.error('Error fetching guest facts:', error);
        res.status(500).json({ message: 'Failed to fetch guest facts', error: error.message });
    }
});

// GET /api/admin/customers/guest-facts/review-queue — low-confidence extractions
// and every caution, waiting on a human before they can surface anywhere.
router.get('/guest-facts/review-queue', async (req, res) => {
    try {
        const customers = await Customer.find({ 'guestFacts.reviewStatus': 'pending' })
            .select('fullName guestFacts')
            .limit(parseInt(req.query.limit || '50', 10));

        const queue = [];
        customers.forEach(customer => {
            (customer.guestFacts || [])
                .filter(fact => fact.reviewStatus === 'pending')
                .forEach(fact => queue.push({
                    customerId: String(customer._id),
                    fullName: customer.fullName,
                    ...formatFact(fact),
                    sourceExcerpt: fact.sourceExcerpt || null
                }));
        });

        queue.sort((a, b) => new Date(b.capturedAt) - new Date(a.capturedAt));
        res.json({ total: queue.length, queue });
    } catch (error) {
        console.error('Error fetching review queue:', error);
        res.status(500).json({ message: 'Failed to fetch review queue', error: error.message });
    }
});

// PATCH /api/admin/customers/:id/guest-facts/:factId — approve or reject
router.patch('/:id/guest-facts/:factId', async (req, res) => {
    try {
        const { reviewStatus } = req.body || {};
        if (!['approved', 'rejected'].includes(reviewStatus)) {
            return res.status(400).json({ message: 'reviewStatus must be "approved" or "rejected"' });
        }

        const customer = await Customer.findById(req.params.id).select('guestFacts');
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const fact = customer.guestFacts.id(req.params.factId);
        if (!fact) {
            return res.status(404).json({ message: 'Guest fact not found' });
        }

        fact.reviewStatus = reviewStatus;
        await customer.save();

        res.json({ customerId: String(customer._id), fact: formatFact(fact) });
    } catch (error) {
        console.error('Error reviewing guest fact:', error);
        res.status(500).json({ message: 'Failed to review guest fact', error: error.message });
    }
});

// DELETE /api/admin/customers/:id/guest-facts/:factId — remove outright, for a
// guest exercising erasure over the desk rather than through the dashboard.
router.delete('/:id/guest-facts/:factId', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).select('guestFacts');
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const fact = customer.guestFacts.id(req.params.factId);
        if (!fact) {
            return res.status(404).json({ message: 'Guest fact not found' });
        }

        fact.remove();
        await customer.save();
        res.json({ message: 'Guest fact deleted' });
    } catch (error) {
        console.error('Error deleting guest fact:', error);
        res.status(500).json({ message: 'Failed to delete guest fact', error: error.message });
    }
});

function formatFact(fact) {
    return {
        id: String(fact._id),
        text: fact.text,
        category: fact.category,
        capturedBy: fact.capturedBy,
        capturedAt: fact.capturedAt,
        source: fact.source,
        confidence: fact.confidence,
        reviewStatus: fact.reviewStatus,
        visibility: fact.visibility,
        expiresAt: fact.expiresAt || null
    };
}

module.exports = router;