require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const Cart = require('../models/Cart');
const User = require('../models/User');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected');

  const phone = '6382142578';
  let user = await User.findOne({ phone });

  if (user) {
    user.name = 'Anto';
    user.role = 'admin';
    user.phoneVerified = true;
    user.emailVerified = true;
    await user.save({ validateBeforeSave: false });
    console.log('✅ Existing user updated to admin:', user.email);
  } else {
    user = await User.create({
      name: 'Anto',
      email: `${phone}@nansai.local`,
      password: require('crypto').randomBytes(20).toString('hex'),
      phone,
      role: 'admin',
      phoneVerified: true,
      emailVerified: true,
    });
    await Cart.create({ user: user._id, items: [] });
    console.log('✅ Admin user Anto created with phone', phone);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error('❌', err.message); process.exit(1); });
