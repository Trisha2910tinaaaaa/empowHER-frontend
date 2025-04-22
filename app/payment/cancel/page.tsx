"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="container max-w-md mx-auto py-16 px-4 text-center">
      <div className="mb-6 flex justify-center">
        <XCircle className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-gray-600 mb-8">
        Your payment was cancelled. No charges were made.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="outline" className="border-pink-200 text-pink-700">
          <Link href="/payment">Try Again</Link>
        </Button>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-500">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
} 