"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<string>("");
  
  useEffect(() => {
    // Get the session_id from URL if present
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      setPaymentInfo(`Payment ID: ${sessionId}`);
    }
    
    // Log the payment success event
    console.log("Payment successful", { sessionId });
  }, [searchParams]);

  return (
    <div className="container max-w-md mx-auto py-16 px-4 text-center">
      <div className="mb-6 flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your donation. Your transaction has been completed successfully.
      </p>
      {paymentInfo && (
        <div className="text-sm text-gray-500 mb-8 p-3 bg-gray-50 rounded-md">
          {paymentInfo}
        </div>
      )}
      <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-500">
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-md mx-auto py-16 px-4 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your donation. Your transaction has been completed successfully.
        </p>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-500">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 