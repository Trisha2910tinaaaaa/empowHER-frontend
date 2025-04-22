"use client";

import { User, Mail, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export function AuthButton({ 
  variant = "default", 
  onAction
}: { 
  variant?: "default" | "mobile";
  onAction?: () => void;
}) {
  const { isAuthenticated, login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  if (isAuthenticated) {
    return null;
  }

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await register(name, email, password);
        toast.success("Account created successfully!");
        router.push("/user-profile");
      } else {
        await login(email, password);
        toast.success("Logged in successfully!");
        router.push("/user-profile");
      }
      handleAction();
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(isSignUp 
        ? "Failed to create account. Please try again." 
        : "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {variant === "default" ? (
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            <User className="mr-2 h-4 w-4" /> {isSignUp ? "Join Now" : "Sign In"}
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mt-4 py-6"
          >
            <User className="mr-2 h-5 w-5" /> {isSignUp ? "Join Now" : "Sign In"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{isSignUp ? "Create Account" : "Sign In"}</DialogTitle>
        </DialogHeader>
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
          <h2 className="text-2xl font-bold tracking-tight">
            {isSignUp ? "Join empowHER" : "Welcome Back"}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {isSignUp 
              ? "Create your account to access all features"
              : "Sign in to access your personalized experience"}
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  placeholder="Your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="******" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            <div className="text-center text-sm mt-4">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-purple-600 hover:text-purple-800 font-medium hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New to empowHER?{" "}
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-purple-600 hover:text-purple-800 font-medium hover:underline"
                  >
                    Create an account
                  </button>
                </>
              )}
            </div>
            
            <div className="text-center text-xs text-gray-500 mt-4">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-purple-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 