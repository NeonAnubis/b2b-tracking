'use client'

import { AuthProvider } from '@/app/providers/AuthProvider'
import Navigation from './Navigation'
import HeroSection from './HeroSection'
import FeaturedCarousel from './FeaturedCarousel'
import ProductSections from './ProductSections'
import Footer from './Footer'

export default function MarketplaceLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        <FeaturedCarousel />
        <ProductSections />
        <Footer />
      </div>
    </AuthProvider>
  )
}
