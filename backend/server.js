const express     = require('express');
const dns         = require('dns');
const path        = require('path');
const cors        = require('cors');
const helmet      = require('helmet');
const compression = require('compression');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');
const jwt         = require('jsonwebtoken');
require('dotenv').config();

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

// ── Route imports ──
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes= require('./routes/categoryRoutes');
const cartRoutes    = require('./routes/cartRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const wishlistRoutes= require('./routes/wishlistRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');
const userRoutes    = require('./routes/userRoutes');
const comboRoutes   = require('./routes/comboRoutes');
const addressRoutes = require('./routes/addressRoutes');
const couponRoutes  = require('./routes/couponRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// ── Model imports (top-level, not lazy) ──
const User = require('./models/User');

const errorHandler = require('./middleware/errorHandler');
const { protect, authorize } = require('./middleware/auth');
const connectDB = require('./config/database');

const app = express();

// ── Security ──
app.use(helmet());

// ── Rate limiting ──
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
}));

// ── CORS ──
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    if (process.env.NODE_ENV !== 'production') return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  // SameSite cookie protection (CSRF mitigation)
  exposedHeaders: ['Set-Cookie'],
}));

// ── Body parsers ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Compression & logging ──
app.use(compression());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── DB ──
connectDB();

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// ── API Routes ──
app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/wishlist',  wishlistRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/combos',    comboRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/coupons',   couponRoutes);
app.use('/api/payment',   paymentRoutes);

// ── 404 for unknown API routes ──
app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Admin panel (server-gated) ──
app.get('/admin', async (req, res) => {
  const token = req.query.token || req.cookies?.nansai_admin_token;
  if (!token) return res.redirect('/admin-login');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('role');
    if (!user || user.role !== 'admin') return res.redirect('/admin-login');
    res.sendFile(path.join(__dirname, '..', 'pages', 'admin.html'));
  } catch {
    res.redirect('/admin-login');
  }
});

app.get('/admin-login', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'admin-login.html'));
});

// ── Static frontend ──
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

if (process.env.NODE_ENV === 'production') {
  app.get('*', (_req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
} else {
  app.use('*', (_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
}

// ── Error handler ──
app.use(errorHandler);

// ── Start ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});
