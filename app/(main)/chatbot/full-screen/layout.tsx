"use client";

import { ThemeProvider } from "@/components/theme-provider";

export default function FullScreenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <main className="h-screen w-screen overflow-hidden">
        {children}
      </main>
    </ThemeProvider>
  );
} 