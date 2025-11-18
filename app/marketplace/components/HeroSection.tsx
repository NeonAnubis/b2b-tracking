'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })

    // Track CTA click
    if (typeof window !== 'undefined' && (window as any).b2bTracker) {
      (window as any).b2bTracker.track('hero_cta_click', {
        cta: 'Explore Collection'
      })
    }
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/2.mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200">
            Discover Premium
            <br />
            Lifestyle Products
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto"
        >
          Curated collection of the world's finest products.
          From cutting-edge electronics to timeless fashion pieces.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={scrollToProducts}
            className="group bg-white text-gray-900 px-10 py-5 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2"
          >
            Explore Collection
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              window.location.href = '/marketplace/categories'
              if (typeof window !== 'undefined' && (window as any).b2bTracker) {
                (window as any).b2bTracker.track('hero_secondary_cta_click', {
                  cta: 'Shop by Category'
                })
              }
            }}
            className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
          >
            Shop by Category
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex gap-12 justify-center text-sm"
        >
          <div>
            <div className="text-3xl font-bold">1000+</div>
            <div className="text-gray-300">Premium Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold">50K+</div>
            <div className="text-gray-300">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold">4.9★</div>
            <div className="text-gray-300">Average Rating</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  )
}
