"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PaymentButton from "@/components/ui/payment-button";

export default function PaymentPage() {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("20");
  
  useEffect(() => {
    // Debug logs
    console.log("Environment:", {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_STRIPE_KEY_EXISTS: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      origin: typeof window !== 'undefined' ? window.location.origin : 'SSR'
    });
  }, []);
  
  const handleRadioChange = (value: string) => {
    setSelectedAmount(value);
    if (value !== "custom") {
      setCustomAmount("");
    }
  };

  const finalAmount = selectedAmount === "custom" 
    ? Number(customAmount) || 0
    : Number(selectedAmount);

  const isValidAmount = finalAmount > 0;
  
  // Define explicit success and cancel URLs
  const successUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/success`;
  const cancelUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/cancel`;

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Support Women Empowerment
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your contribution helps us continue providing resources, mentorship, and opportunities for women in tech and other industries.
        </p>
      </div>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
          <CardDescription>
            Choose an amount to donate. All payments are processed securely via Stripe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAmount}
            onValueChange={handleRadioChange}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <div>
              <RadioGroupItem
                value="10"
                id="amount-10"
                className="peer sr-only"
              />
              <Label
                htmlFor="amount-10"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-50 [&:has([data-state=checked])]:border-pink-500"
              >
                <span className="text-sm font-medium">Basic</span>
                <span className="text-2xl font-bold">$10</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="20"
                id="amount-20"
                className="peer sr-only"
              />
              <Label
                htmlFor="amount-20"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-50 [&:has([data-state=checked])]:border-pink-500"
              >
                <span className="text-sm font-medium">Standard</span>
                <span className="text-2xl font-bold">$20</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="50"
                id="amount-50"
                className="peer sr-only"
              />
              <Label
                htmlFor="amount-50"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-50 [&:has([data-state=checked])]:border-pink-500"
              >
                <span className="text-sm font-medium">Premium</span>
                <span className="text-2xl font-bold">$50</span>
              </Label>
            </div>
            <div className="col-span-3">
              <RadioGroupItem
                value="custom"
                id="amount-custom"
                className="peer sr-only"
              />
              <Label
                htmlFor="amount-custom"
                className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-50 [&:has([data-state=checked])]:border-pink-500"
              >
                <span className="text-sm font-medium">Custom Amount</span>
                <Input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-24 border-gray-200"
                  onClick={() => setSelectedAmount("custom")}
                />
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-center">
          <PaymentButton
            amount={finalAmount}
            description="Donation to empowHER"
            buttonText={isValidAmount ? "Donate Now" : "Enter an amount"}
            className={`w-full ${
              isValidAmount 
                ? "bg-gradient-to-r from-pink-600 to-purple-600" 
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!isValidAmount}
            successUrl={successUrl}
            cancelUrl={cancelUrl}
          />
        </CardFooter>
      </Card>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>
          By making a donation, you agree to our <a href="#" className="text-pink-600 hover:underline">Terms of Service</a> and <a href="#" className="text-pink-600 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
} 