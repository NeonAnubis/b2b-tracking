'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Heart, Share2, Check, Truck, Shield, RotateCcw } from 'lucide-react'
import { AuthProvider } from '@/app/providers/AuthProvider'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { getProductById } from '@/lib/data/products'
import { useCartStore } from '@/lib/store/cart-store'
import { useRouter } from 'next/navigation'

export default function ProductDetailContent({ productId }: { productId: number }) {
  const product = getProductById(productId)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    if (product && typeof window !== 'undefined' && (window as any).b2bTracker) {
      (window as any).b2bTracker.track('product_view', {
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price
      })
    }
  }, [product])

  if (!product) {
    return (
      <AuthProvider>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <button
              onClick={() => router.push('/marketplace')}
              className="text-blue-600 hover:underline"
            >
              Return to Marketplace
            </button>
          </div>
        </div>
      </AuthProvider>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      })
    }

    // Track add to cart with quantity
    if (typeof window !== 'undefined' && (window as any).b2bTracker) {
      (window as any).b2bTracker.track('add_to_cart_detail', {
        productId: product.id,
        productName: product.name,
        quantity,
        totalPrice: product.price * quantity
      })
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/marketplace/cart')
  }

  // Simulated image gallery (using same image for demo)
  const images = [product.image, product.image, product.image]

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Product Detail */}
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="sticky top-24">
                  {/* Main Image */}
                  <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-blue-600 scale-105'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:pl-8"
              >
                {/* Category Badge */}
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                  {product.category}
                </div>

                {/* Product Name */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{product.rating}</span>
                  <span className="text-gray-500">({product.id * 47 + 100} reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    ${product.price}
                  </div>
                  <div className="text-green-600 font-semibold flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    In Stock ({product.stock} available)
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg text-gray-700 mb-8">
                  {product.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-6 py-3 hover:bg-gray-100 transition-colors font-semibold text-lg"
                      >
                        −
                      </button>
                      <span className="px-8 py-3 font-semibold text-lg border-x-2 border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-6 py-3 hover:bg-gray-100 transition-colors font-semibold text-lg"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-600">
                      Total: <span className="font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="flex gap-4 mb-8">
                  <button className="flex-1 border-2 border-gray-300 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Add to Wishlist
                  </button>
                  <button className="flex-1 border-2 border-gray-300 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 rounded-2xl">
                  <div className="text-center">
                    <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-semibold text-gray-900">Free Shipping</div>
                    <div className="text-xs text-gray-600">Orders over $50</div>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-semibold text-gray-900">Warranty</div>
                    <div className="text-xs text-gray-600">2 year coverage</div>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-semibold text-gray-900">Returns</div>
                    <div className="text-xs text-gray-600">30-day guarantee</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </AuthProvider>
  )
}
