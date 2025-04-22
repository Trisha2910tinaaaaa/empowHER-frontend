import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  // Check Stripe configuration
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Stripe secret key is missing');
    return NextResponse.json(
      { success: false, message: "Payment service is not properly configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { amount, currency = "usd", description, successUrl, cancelUrl } = body;
    
    // Basic validation
    if (!amount || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating Stripe checkout session with:", { 
      amount, currency, description,
      successUrl: successUrl.substring(0, 50) + '...', // Log partial URLs for privacy
      cancelUrl: cancelUrl.substring(0, 50) + '...'
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: description || "Payment",
            },
            unit_amount: amount * 100, // Stripe works in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    console.log("Checkout session created:", session.id);
    return NextResponse.json({ success: true, sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error.message, error.stack);
    
    let errorMessage = "Payment processing failed";
    if (error.type === 'StripeInvalidRequestError') {
      errorMessage = "Invalid payment request";
    } else if (error.type === 'StripeAuthenticationError') {
      errorMessage = "Payment service authentication failed";
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
} 