const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword, ...fields } = req.body;
    if (newPassword) {
      const user = await User.findById(req.user.id).select('+password');
      const match = await user.comparePassword(currentPassword || '');
      if (!match) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      user.password = newPassword;
      Object.assign(user, fields);
      await user.save();
      const updated = await User.findById(req.user.id).select('-password');
      return res.json({ success: true, data: updated });
    }
    const user = await User.findByIdAndUpdate(req.user.id, fields, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort('-createdAt');
    // Aggregate order counts and total spent per user
    const Order = require('../models/Order');
    const orderStats = await Order.aggregate([
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpent: { $sum: '$totalPrice' } } }
    ]);
    const statsMap = {};
    orderStats.forEach(s => { statsMap[s._id.toString()] = s; });
    const usersWithStats = users.map(u => ({
      ...u.toObject(),
      orderCount: statsMap[u._id.toString()]?.orderCount || 0,
      totalSpent: statsMap[u._id.toString()]?.totalSpent || 0
    }));
    res.json({ success: true, data: usersWithStats, total: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/users/activity  — log an activity event
router.post('/activity', protect, async (req, res) => {
  try {
    const { type, description, meta } = req.body;
    if (!type) return res.status(400).json({ success: false, message: 'type is required' });
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        activityHistory: {
          $each: [{ type, description, meta }],
          $slice: -200   // keep last 200 events
        }
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/users/activity  — fetch activity history
router.get('/activity', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('activityHistory');
    const history = (user.activityHistory || []).slice().reverse(); // newest first
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
