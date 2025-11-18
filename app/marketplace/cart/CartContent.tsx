'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthProvider } from '@/app/providers/AuthProvider'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { useCartStore } from '@/lib/store/cart-store'

export default function CartContent() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).b2bTracker) {
      (window as any).b2bTracker.track('cart_view', {
        itemCount: getTotalItems(),
        totalValue: getTotalPrice()
      })
    }
  }, [getTotalItems, getTotalPrice])

  const handleCheckout = () => {
    if (typeof window !== 'undefined' && (window as any).b2bTracker) {
      (window as any).b2bTracker.track('checkout_initiated', {
        itemCount: getTotalItems(),
        totalValue: getTotalPrice(),
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      })
    }
    router.push('/marketplace/checkout')
  }

  if (items.length === 0) {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <Navigation />
          <div className="flex-1 flex items-center justify-center pt-20">
            <div className="text-center">
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    )
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 10
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link
                              href={`/marketplace/product/${item.id}`}
                              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border-2 border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-4 py-2 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-6 py-2 font-semibold border-x-2 border-gray-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-4 py-2 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${item.price} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (10%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-bold text-gray-900">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {subtotal < 50 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
                      <p className="text-blue-800">
                        Add <span className="font-bold">${(50 - subtotal).toFixed(2)}</span> more to get
                        <span className="font-bold"> FREE shipping!</span>
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl mb-4"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    href="/marketplace"
                    className="block w-full text-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </AuthProvider>
  )
}
