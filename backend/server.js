import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'pahadicraft-secret';
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const ADMIN_USERS = {
  'admin@pahadicraft.com': {
    password: 'Admin@123',
    name: 'Super Admin',
    adminRole: 'super-admin',
    permissions: ['all'],
  },
  'manager@pahadicraft.com': {
    password: 'Manager@123',
    name: 'Product Manager',
    adminRole: 'product-manager',
    permissions: ['products', 'orders', 'analytics'],
  },
  'content@pahadicraft.com': {
    password: 'Content@123',
    name: 'Content Manager',
    adminRole: 'content-manager',
    permissions: ['content', 'reviews', 'testimonials'],
  },
};

const seedProducts = [
  {
    id: 'product_1',
    name: 'Himachali Saffron Candle',
    description: 'A hand-poured saffron candle infused with natural Himalayan fragrance.',
    price: 899,
    image: 'https://via.placeholder.com/300x300?text=Saffron+Candle',
    category: 'Candles',
    subcategory: 'Premium',
    stock: 28,
    sku: 'CND-001',
    featured: true,
    trending: true,
    ratings: 4.8,
    reviewCount: 34,
    orderCount: 112,
    tags: ['handmade', 'himachali', 'saffron'],
    artisanInfo: 'Crafted by local artisans from Kullu.',
    discount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'product_2',
    name: 'Terracotta Oil Lamp',
    description: 'Traditional terracotta lamp designed for festive home decor.',
    price: 549,
    image: 'https://via.placeholder.com/300x300?text=Terracotta+Lamp',
    category: 'Terracotta',
    subcategory: 'Lamps',
    stock: 18,
    sku: 'TRC-002',
    featured: false,
    trending: true,
    ratings: 4.6,
    reviewCount: 21,
    orderCount: 68,
    tags: ['terracotta', 'festival', 'decor'],
    artisanInfo: 'Made by artisans from the Himachal valleys.',
    discount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'product_3',
    name: 'Himalayan Soap Bar',
    description: 'Natural handmade soap with Himalayan herbs and essential oils.',
    price: 299,
    image: 'https://via.placeholder.com/300x300?text=Soap+Bar',
    category: 'Soaps',
    subcategory: 'Handmade',
    stock: 42,
    sku: 'SOAP-003',
    featured: true,
    trending: false,
    ratings: 4.9,
    reviewCount: 18,
    orderCount: 75,
    tags: ['natural', 'herbal', 'artisan'],
    artisanInfo: 'Made by hand in the foothills of Himachal.',
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let products = [...seedProducts];

const ensureDataDirectory = async () => {
  try {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Unable to create data directory:', err);
    throw err;
  }
};

const saveProducts = async () => {
  try {
    await ensureDataDirectory();
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save products:', err);
    throw err;
  }
};

const loadProducts = async () => {
  try {
    await ensureDataDirectory();
    if (!fs.existsSync(PRODUCTS_FILE)) {
      products = [...seedProducts];
      await saveProducts();
      return;
    }

    const data = await fs.promises.readFile(PRODUCTS_FILE, 'utf-8');
    const loaded = JSON.parse(data);
    if (Array.isArray(loaded)) {
      products = loaded;
    } else {
      products = [...seedProducts];
      await saveProducts();
    }
  } catch (err) {
    console.error('Failed to load products, initializing seed data:', err);
    products = [...seedProducts];
    await saveProducts();
  }
};

const users = [
  { id: 'user_1', email: 'aarav@example.com', name: 'Aarav Kumar', role: 'customer', createdAt: '2025-11-01T10:00:00Z', status: 'active' },
  { id: 'user_2', email: 'meera@example.com', name: 'Meera Sharma', role: 'customer', createdAt: '2025-12-05T14:30:00Z', status: 'active' },
  { id: 'user_3', email: 'ravi@example.com', name: 'Ravi Thakur', role: 'customer', createdAt: '2026-01-10T09:15:00Z', status: 'blocked' },
];

const orders = [
  {
    id: 'order_1',
    userId: 'user_1',
    items: [
      { product: products[0], quantity: 1 },
      { product: products[1], quantity: 2 },
    ],
    status: 'delivered',
    total: 1997,
    shippingAddress: { street: '12 Hill View', city: 'Shimla', state: 'Himachal Pradesh', zipCode: '171001', country: 'India' },
    paymentStatus: 'paid',
    createdAt: '2026-05-20T08:30:00Z',
    updatedAt: '2026-05-21T09:00:00Z',
    customerName: 'Aarav Kumar',
    customerEmail: 'aarav@example.com',
    trackingNumber: 'TRACK-1001',
  },
  {
    id: 'order_2',
    userId: 'user_2',
    items: [{ product: products[2], quantity: 3 }],
    status: 'processing',
    total: 897,
    shippingAddress: { street: '43 Mountain Road', city: 'Dharamshala', state: 'Himachal Pradesh', zipCode: '176215', country: 'India' },
    paymentStatus: 'paid',
    createdAt: '2026-05-22T11:15:00Z',
    customerName: 'Meera Sharma',
    customerEmail: 'meera@example.com',
    trackingNumber: 'TRACK-1002',
  },
];

const reviews = [
  { id: 'review_1', productId: 'product_1', userId: 'user_1', userName: 'Aarav Kumar', rating: 5, title: 'Lovely Candle', content: 'The saffron fragrance is amazing and long-lasting.', status: 'approved', createdAt: '2026-05-21T12:00:00Z' },
  { id: 'review_2', productId: 'product_3', userId: 'user_2', userName: 'Meera Sharma', rating: 4, title: 'Soft and Clean', content: 'The soap feels very gentle on skin.', status: 'pending', createdAt: '2026-05-23T10:30:00Z' },
];

const feedback = [
  { id: 'feedback_1', userId: 'user_1', userEmail: 'aarav@example.com', category: 'Shipping', subject: 'Delivery time', message: 'Please speed up the shipping process.', status: 'new', createdAt: '2026-05-24T09:00:00Z' },
];

const testimonials = [
  { id: 'testimonial_1', name: 'Priya Singh', image: 'https://via.placeholder.com/80x80?text=Priya', content: 'Beautiful handcrafted products and great service.', rating: 5, status: 'approved', createdAt: '2026-05-18T13:20:00Z' },
];

const banners = [
  { id: 'banner_1', title: 'Summer Sale', description: 'Up to 20% off on selected artisan candles.', image: 'https://via.placeholder.com/1200x400?text=Summer+Sale', link: '/shop', startDate: '2026-05-01', endDate: '2026-06-30', active: true, position: 1 },
];

function createAuthToken(email, adminRole) {
  return jwt.sign({ email, adminRole }, JWT_SECRET, { expiresIn: '24h' });
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const credentials = ADMIN_USERS[email];

  if (!credentials || credentials.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = createAuthToken(email, credentials.adminRole);
  const adminUser = {
    id: randomUUID(),
    email,
    name: credentials.name,
    role: 'admin',
    adminRole: credentials.adminRole,
    permissions: credentials.permissions,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: 'active',
  };

  return res.json({ token, adminUser });
});

app.get('/api/analytics', authenticate, (req, res) => {
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalUsers = users.length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;

  const salesTrend = [
    { date: '2026-05-20', sales: 12, revenue: 1197, orders: 4 },
    { date: '2026-05-21', sales: 18, revenue: 1898, orders: 5 },
    { date: '2026-05-22', sales: 9, revenue: 897, orders: 2 },
    { date: '2026-05-23', sales: 14, revenue: 1398, orders: 3 },
    { date: '2026-05-24', sales: 20, revenue: 2298, orders: 6 },
    { date: '2026-05-25', sales: 16, revenue: 1596, orders: 4 },
    { date: '2026-05-26', sales: 22, revenue: 2487, orders: 6 },
  ];

  const userGrowth = [
    { date: '2026-05-20', newUsers: 4, totalUsers: 88 },
    { date: '2026-05-21', newUsers: 5, totalUsers: 93 },
    { date: '2026-05-22', newUsers: 3, totalUsers: 96 },
    { date: '2026-05-23', newUsers: 6, totalUsers: 102 },
    { date: '2026-05-24', newUsers: 7, totalUsers: 109 },
    { date: '2026-05-25', newUsers: 5, totalUsers: 114 },
    { date: '2026-05-26', newUsers: 6, totalUsers: 120 },
  ];

  const response = {
    totalProducts,
    totalOrders,
    totalRevenue,
    totalUsers,
    totalCustomers,
    recentOrders: orders.slice(-5),
    topProducts: products.slice(0, 5),
    salesTrend,
    userGrowth,
  };

  res.json(response);
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', authenticate, async (req, res) => {
  const product = { ...req.body, id: randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  products.push(product);
  try {
    await saveProducts();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save product' });
  }
});

app.put('/api/products/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body, updatedAt: new Date().toISOString() };
  try {
    await saveProducts();
    return res.json(products[index]);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save updated product' });
  }
});

app.delete('/api/products/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(index, 1);
  try {
    await saveProducts();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/api/orders', authenticate, (req, res) => {
  res.json(orders);
});

app.get('/api/users', authenticate, (req, res) => {
  res.json(users);
});

app.get('/api/reviews', authenticate, (req, res) => {
  res.json(reviews);
});

app.get('/api/feedback', authenticate, (req, res) => {
  res.json(feedback);
});

app.get('/api/testimonials', authenticate, (req, res) => {
  res.json(testimonials);
});

app.get('/api/banners', authenticate, (req, res) => {
  res.json(banners);
});

// Root route - Health check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Pahadi-Craft Backend API Server is running',
    version: '1.0.0',
    port: PORT,
    endpoints: {
      auth: 'POST /api/admin/login',
      analytics: 'GET /api/analytics',
      products: 'GET/POST/PUT/DELETE /api/products',
      orders: 'GET /api/orders',
      users: 'GET /api/users',
      reviews: 'GET /api/reviews',
      feedback: 'GET /api/feedback',
      testimonials: 'GET /api/testimonials',
      banners: 'GET /api/banners',
    },
  });
});

// Error handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

const startServer = async () => {
  await loadProducts();
  app.listen(PORT, () => {
    console.log(`Backend server is running at http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start backend server:', err);
  process.exit(1);
});
