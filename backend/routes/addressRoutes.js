const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Address = require('../models/Address');

// Map DB fields → frontend fields
function _fmt(a) {
  return {
    _id: a._id,
    name: a.fullName,
    phone: a.phone,
    line1: a.addressLine1,
    line2: a.addressLine2,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    isDefault: a.isDefault
  };
}

router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json({ success: true, data: addresses.map(_fmt) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, line1, line2, ...rest } = req.body;
    const address = await Address.create({
      ...rest,
      fullName: name,
      addressLine1: line1,
      addressLine2: line2,
      user: req.user.id
    });
    res.status(201).json({ success: true, data: _fmt(address) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { name, line1, line2, ...rest } = req.body;
    const update = { ...rest };
    if (name !== undefined) update.fullName = name;
    if (line1 !== undefined) update.addressLine1 = line1;
    if (line2 !== undefined) update.addressLine2 = line2;
    if (update.isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      update,
      { new: true, runValidators: true }
    );
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });
    res.json({ success: true, data: _fmt(address) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
