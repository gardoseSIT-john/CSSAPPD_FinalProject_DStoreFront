const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: [String],
  description: String,
  tags: [String],            // e.g. "casual", "jackets"
  images: [String],          // URLs; first one is the ProductCell image
  price: Number,
});

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: String,
  customerName: { type: String, required: true },
  contact: String,
  dropOff: { type: String, required: true },   // delivery / drop-off point
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema),
};