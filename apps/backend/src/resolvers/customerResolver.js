
const ReceiptAuditLog = require('../models/receiptAuditLog');

const customerResolvers = {
    Query: {
        customers: async () => {
            return await Customer.find()
                .populate('bookings')
                .populate('reviews')
                .populate('wishlist')
                .populate('coupons')
                .populate('badges')
                .populate('referrals')
                .populate('referredBy')
                .populate('tokenReceipts');
        },
        customer: async (_, { id }) => {
            return await Customer.findById(id)
                .populate('bookings')
                .populate('reviews')
                .populate('wishlist')
                .populate('coupons')
                .populate('badges')
                .populate('referrals')
                .populate('referredBy')
                .populate('tokenReceipts');
        },
        customerByEmail: async (_, { email }) => {
            return await Customer.findOne({ email })
                .populate('bookings')
                .populate('reviews')
                .populate('wishlist')
                .populate('coupons')
                .populate('badges')
                .populate('referrals')
                .populate('referredBy')
                .populate('tokenReceipts');
        },
        customersByStatus: async (_, { accountStatus }) => {
            return await Customer.find({ accountStatus })
                .populate('bookings')
                .populate('reviews')
                .populate('wishlist')
                .populate('coupons')
                .populate('badges')
                .populate('referrals')
                .populate('referredBy')
                .populate('tokenReceipts');
        },
        tokenReceipts: async (_, { customerId }) => {
            return await TokenReceipt.find({ customer: customerId }).sort({ createdAt: -1 });
        },
        tokenReceiptsAll: async (_, { page, limit }) => {
            const skip = page && limit ? (page - 1) * limit : 0;
            const lim = limit || 10;
            return await TokenReceipt.find()
                .populate('customer', 'fullName')
                .skip(skip)
                .limit(lim)
                .sort({ createdAt: -1 });
        },
        receiptLogs: async (_, { receiptId }) => {
            return await ReceiptAuditLog.find({ receipt: receiptId })
                .populate('actionBy', 'fullName email')
                .sort({ createdAt: -1 });
        }
    },
    Mutation: {
        createCustomer: async (_, { input }) => {
            const existing = await Customer.findOne({ email: input.email });
            if (existing) {
                return existing;
            }
            const newCustomer = new Customer(input);
            return await newCustomer.save();
        },

        updateCustomer: async (_, { id, input }) => {
            return await Customer.findByIdAndUpdate(id, input, { new: true })
                .populate('bookings')
                .populate('reviews')
                .populate('wishlist')
                .populate('coupons')
                .populate('badges')
                .populate('referrals')
                .populate('referredBy')
                .populate('tokenReceipts');
        },

        deleteCustomer: async (_, { id }) => {
            await Customer.findByIdAndDelete(id);
            return true;
        },

        addBookingToCustomer: async (_, { customerId, bookingId }) => {
            const customer = await Customer.findById(customerId);
            customer.bookings.push(bookingId);
            return await customer.save();
        },

        addReviewToCustomer: async (_, { customerId, reviewId }) => {
            const customer = await Customer.findById(customerId);
            customer.reviews.push(reviewId);
            return await customer.save();
        },

        addCouponToCustomer: async (_, { customerId, couponId }) => {
            const customer = await Customer.findById(customerId);
            customer.coupons.push(couponId);
            return await customer.save();
        },

        addReferralToCustomer: async (_, { customerId, referralId }) => {
            const customer = await Customer.findById(customerId);
            const referrer = await Customer.findById(referralId);
            if (!referrer) {
                throw new Error('Referrer customer not found');
            }
            customer.referredBy = referralId;
            referrer.referrals.push(customerId);
            await customer.save();
            await referrer.save();
            return customer;
        },

        addContributions: async (_, { id, points }) => {
            const customer = await Customer.findById(id);
            customer.contributions = (customer.contributions || 0) + points;
            return await customer.save();
        },

        updateReputation: async (_, { id, points }) => {
            const customer = await Customer.findById(id);
            customer.reputation = (customer.reputation || 0) + points;
            return await customer.save();
        },

        addTokens: async (_, { id, amount }) => {
            const customer = await Customer.findById(id);
            customer.tokenBalance = (customer.tokenBalance || 0) + amount;
            return await customer.save();
        },

        updateLoyaltyPoints: async (_, { id, points }) => {
            const customer = await Customer.findById(id);
            customer.loyaltyPoints = (customer.loyaltyPoints || 0) + points;
            return await customer.save();
        },

        updateMembershipTier: async (_, { id, tier }) => {
            const validTiers = ['Explorer', 'Contributor', 'Dosteller', 'Elder'];
            if (!validTiers.includes(tier)) {
                throw new Error(`Invalid tier. Must be one of: ${validTiers.join(', ')}`);
            }
            return await Customer.findByIdAndUpdate(id, { tier }, { new: true });
        },

        findOrCreateCustomer: async (_, { email, fullName, phone }) => {
            const existing = await Customer.findOne({ email: new RegExp(`^${email}$`, 'i') });
            if (existing) {
                if (existing.fullName !== fullName) {
                    existing.fullName = fullName;
                    await existing.save();
                }
                return existing;
            }
            const newCustomer = new Customer({
                email,
                fullName,
                phone: phone || '',
                password: '',
                accountStatus: 'Active',
                loyaltyPoints: 0,
                newsletterSubscription: false,
                referrals: [],
                bookings: [],
                reviews: [],
                wishlist: [],
                coupons: [],
                badges: [],
                tier: 'Explorer',
                contributions: 0,
                reputation: 0,
                tokenBalance: 0
            });
            return await newCustomer.save();
        },

        addTokenReceipt: async (_, { customerId, amount, type, description, paymentId }) => {
            const customer = await Customer.findById(customerId);
            if (!customer) {
                throw new Error('Customer not found');
            }

            const validTypes = ['referral', 'booking', 'loyalty', 'promotion', 'manual'];
            if (!validTypes.includes(type)) {
                throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
            }

            // Create the receipt
            const receipt = new TokenReceipt({
                customer: customerId,
                amount,
                type,
                description,
                transactionId: 'temp-' + Date.now()
            });

            // If paymentId provided, link it and set to paid
            if (paymentId) {
                // Optionally validate payment exists and belongs to customer
                const payment = await mongoose.model('Transaction').findById(paymentId);
                if (!payment) {
                    throw new Error('Payment not found');
                }
                // Associate payment with receipt
                receipt.transactionId = paymentId;
                receipt.payment = paymentId;
                // Update payment status to Completed if it's Pending
                payment.status = 'Completed';
                await payment.save();
            }

            receipt.save();

            // Update customer's token balance
            customer.tokenBalance = (customer.tokenBalance || 0) + amount;
            await customer.save();

            // Create audit log entry
            await ReceiptAuditLog.create({
                receipt: receipt._id,
                field: 'created',
                action: 'CREATE',
                actionBy: null
            });

            return receipt.populate('customer').populate('payment');
        },

        awardReferralReward: async (_, { customerId }) => {
            const customer = await Customer.findById(customerId);
            if (!customer) {
                throw new Error('Customer not found');
            }

            const referredCustomers = await Customer.find({ referredBy: customerId });
            let totalTokens = 0;

            for (const refCust of referredCustomers) {
                const completedBookings = await Transaction.find({
                    status: 'Completed',
                    booking: { $exists: true }
                },
                { booking: 1 }
                );
                totalTokens += completedBookings.length;
            }

            customer.reputation += Math.floor(totalTokens * 0.5);
            await customer.save();

            for (const refCust of referredCustomers) {
                if (refCust.referredBy && refCust.referredBy !== customerId) {
                    const refReferrer = await Customer.findById(refCust.referredBy);
                    if (refReferrer) {
                        refReferrer.reputation += Math.floor(totalTokens * 0.25);
                        await refReferrer.save();
                    }
                }
            }

            return customer;
        },

        deleteTokenReceipt: async (_, { id }) => {
            const receipt = await TokenReceipt.findById(id);
            if (!receipt) {
                throw new Error('Receipt not found');
            }

            await ReceiptAuditLog.create({
                receipt: id,
                field: 'deleted',
                oldValue: JSON.stringify({
                    amount: receipt.amount,
                    type: receipt.type,
                    description: receipt.description
                }),
                newValue: null,
                action: 'DELETE',
                actionBy: null
            });

            await TokenReceipt.findByIdAndDelete(id);
            return true;
        },

        bulkDeleteTokenReceipts: async (_, { ids }) => {
            if (!ids || ids.length === 0) {
                return false;
            }
            await TokenReceipt.deleteMany({ _id: { $in: ids } });
            return true;
        },

        restoreTokenReceipt: async (_, { id, field, value }) => {
            const receipt = await TokenReceipt.findById(id);
            if (!receipt) {
                throw new Error('Receipt not found');
            }

            const validFields = ['amount', 'type', 'description'];
            if (!validFields.includes(field)) {
                throw new Error(`Invalid field. Must be one of: ${validFields.join(', ')}`);
            }

            const oldValue = receipt[field];
            receipt[field] = field === 'amount' ? parseInt(value) : value;
            await receipt.save();

            await ReceiptAuditLog.create({
                receipt: id,
                field,
                oldValue: String(oldValue),
                newValue: String(receipt[field]),
                action: 'RESTORE',
                actionBy: null
            });

            return receipt.populate('customer');
        },

        updateTokenReceipt: async (_, { id, input }) => {
            const receipt = await TokenReceipt.findById(id);
            if (!receipt) {
                throw new Error('Receipt not found');
            }

            const validFields = ['amount', 'type', 'description', 'transactionId'];
            const updates = {};

            for (const field of Object.keys(input)) {
                if (validFields.includes(field)) {
                    updates[field] = input[field];
                }
            }

            const updatedReceipt = await TokenReceipt.findByIdAndUpdate(id, updates, { new: true });

            if (updatedReceipt) {
                await ReceiptAuditLog.create({
                    receipt: id,
                    field: 'update',
                    oldValue: JSON.stringify({
                        amount: receipt.amount,
                        type: receipt.type,
                        description: receipt.description,
                        transactionId: receipt.transactionId
                    }),
                    newValue: JSON.stringify({
                        amount: updatedReceipt.amount,
                        type: updatedReceipt.type,
                        description: updatedReceipt.description,
                        transactionId: updatedReceipt.transactionId
                    }),
                    action: 'UPDATE',
                    actionBy: null
                });
            }

return updatedReceipt.populate('customer');
         }
     }
 };

 module.exports = customerResolvers;