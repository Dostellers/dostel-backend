const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Validate a Stripe webhook event
 * @param {Object} payload - The raw request body
 * @param {string} sig - The Stripe-Signature header
 * @param {string} webhookSecret - The webhook secret from Stripe
 * @returns {Object} - The Stripe event object with success and event if valid, or error if invalid
 */
const validateWebhook = (payload, sig, webhookSecret) => {
    try {
        const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
        return { success: true, event };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

/**
 * Create a Stripe checkout session for a booking
 * @param {Object} bookingData - The booking data including amount, currency, etc.
 * @returns {Promise<Object>} - The Stripe session object
 */
const createCheckoutSession = async (bookingData) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: bookingData.currency || 'inr',
                    product_data: {
                        name: `Booking for ${bookingData.hostelName}`,
                        description: bookingData.description || 'Hostel booking',
                    },
                    unit_amount: Math.round(bookingData.amount * 100), // Convert to cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/booking-cancelled`,
        metadata: {
            bookingReference: bookingData.reference,
        },
    });

    return session;
};

module.exports = {
    validateWebhook,
    createCheckoutSession,
};