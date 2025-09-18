import { loadStripe } from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePriceConfig = {
  PRO_MONTHLY: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY ?? "",
  PRO_ANNUAL: import.meta.env.VITE_STRIPE_PRICE_PRO_ANNUAL ?? "",
  TEAM_MONTHLY: import.meta.env.VITE_STRIPE_PRICE_TEAM_MONTHLY ?? "",
  TEAM_ANNUAL: import.meta.env.VITE_STRIPE_PRICE_TEAM_ANNUAL ?? "",
} as const;

const missingPriceKeys = Object.entries(stripePriceConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingPriceKeys.length > 0) {
  throw new Error(
    `Missing required Stripe price keys: ${missingPriceKeys
      .map((key) => `VITE_STRIPE_PRICE_${key}`)
      .join(", ")}`,
  );
}

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const STRIPE_PRICES = stripePriceConfig as Record<
  keyof typeof stripePriceConfig,
  string
>;

export type StripePriceKey = keyof typeof stripePriceConfig;
