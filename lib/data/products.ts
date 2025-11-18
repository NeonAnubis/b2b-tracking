export interface Product {
  id: number
  name: string
  price: number
  image: string
  rating: number
  category: string
  description: string
  features: string[]
  stock: number
}

export const categories = [
  'All Products',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports & Outdoors',
  'Beauty & Health'
]

export const products: Product[] = [
  // Electronics
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    rating: 4.8,
    category: 'Electronics',
    description: 'Immerse yourself in superior sound quality with our Premium Wireless Headphones. Featuring active noise cancellation and 30-hour battery life.',
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Premium leather ear cushions',
      'Bluetooth 5.0 connectivity',
      'Built-in microphone for calls'
    ],
    stock: 45
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    rating: 4.9,
    category: 'Electronics',
    description: 'Track your fitness goals and stay connected with our Smart Watch Pro. Water-resistant design with advanced health monitoring.',
    features: [
      'Heart rate monitoring',
      'GPS tracking',
      'Water resistant up to 50m',
      'Sleep tracking',
      '7-day battery life'
    ],
    stock: 32
  },
  {
    id: 3,
    name: 'Professional Camera Kit',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
    rating: 4.9,
    category: 'Electronics',
    description: 'Capture stunning photos and videos with our Professional Camera Kit. Includes 2 lenses and carrying case.',
    features: [
      '24MP full-frame sensor',
      '4K video recording',
      'Dual lens kit included',
      'Weather-sealed body',
      'Professional carrying case'
    ],
    stock: 18
  },
  {
    id: 4,
    name: 'Wireless Bluetooth Speaker',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    rating: 4.7,
    category: 'Electronics',
    description: '360-degree sound with deep bass. Perfect for outdoor adventures with 12-hour battery life.',
    features: [
      '360-degree sound',
      'Waterproof IPX7 rating',
      '12-hour battery life',
      'Wireless pairing',
      'Built-in power bank'
    ],
    stock: 67
  },

  // Fashion
  {
    id: 5,
    name: 'Designer Leather Backpack',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    rating: 4.6,
    category: 'Fashion',
    description: 'Premium leather backpack with laptop compartment. Perfect for professionals on the go.',
    features: [
      'Genuine leather construction',
      'Padded laptop compartment (15")',
      'Multiple organizing pockets',
      'Adjustable straps',
      'Water-resistant coating'
    ],
    stock: 28
  },
  {
    id: 6,
    name: 'Luxury Sunglasses',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    rating: 4.8,
    category: 'Fashion',
    description: 'UV-protected luxury sunglasses with polarized lenses. Timeless design meets modern protection.',
    features: [
      'UV400 protection',
      'Polarized lenses',
      'Titanium frame',
      'Scratch-resistant coating',
      'Premium leather case included'
    ],
    stock: 54
  },
  {
    id: 7,
    name: 'Classic Leather Watch',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    rating: 4.9,
    category: 'Fashion',
    description: 'Elegant timepiece with Swiss movement and genuine leather strap. A perfect blend of style and precision.',
    features: [
      'Swiss quartz movement',
      'Genuine leather strap',
      'Sapphire crystal glass',
      'Water resistant 50m',
      '2-year warranty'
    ],
    stock: 22
  },
  {
    id: 8,
    name: 'Premium Wool Coat',
    price: 279.99,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    rating: 4.7,
    category: 'Fashion',
    description: 'Handcrafted wool coat for the modern gentleman. Tailored fit with Italian fabric.',
    features: [
      '100% virgin wool',
      'Italian crafted fabric',
      'Tailored fit',
      'Inner pockets',
      'Dry clean only'
    ],
    stock: 15
  },

  // Home & Living
  {
    id: 9,
    name: 'Modern Table Lamp',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    rating: 4.5,
    category: 'Home & Living',
    description: 'Minimalist design table lamp with adjustable brightness. Perfect for your workspace or bedside.',
    features: [
      'Adjustable brightness',
      'Touch control',
      'Energy-efficient LED',
      'Modern minimalist design',
      'USB charging port'
    ],
    stock: 41
  },
  {
    id: 10,
    name: 'Luxury Bedding Set',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    rating: 4.8,
    category: 'Home & Living',
    description: 'Egyptian cotton bedding set with 1000 thread count. Sleep in ultimate comfort.',
    features: [
      '100% Egyptian cotton',
      '1000 thread count',
      'Queen size set',
      'Machine washable',
      'Hypoallergenic'
    ],
    stock: 33
  },
  {
    id: 11,
    name: 'Smart Air Purifier',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
    rating: 4.7,
    category: 'Home & Living',
    description: 'HEPA air purifier with smart controls. Clean air for rooms up to 500 sq ft.',
    features: [
      'True HEPA filtration',
      'Smart app control',
      'Air quality sensor',
      'Quiet operation',
      'Covers 500 sq ft'
    ],
    stock: 19
  },
  {
    id: 12,
    name: 'Ergonomic Office Chair',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
    rating: 4.9,
    category: 'Home & Living',
    description: 'Premium ergonomic chair with lumbar support. Work in comfort all day long.',
    features: [
      'Adjustable lumbar support',
      'Breathable mesh back',
      'Height adjustable',
      '360-degree swivel',
      '5-year warranty'
    ],
    stock: 27
  },

  // Sports & Outdoors
  {
    id: 13,
    name: 'Yoga Mat Pro',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    rating: 4.6,
    category: 'Sports & Outdoors',
    description: 'Extra thick yoga mat with alignment lines. Non-slip surface for all yoga styles.',
    features: [
      'Extra thick 6mm',
      'Non-slip surface',
      'Alignment lines',
      'Eco-friendly material',
      'Carrying strap included'
    ],
    stock: 58
  },
  {
    id: 14,
    name: 'Running Shoes Elite',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    rating: 4.8,
    category: 'Sports & Outdoors',
    description: 'Professional running shoes with advanced cushioning. Run faster and longer.',
    features: [
      'Advanced cushioning system',
      'Breathable mesh upper',
      'Lightweight design',
      'Responsive sole',
      'Multiple color options'
    ],
    stock: 44
  },
  {
    id: 15,
    name: 'Camping Tent 4-Person',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
    rating: 4.7,
    category: 'Sports & Outdoors',
    description: 'Waterproof camping tent for 4 people. Easy setup with aluminum poles.',
    features: [
      'Waterproof 3000mm',
      'Sleeps 4 people',
      'Easy 10-minute setup',
      'Aluminum poles',
      'Mesh windows for ventilation'
    ],
    stock: 16
  },
  {
    id: 16,
    name: 'Mountain Bike Pro',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80',
    rating: 4.9,
    category: 'Sports & Outdoors',
    description: 'Professional mountain bike with 21-speed gear system. Conquer any terrain.',
    features: [
      '21-speed gear system',
      'Aluminum frame',
      'Front suspension',
      'Disc brakes',
      'All-terrain tires'
    ],
    stock: 12
  },

  // Beauty & Health
  {
    id: 17,
    name: 'Skincare Set Premium',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    rating: 4.8,
    category: 'Beauty & Health',
    description: 'Complete skincare routine with natural ingredients. Achieve radiant skin.',
    features: [
      '100% natural ingredients',
      'Complete 5-step routine',
      'Suitable for all skin types',
      'Cruelty-free',
      'Dermatologically tested'
    ],
    stock: 36
  },
  {
    id: 18,
    name: 'Electric Toothbrush',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80',
    rating: 4.7,
    category: 'Beauty & Health',
    description: 'Sonic electric toothbrush with 5 brushing modes. Whiter teeth in 2 weeks.',
    features: [
      '40,000 vibrations per minute',
      '5 brushing modes',
      '4-week battery life',
      'Pressure sensor',
      '3 brush heads included'
    ],
    stock: 52
  },
  {
    id: 19,
    name: 'Massage Gun Pro',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    rating: 4.9,
    category: 'Beauty & Health',
    description: 'Deep tissue massage gun with 6 attachment heads. Relieve muscle tension.',
    features: [
      '6 massage heads',
      '20 speed settings',
      'Quiet operation',
      '6-hour battery',
      'Carrying case included'
    ],
    stock: 29
  },
  {
    id: 20,
    name: 'Smart Scale',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
    rating: 4.6,
    category: 'Beauty & Health',
    description: 'Smart body composition scale with app connectivity. Track 13 body metrics.',
    features: [
      'Tracks 13 body metrics',
      'WiFi & Bluetooth sync',
      'Unlimited users',
      'Baby/pet mode',
      'Rechargeable battery'
    ],
    stock: 48
  }
]

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All Products') return products
  return products.filter(p => p.category === category)
}

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id)
}
