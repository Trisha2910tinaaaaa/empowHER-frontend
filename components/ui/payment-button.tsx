"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/stripe";

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  description?: string;
  buttonText?: string;
  successUrl?: string;
  cancelUrl?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  className?: string;
  disabled?: boolean;
}

export default function PaymentButton({
  amount,
  currency = "usd",
  description = "Payment",
  buttonText = "Pay Now",
  successUrl,
  cancelUrl,
  variant = "default",
  className = "",
  disabled = false,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState<string>("");
  
  // Set origin once component mounts to avoid SSR issues
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handlePayment = async () => {
    if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Use passed URLs or default ones (making sure we have an origin)
      const finalSuccessUrl = successUrl || `${origin}/payment/success`;
      const finalCancelUrl = cancelUrl || `${origin}/payment/cancel`;
      
      console.log("Creating checkout session with:", {
        amount,
        currency,
        description,
        successUrl: finalSuccessUrl,
        cancelUrl: finalCancelUrl
      });
      
      const data = await createCheckoutSession({
        amount,
        currency,
        description,
        successUrl: finalSuccessUrl,
        cancelUrl: finalCancelUrl,
      });

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment could not be processed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      variant={variant}
      className={className}
      disabled={isLoading || amount <= 0 || disabled}
    >
      {isLoading ? "Processing..." : buttonText}
    </Button>
  );
} 