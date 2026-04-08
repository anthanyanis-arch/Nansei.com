const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Cart = require('../models/Cart');

router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json({ success: true, data: cart || { items: [], totalPrice: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const Product = require('../models/Product');
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [{ product: productId, quantity, price: product.price }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }
      await cart.save();
    }

    await cart.populate('items.product');
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    
    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
