const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Combo = require('../models/Combo');

router.get('/', async (req, res) => {
  try {
    const combos = await Combo.find().populate('products');
    res.json({ success: true, data: combos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const combo = await Combo.create(req.body);
    res.status(201).json({ success: true, data: combo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
