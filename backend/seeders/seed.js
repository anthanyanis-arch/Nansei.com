require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const Product = require('../models/Product');

const products = [
  /* ── RICE VARIETIES ── */
  {
    name: 'Karunguruvai Rice', category: 'rice', price: 180, oldPrice: 220,
    rating: 4.7, numReviews: 142, badge: 'hot', section: 'bestseller',
    stock: 100, unit: 'kg', weight: 1, isFeatured: true, isActive: true,
    description: 'Karunguruvai is a traditional short-grain rice variety from Tamil Nadu, known for its rich aroma and high nutritional value. Grown without pesticides.',
    images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop' }],
    tags: ['rice', 'traditional', 'tamil', 'organic']
  },
  {
    name: 'Karuppu Kavuni (Black Kavuni Rice)', category: 'rice', price: 220, oldPrice: 270,
    rating: 4.8, numReviews: 198, badge: 'hot', section: 'bestseller',
    stock: 80, unit: 'kg', weight: 1, isFeatured: true, isActive: true,
    description: 'Black Kavuni rice is an ancient variety packed with antioxidants and anthocyanins. Traditionally used in Tamil Nadu for sweet dishes and health benefits.',
    images: [{ url: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=500&auto=format&fit=crop' }],
    tags: ['rice', 'black rice', 'kavuni', 'antioxidant']
  },
  {
    name: 'Arubatham Kuruvai Rice', category: 'rice', price: 160, oldPrice: 200,
    rating: 4.5, numReviews: 87, badge: 'new', section: 'new',
    stock: 120, unit: 'kg', weight: 1, isFeatured: false, isActive: true,
    description: 'Arubatham Kuruvai is a short-duration traditional rice variety known for its soft texture and mild flavour. Ideal for daily cooking.',
    images: [{ url: 'https://images.unsplash.com/photo-1514481538271-cf9f99627ab4?w=500&auto=format&fit=crop' }],
    tags: ['rice', 'traditional', 'kuruvai', 'soft']
  },
  {
    name: 'Poongar Rice', category: 'rice', price: 200, oldPrice: 250,
    rating: 4.6, numReviews: 113, badge: 'sale', section: 'bestseller',
    stock: 90, unit: 'kg', weight: 1, isFeatured: true, isActive: true,
    description: 'Poongar rice is a red variety rich in iron and zinc, traditionally recommended for pregnant women and new mothers. Nutty flavour with high fibre content.',
    images: [{ url: 'https://images.unsplash.com/photo-1603046891744-5d7f1f4b79fa?w=500&auto=format&fit=crop' }],
    tags: ['rice', 'poongar', 'red rice', 'iron', 'zinc']
  },
  {
    name: 'Mappillai Samba (Mani Samba) Rice', category: 'rice', price: 210, oldPrice: 260,
    rating: 4.7, numReviews: 156, badge: 'hot', section: 'bestseller',
    stock: 75, unit: 'kg', weight: 1, isFeatured: true, isActive: true,
    description: 'Mappillai Samba is a bold, energy-rich rice variety traditionally given to bridegrooms for strength. High in fibre and minerals.',
    images: [{ url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop' }],
    tags: ['rice', 'mappillai samba', 'energy', 'traditional']
  },
  {
    name: 'Iluppai Poo Samba Rice', category: 'rice', price: 195, oldPrice: 240,
    rating: 4.5, numReviews: 74, badge: 'new', section: 'new',
    stock: 60, unit: 'kg', weight: 1, isFeatured: false, isActive: true,
    description: 'Iluppai Poo Samba is a fragrant traditional rice variety named after the Mahua flower. Soft texture with a pleasant aroma.',
    images: [{ url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop' }],
    tags: ['rice', 'samba', 'fragrant', 'traditional']
  },
  {
    name: 'Vellai Kavuni (White Kavuni Rice)', category: 'rice', price: 190, oldPrice: 235,
    rating: 4.6, numReviews: 91, badge: 'new', section: 'new',
    stock: 70, unit: 'kg', weight: 1, isFeatured: false, isActive: true,
    description: 'White Kavuni is the lighter counterpart of Black Kavuni, with a soft sticky texture. Perfect for traditional Tamil sweets and payasam.',
    images: [{ url: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=500&auto=format&fit=crop' }],
    tags: ['rice', 'kavuni', 'white', 'sticky', 'sweet']
  },

  /* ── DRIED FLOWERS ── */
  {
    name: 'Paneer Rose (Fragrant Rose)', category: 'flowers', price: 150, oldPrice: 190,
    rating: 4.8, numReviews: 204, badge: 'hot', section: 'bestseller',
    stock: 50, unit: 'g', weight: 100, isFeatured: true, isActive: true,
    description: 'Sun-dried Paneer Rose petals with an intense fragrance. Used in rose milk, sherbets, face packs and Ayurvedic preparations.',
    images: [{ url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=500&auto=format&fit=crop' }],
    tags: ['flowers', 'rose', 'paneer rose', 'dried', 'fragrant']
  },
  {
    name: 'Hibiscus Flower', category: 'flowers', price: 120, oldPrice: 155,
    rating: 4.6, numReviews: 167, badge: 'sale', section: 'bestseller',
    stock: 60, unit: 'g', weight: 100, isFeatured: true, isActive: true,
    description: 'Dried hibiscus flowers rich in Vitamin C and antioxidants. Used for hair care, herbal teas and natural food colouring.',
    images: [{ url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop' }],
    tags: ['flowers', 'hibiscus', 'vitamin C', 'hair care', 'tea']
  },
  {
    name: 'Aavaram Flower', category: 'flowers', price: 110, oldPrice: 145,
    rating: 4.5, numReviews: 88, badge: 'new', section: 'new',
    stock: 45, unit: 'g', weight: 100, isFeatured: false, isActive: true,
    description: 'Aavaram (Tanner\'s Cassia) flowers are used in traditional medicine for skin health, diabetes management and as a natural detox.',
    images: [{ url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=500&auto=format&fit=crop' }],
    tags: ['flowers', 'aavaram', 'ayurvedic', 'skin', 'detox']
  },
  {
    name: 'Butterfly Pea Flower', category: 'flowers', price: 180, oldPrice: 220,
    rating: 4.7, numReviews: 132, badge: 'hot', section: 'bestseller',
    stock: 40, unit: 'g', weight: 50, isFeatured: true, isActive: true,
    description: 'Vibrant blue butterfly pea flowers that change colour with pH. Used in teas, lemonades, rice dishes and natural food colouring.',
    images: [{ url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop' }],
    tags: ['flowers', 'butterfly pea', 'blue', 'colour changing', 'tea']
  },

  /* ── BEVERAGES ── */
  {
    name: 'Organic Real Rose Milk', category: 'beverages', price: 140, oldPrice: 175,
    rating: 4.7, numReviews: 219, badge: 'hot', section: 'bestseller',
    stock: 80, unit: 'ml', weight: 200, isFeatured: true, isActive: true,
    description: 'Made with real Paneer Rose extract and organic A2 milk. No artificial colours or flavours. A traditional Tamil Nadu favourite.',
    images: [{ url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop' }],
    tags: ['beverages', 'rose milk', 'organic', 'A2 milk', 'traditional']
  },
  {
    name: 'Hibiscus Sherbet', category: 'beverages', price: 130, oldPrice: 165,
    rating: 4.6, numReviews: 143, badge: 'sale', section: 'bestseller',
    stock: 70, unit: 'ml', weight: 200, isFeatured: false, isActive: true,
    description: 'Refreshing hibiscus sherbet made from fresh hibiscus flowers. Rich in Vitamin C, naturally cooling and great for summer.',
    images: [{ url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop' }],
    tags: ['beverages', 'hibiscus', 'sherbet', 'cooling', 'summer']
  },

  /* ── FLOUR VARIETIES ── */
  {
    name: 'Hand-pounded Rice Idiyappam Flour', category: 'flour', price: 160, oldPrice: 200,
    rating: 4.8, numReviews: 178, badge: 'hot', section: 'bestseller',
    stock: 100, unit: 'kg', weight: 1, isFeatured: true, isActive: true,
    description: 'Traditional hand-pounded rice flour for making soft, silky idiyappam. No preservatives, no additives — just pure rice.',
    images: [{ url: 'https://images.unsplash.com/photo-1603046891744-5d7f1f4b79fa?w=500&auto=format&fit=crop' }],
    tags: ['flour', 'idiyappam', 'rice flour', 'hand-pounded', 'traditional']
  },
  {
    name: 'Black Urad Dal Health Mix Powder', category: 'flour', price: 175, oldPrice: 215,
    rating: 4.6, numReviews: 94, badge: 'new', section: 'new',
    stock: 90, unit: 'kg', weight: 1, isFeatured: false, isActive: true,
    description: 'Nutritious health mix made from black urad dal and traditional grains. High in protein and calcium. Ideal for babies and adults.',
    images: [{ url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop' }],
    tags: ['flour', 'health mix', 'urad dal', 'protein', 'calcium']
  },

  /* ── OTHER ── */
  {
    name: 'Country Fig Powder', category: 'other', price: 200, oldPrice: 250,
    rating: 4.7, numReviews: 61, badge: 'new', section: 'new',
    stock: 55, unit: 'g', weight: 100, isFeatured: false, isActive: true,
    description: 'Sun-dried country fig (Athi Pazham) powder — a natural remedy for digestive health, rich in fibre and iron.',
    images: [{ url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop' }],
    tags: ['other', 'fig', 'athi pazham', 'digestive', 'fibre']
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Add slug to each product (model pre-save hook doesn't run on insertMany)
    const withSlugs = products.map(p => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    const inserted = await Product.insertMany(withSlugs);
    console.log(`✅ Seeded ${inserted.length} Nansai Organics products`);

    await mongoose.disconnect();
    console.log('✅ Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
