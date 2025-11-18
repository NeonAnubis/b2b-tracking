'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              MarketHub
            </h3>
            <p className="text-sm text-gray-400">
              Your trusted destination for premium lifestyle products. Quality you can trust.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace?category=Electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/marketplace?category=Fashion" className="hover:text-white transition-colors">Fashion</Link></li>
              <li><Link href="/marketplace?category=Home%20%26%20Living" className="hover:text-white transition-colors">Home & Living</Link></li>
              <li><Link href="/marketplace?category=Sports%20%26%20Outdoors" className="hover:text-white transition-colors">Sports & Outdoors</Link></li>
              <li><Link href="/marketplace?category=Beauty%20%26%20Health" className="hover:text-white transition-colors">Beauty & Health</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/marketplace/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/marketplace/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/marketplace/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/marketplace/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/marketplace/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/marketplace/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/marketplace/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 MarketHub. All rights reserved. | Powered by B2B Tracker</p>
        </div>
      </div>
    </footer>
  )
}
