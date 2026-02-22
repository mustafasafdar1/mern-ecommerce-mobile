require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const BRAND_IMAGES = {
  Apple: [
    'https://images.unsplash.com/photo-1660774264529-4a5f6b5b6b1a?w=1200',
    'https://images.unsplash.com/photo-1696446702183-cbd3a57ce81f?w=1200'
  ],
  Samsung: [
    'https://images.unsplash.com/photo-1707303048080-dcaad7cb5f52?w=1200',
    'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=1200'
  ],
  Xiaomi: [
    'https://images.unsplash.com/photo-1522125670776-3c7abb882bc2?w=1200',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200'
  ],
  Google: [
    'https://images.unsplash.com/photo-1696446702183-cbd3a57ce81f?w=1200',
    'https://images.unsplash.com/photo-1598327105854-d0b62f02ea47?w=1200'
  ],
  OnePlus: [
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1200'
  ]
};

const run = async () => {
  await connectDB();
  try {
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    for (const p of products) {
      const brand = p.brand || '';
      const imgs = BRAND_IMAGES[brand] || [];
      if (imgs.length > 0) {
        p.images = imgs;
        // provide a smaller mobile image as mobileImages
        p.mobileImages = imgs.map(u => u.replace('w=1200', 'w=600'));
        await p.save();
        console.log(`Updated ${p._id} (${p.name}) -> ${brand}`);
      } else {
        // keep existing images, but ensure mobileImages exists
        if ((!p.mobileImages || p.mobileImages.length === 0) && p.images && p.images.length > 0) {
          p.mobileImages = p.images.map(u => u + '&w=600');
          await p.save();
          console.log(`Added mobileImages for ${p._id} (${p.name})`);
        } else {
          console.log(`Skipped ${p._id} (${p.name}) - no mapping for brand: ${brand}`);
        }
      }
    }

    console.log('✅ Done updating product images.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating products', err);
    process.exit(1);
  }
};

run();
