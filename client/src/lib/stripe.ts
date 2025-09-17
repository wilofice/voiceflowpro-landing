import { loadStripe } from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const STRIPE_PRICES = {
  PRO_MONTHLY: 'price_pro_monthly', // Replace with actual Stripe price ID
  PRO_ANNUAL: 'price_pro_annual',   // Replace with actual Stripe price ID
  TEAM_MONTHLY: 'price_team_monthly', // Replace with actual Stripe price ID
  TEAM_ANNUAL: 'price_team_annual',   // Replace with actual Stripe price ID
};
