'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, ShoppingBag, Filter, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AuthProvider } from '@/app/providers/AuthProvider'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { categories, products, getProductsByCategory } from '@/lib/data/products'
import { useCartStore } from '@/lib/store/cart-store'

function CategoriesPageContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All Products')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const { addItem } = useCartStore()

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).b2bTracker) {
      (window as any).b2bTracker.track('categories_page_view', {
        category: selectedCategory
      })
    }
  }, [selectedCategory])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (typeof window !== 'undefined' && (window as any).b2bTracker) {
      (window as any).b2bTracker.track('category_filter_change', {
        category
      })
    }
  }

  // Get filtered products
  let filteredProducts = getProductsByCategory(selectedCategory)

  // Apply price filter
  filteredProducts = filteredProducts.filter(
    p => p.price >= priceRange[0] && p.price <= priceRange[1]
  )

  // Apply sorting
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating)
      break
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      // featured - keep original order
      break
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl font-bold mb-4">Shop by Category</h1>
            <p className="text-xl opacity-90">
              Discover our curated collection of premium products
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5" />
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory}
                <span className="text-gray-500 text-lg ml-2">
                  ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
                </span>
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group">
                      <Link href={`/marketplace/product/${product.id}`}>
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">{product.rating}</span>
                            </div>
                          </div>
                          {product.stock < 10 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Only {product.stock} left!
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-6">
                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                          {product.category}
                        </div>
                        <Link href={`/marketplace/product/${product.id}`}>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            ${product.price}
                          </span>
                          <button
                            onClick={() => {
                              addItem({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                category: product.category
                              })
                            }}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CategoriesContent() {
  return (
    <AuthProvider>
      <CategoriesPageContent />
    </AuthProvider>
  )
}
