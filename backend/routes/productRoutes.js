const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const Product = require('../models/Product');

// Admin: get ALL products (including inactive)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { search, category, page = 1, limit = 100 } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);
    res.json({ success: true, products, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
