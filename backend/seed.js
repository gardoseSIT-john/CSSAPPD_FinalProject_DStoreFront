const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { Product } = require('./model');

const items = [
  { name: 'Denim Jacket', size: ['S', 'M', 'L'], description: 'Classic denim jacket.', tags: ['jackets', 'casual'], images: ['https://picsum.photos/seed/jacket/400'], price: 1200 },
  { name: 'White Tee', size: ['M', 'L'], description: 'Plain cotton tee.', tags: ['casual', 'shirts'], images: ['https://picsum.photos/seed/tee/400'], price: 350 },
  { name: 'Rain Windbreaker', size: ['S', 'M'], description: 'Light and water resistant.', tags: ['jackets', 'outdoor'], images: ['https://picsum.photos/seed/wind/400'], price: 900 },
];

mongoose.connect(process.env.MONGO_URI)
  .then(() => Product.insertMany(items))
  .then(() => { console.log('Seeded'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });