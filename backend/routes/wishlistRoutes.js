const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json({ success: true, data: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/add/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(req.params.productId)) {
      user.wishlist.push(req.params.productId);
      await user.save();
    }
    res.json({ success: true, data: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.json({ success: true, data: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
