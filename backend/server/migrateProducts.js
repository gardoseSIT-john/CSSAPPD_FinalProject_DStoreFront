//Using this to migrate existing products from the old schema to the new one. A just in case function.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { Product } = require('./model');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const a = await Product.updateMany({ status: { $exists: false } }, { $set: { status: 'available' } });
  const b = await Product.updateMany({ isActive: { $exists: false } }, { $set: { isActive: true } });
  const c = await Product.updateMany({ removedAt: { $exists: false } }, { $set: { removedAt: null } });
  console.log('Updated:', a.modifiedCount, b.modifiedCount, c.modifiedCount);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());