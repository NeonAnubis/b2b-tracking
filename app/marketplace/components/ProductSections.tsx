'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { categories, getProductsByCategory } from '@/lib/data/products'
import { useCartStore } from '@/lib/store/cart-store'

interface ProductSectionProps {
  category: string
  index: number
}

function ProductSection({ category, index }: ProductSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const products = getProductsByCategory(category).slice(0, 3)
  const isEven = index % 2 === 0
  const { addItem } = useCartStore()

  if (products.length === 0) return null

  return (
    <section ref={ref} className="py-20 overflow-hidden" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              {category}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Discover Our
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {category} Collection
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Premium quality products handpicked for you. Experience excellence in every purchase.
            </p>
            <Link
              href={`/marketplace?category=${encodeURIComponent(category)}`}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).b2bTracker) {
                  (window as any).b2bTracker.track('view_category_click', {
                    category,
                    from: 'product_section'
                  })
                }
              }}
            >
              View All {category}
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <div className="grid grid-cols-1 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <Link href={`/marketplace/product/${product.id}`}>
                    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer">
                      <div className="flex">
                        <div className="w-1/3 relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="w-2/3 p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">{product.rating}</span>
                            <span className="text-sm text-gray-500">({product.id * 47 + 100} reviews)</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-900">
                              ${product.price}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  category: product.category
                                })
                              }}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function ProductSections() {
  const displayCategories = categories.slice(1) // Skip "All Products"

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white">
      {displayCategories.map((category, index) => (
        <ProductSection key={category} category={category} index={index} />
      ))}
    </div>
  )
}
