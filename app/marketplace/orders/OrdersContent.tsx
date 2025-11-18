'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, XCircle, MapPin, Calendar, CreditCard, ChevronRight, Download, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/app/providers/AuthProvider'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { getOrdersByUserId, Order } from '@/lib/data/orders'

function OrdersPageContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/marketplace/signin')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const userOrders = getOrdersByUserId(user.id)
      setOrders(userOrders)

      // Track orders page view
      if (typeof window !== 'undefined' && (window as any).b2bTracker) {
        (window as any).b2bTracker.track('orders_page_view', {
          userId: user.id,
          orderCount: userOrders.length
        })
      }
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-600" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const handleTrackOrder = (order: Order) => {
    if (typeof window !== 'undefined' && (window as any).b2bTracker) {
      (window as any).b2bTracker.track('order_tracking_view', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status
      })
    }
    setSelectedOrder(order)
  }

  const handleDownloadInvoice = (order: Order) => {
    if (typeof window !== 'undefined' && (window as any).b2bTracker) {
      (window as any).b2bTracker.track('invoice_download', {
        orderId: order.id,
        orderNumber: order.orderNumber
      })
    }
    // In a real app, this would download the invoice PDF
    alert(`Downloading invoice for ${order.orderNumber}`)
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
            <h1 className="text-5xl font-bold mb-4">My Orders</h1>
            <p className="text-xl opacity-90">
              Track and manage your purchases
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Start shopping to see your orders here'}
            </p>
            <Link
              href="/marketplace"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {order.date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  {order.status !== 'cancelled' && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">Shipping Address</p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.name}<br />
                              {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                              {order.shippingAddress.country}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">Payment Method</p>
                            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                            {order.trackingNumber && (
                              <>
                                <p className="font-semibold text-gray-900 mt-3 mb-1">Tracking Number</p>
                                <p className="text-sm text-blue-600 font-mono">{order.trackingNumber}</p>
                              </>
                            )}
                            {order.estimatedDelivery && (
                              <>
                                <p className="font-semibold text-gray-900 mt-3 mb-1">Estimated Delivery</p>
                                <p className="text-sm text-gray-600">
                                  {order.estimatedDelivery.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {order.trackingNumber && order.status !== 'delivered' && (
                      <button
                        onClick={() => handleTrackOrder(order)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                      >
                        <Truck className="w-5 h-5" />
                        Track Order
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Download Invoice
                    </button>
                    <Link
                      href="/marketplace"
                      className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
                    >
                      Buy Again
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-xl font-bold text-gray-900">{selectedOrder.orderNumber}</p>
              {selectedOrder.trackingNumber && (
                <>
                  <p className="text-sm text-gray-600 mt-2">Tracking Number</p>
                  <p className="text-lg font-mono text-blue-600">{selectedOrder.trackingNumber}</p>
                </>
              )}
            </div>

            {/* Tracking Timeline */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedOrder.status === 'processing' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Order Placed</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="ml-5 border-l-2 border-gray-300 h-8"></div>

              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered'
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}>
                  {selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Truck className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Shipped</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered'
                      ? 'Your order is on the way'
                      : 'Awaiting shipment'}
                  </p>
                </div>
              </div>

              <div className="ml-5 border-l-2 border-gray-300 h-8"></div>

              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedOrder.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'
                }`}>
                  {selectedOrder.status === 'delivered' ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Package className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Delivered</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.status === 'delivered'
                      ? 'Order has been delivered'
                      : selectedOrder.estimatedDelivery
                        ? `Estimated: ${selectedOrder.estimatedDelivery.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric'
                          })}`
                        : 'Estimated delivery date pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default function OrdersContent() {
  return (
    <AuthProvider>
      <OrdersPageContent />
    </AuthProvider>
  )
}
