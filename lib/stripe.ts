import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Make sure Stripe API key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is missing - please check your environment variables');
}

// Server-side Stripe instance
// @ts-ignore - Ignoring the type error for apiVersion to use a standard version
export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16' as any,
});

// Client-side Stripe promise for the React components
let stripePromise: Promise<any> | null = null;

export const getStripePromise = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing - please check your environment variables');
    return null;
  }
  
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Utility function to create a checkout session
export const createCheckoutSession = async ({
  amount,
  currency = "usd",
  description = "Donation to empowHER",
  successUrl,
  cancelUrl,
}: {
  amount: number;
  currency?: string;
  description?: string;
  successUrl?: string;
  cancelUrl?: string;
}) => {
  try {
    console.log("Creating checkout with", { amount, currency, description });

    // Ensure we have success and cancel URLs
    if (!successUrl || !cancelUrl) {
      console.error("Missing success or cancel URL");
      throw new Error("Missing required URLs");
    }

    const response = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
        successUrl: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Payment API error:", response.status, errorText);
      throw new Error(`Payment API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error("Payment failed:", data.message);
      throw new Error(data.message || "Payment failed");
    }
    
    return data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}; 