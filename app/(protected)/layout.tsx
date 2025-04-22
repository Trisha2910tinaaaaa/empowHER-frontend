"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  
  // If auth is loaded and user is not authenticated, redirect to sign in page
  if (!loading && !isAuthenticated) {
    redirect("/auth");
  }

  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <Navbar />
      <main>
        {children}
      </main>
    </ThemeProvider>
  );
} 