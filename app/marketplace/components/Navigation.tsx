'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Menu, X, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/providers/AuthProvider'
import { useCartStore } from '@/lib/store/cart-store'
import { categories } from '@/lib/data/products'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, signOut } = useAuth()
  const { getTotalItems } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/marketplace'
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/marketplace" className="flex items-center space-x-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MarketHub
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {categories.slice(1, 6).map((category) => (
              <Link
                key={category}
                href={`/marketplace?category=${encodeURIComponent(category)}`}
                className={`font-medium transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-blue-600'
                    : 'text-white hover:text-blue-200'
                }`}
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).b2bTracker) {
                    (window as any).b2bTracker.track('nav_category_click', {
                      category
                    })
                  }
                }}
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              className={`hidden md:flex items-center px-4 py-2 rounded-full transition-all ${
                isScrolled
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-white/20 text-white backdrop-blur-sm'
              }`}
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).b2bTracker) {
                  (window as any).b2bTracker.track('search_click')
                }
              }}
            >
              <Search className="w-4 h-4 mr-2" />
              <span className="text-sm">Search</span>
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    isScrolled
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block text-sm">
                    {user.email?.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="py-2">
                    <Link
                      href="/marketplace/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/marketplace/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/marketplace/signin"
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  isScrolled
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/marketplace/cart"
              className={`relative p-2 rounded-full transition-all ${
                isScrolled
                  ? 'hover:bg-gray-100'
                  : 'hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <ShoppingCart
                className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              />
              {mounted && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {categories.slice(1).map((category) => (
              <Link
                key={category}
                href={`/marketplace?category=${encodeURIComponent(category)}`}
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
