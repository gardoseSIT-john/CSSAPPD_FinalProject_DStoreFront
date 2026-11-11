const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Product, Order } = require('./model');

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Customer routes
app.get('/api/products', async (_req, res) => res.json(await Product.find()));
app.get('/api/products/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/orders', async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

// Admin routes (we'll protect these with JWT in step 4)
app.post('/api/products', async (req, res) => res.status(201).json(await Product.create(req.body)));

app.put('/api/products/:id', async (req, res) =>
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })));

app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get('/api/orders', async (_req, res) =>
  res.json(await Order.find({ status: 'pending' }).populate('product')));

app.patch('/api/orders/:id/complete', async (req, res) =>
  res.json(await Order.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true })));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(3000, () => console.log('API on :3000')))
  .catch(console.error);