export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  orderNumber: string
  date: Date
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  trackingNumber?: string
  estimatedDelivery?: Date
  paymentMethod: string
}

// Mock orders data for demo purposes
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: new Date('2024-01-15'),
    status: 'delivered',
    total: 1299.99,
    paymentMethod: 'Credit Card ending in 4242',
    trackingNumber: 'TRK1234567890',
    estimatedDelivery: new Date('2024-01-18'),
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States'
    },
    items: [
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
      },
      {
        id: 2,
        name: 'Smart Watch Pro',
        price: 499.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: new Date('2024-01-20'),
    status: 'shipped',
    total: 899.97,
    paymentMethod: 'PayPal',
    trackingNumber: 'TRK0987654321',
    estimatedDelivery: new Date('2024-01-25'),
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States'
    },
    items: [
      {
        id: 5,
        name: 'Designer Sunglasses',
        price: 199.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
      },
      {
        id: 6,
        name: 'Leather Wallet',
        price: 89.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop'
      },
      {
        id: 10,
        name: 'Portable Bluetooth Speaker',
        price: 149.99,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: new Date('2024-01-22'),
    status: 'processing',
    total: 1499.98,
    paymentMethod: 'Credit Card ending in 8888',
    estimatedDelivery: new Date('2024-01-28'),
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States'
    },
    items: [
      {
        id: 3,
        name: '4K Ultra HD Camera',
        price: 799.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop'
      },
      {
        id: 11,
        name: 'Fitness Tracker Band',
        price: 129.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop'
      },
      {
        id: 15,
        name: 'Yoga Mat Premium',
        price: 79.99,
        quantity: 7,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop'
      }
    ]
  }
]

export function getOrdersByUserId(userId?: string): Order[] {
  // In a real app, this would fetch from a database
  // For now, return mock orders if user is logged in
  if (userId) {
    return mockOrders
  }
  return []
}

export function getOrderById(orderId: string): Order | undefined {
  return mockOrders.find(order => order.id === orderId)
}
