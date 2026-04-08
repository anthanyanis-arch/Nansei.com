const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Coupon = require('../models/Coupon');

router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/validate', protect, async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon' });
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
