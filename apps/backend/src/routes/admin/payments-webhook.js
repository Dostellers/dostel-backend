const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Booking = require('../../models/booking');
const { authenticate } = require('../../middleware/authentication');
const { authorize } = require('../../middleware/authorization');

// POST /api/admin/payments-webhook - Stripe webhook endpoint
// Note: This endpoint should be registered with Stripe directly and doesn't need auth middleware
// The webhook signature verification handles authentication
router.post('/payments-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.warn('STRIPE_WEBHOOK_SECRET not configured');
            return res.status(500).json({ error: 'Webhook secret not configured' });
        }

        // Verify webhook signature
        let event;
        try {
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).json({ error: `Webhook Error: ${err.message}` });
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                
                // Find booking by session ID (stored in metadata)
                const bookingReference = session.metadata?.bookingReference;
                
                if (bookingReference) {
                    const booking = await Booking.findOne({ reference: bookingReference });
                    
                    if (booking) {
                        booking.status = 'Confirmed';
                        booking.payment = {
                            ...booking.payment,
                            status: 'Completed',
                            method: session.payment_method_types?.[0] || 'Card',
                            transactionId: session.payment_intent,
                            amount: session.amount_total / 100 // Convert from cents
                        };
                        
                        // Store session ID for future reference
                        if (!booking.payment.sessionId) {
                            booking.payment.sessionId = session.id;
                        }
                        
                        await booking.save();
                        console.log(`Booking ${bookingReference} payment confirmed`);
                    } else {
                        console.warn(`Booking not found for reference: ${bookingReference}`);
                    }
                }
                break;
            }
            
            case 'checkout.session.expired': {
                const session = event.data.object;
                const bookingReference = session.metadata?.bookingReference;
                
                if (bookingReference) {
                    const booking = await Booking.findOne({ reference: bookingReference });
                    
                    if (booking) {
                        booking.status = 'Abandoned';
                        booking.payment = {
                            ...booking.payment,
                            status: 'Failed'
                        };
                        await booking.save();
                        console.log(`Booking ${bookingReference} session expired`);
                    }
                }
                break;
            }
            
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                // Handle failed payment - could link to booking via metadata
                console.log('Payment failed:', paymentIntent.id);
                break;
            }
            
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                // Additional confirmation if needed
                console.log('Payment succeeded:', paymentIntent.id);
                break;
            }
            
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // Return 200 to acknowledge receipt
        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/admin/payments-webhook/test - Test webhook endpoint
router.get('/payments-webhook/test', (req, res) => {
    res.json({ 
        message: 'Webhook endpoint is active',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;