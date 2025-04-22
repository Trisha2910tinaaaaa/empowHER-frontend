"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuth } from "@/app/contexts/AuthContext"
import { AuthButton } from "@/components/auth-button"
import { UserMenu } from "@/components/user-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-gradient-to-r from-pink-200/95 to-pink-100/95 backdrop-blur-md shadow-md" 
            : "bg-gradient-to-r from-pink-100/90 to-pink-50/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Star className="h-8 w-8 text-pink-600 fill-pink-200" />
                <div className="ml-2 flex flex-col">
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-purple-500 bg-clip-text text-transparent">
                    empowHER
                  </span>
                  <span className="text-xs text-gray-500">Elevate Your Career</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink href="/" active={pathname === "/"}>
                Home
              </NavLink>
              <NavLink href="/chatbot" active={pathname === "/chatbot"}>
                Career Advisor
              </NavLink>
              <NavLink href="/community" active={pathname === "/community"}>
                Community
              </NavLink>
              <NavLink href="/developer-profile" active={pathname === "/developer-profile"}>
                About Creator
              </NavLink>
              {isAuthenticated && (
                <NavLink href="/user-profile" active={pathname.startsWith("/user-profile")}>
                  Profile
                </NavLink>
              )}

              <div className="ml-2 border-l border-gray-200 pl-4">
                {isAuthenticated ? <UserMenu /> : <AuthButton />}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {isAuthenticated && <UserMenu />}
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center ml-3 p-2 rounded-full bg-gradient-to-r from-pink-200 to-pink-100 text-pink-700 hover:text-pink-800 hover:from-pink-300 hover:to-pink-200 focus:outline-none transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-r from-pink-200 to-pink-100 border-b border-pink-300/50 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="px-4 pt-3 pb-6 space-y-3">
              <MobileNavLink href="/" active={pathname === "/"} onClick={toggleMenu}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/chatbot" active={pathname === "/chatbot"} onClick={toggleMenu}>
                Career Advisor
              </MobileNavLink>
              <MobileNavLink href="/community" active={pathname === "/community"} onClick={toggleMenu}>
                Community
              </MobileNavLink>
              <MobileNavLink href="/developer-profile" active={pathname === "/developer-profile"} onClick={toggleMenu}>
                About Creator
              </MobileNavLink>
              {isAuthenticated && (
                <MobileNavLink href="/user-profile" active={pathname.startsWith("/user-profile")} onClick={toggleMenu}>
                  Profile
                </MobileNavLink>
              )}
              {!isAuthenticated && <AuthButton variant="mobile" onAction={toggleMenu} />}
            </div>
          </div>
        )}
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
    </ThemeProvider>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active 
          ? "bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-sm" 
          : "text-gray-700 hover:text-pink-700 hover:bg-pink-50/80"
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium ${
        active 
          ? "bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-sm" 
          : "text-gray-700 hover:text-pink-700 hover:bg-pink-50/80"
      }`}
      onClick={onClick}
    >
      <span>{children}</span>
      <ChevronRight className={`h-5 w-5 ${active ? "text-white" : "text-gray-400"}`} />
    </Link>
  )
}

