import type React from "react"
import Link from "next/link"
import { Sparkles, Heart, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-50 to-pink-100 border-t border-pink-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-pink-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
                empowHER
              </span>
            </div>
            <p className="mt-4 text-gray-600 max-w-md">
              Empowering women to discover their perfect career path through personalized recommendations and community
              support.
            </p>
            <div className="mt-6 flex space-x-4">
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Github className="h-5 w-5" />} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">Helpful Resources</h3>
            <ul className="mt-4 space-y-2">
              <FooterLink href="/resume-templates">Resume Templates</FooterLink>
              <FooterLink href="/faqs">FAQs</FooterLink>
              <FooterLink href="/blog">Career Blog</FooterLink>
              <FooterLink href="#">Interview Tips</FooterLink>
              <FooterLink href="#">Skill Development</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/terms">Terms of Use</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="#">About Us</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-pink-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} empowHER. All rights reserved.</p>
          <p className="mt-4 md:mt-0 text-gray-500 text-sm flex items-center">
            Made with <Heart className="h-4 w-4 text-pink-500 mx-1" /> for women in tech
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-gray-500 hover:text-pink-600 transition-colors duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-600 hover:text-pink-600 transition-colors duration-300">
        {children}
      </Link>
    </li>
  )
}

