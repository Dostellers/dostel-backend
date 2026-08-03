import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51NQUi4K4T7Xx9pVZJqAd4pJWQY89LzQl8A3v3sZcD8xE6KXjJJJJJJJJJJJ";
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export const loadStripePromise = () => {
  return getStripe();
};