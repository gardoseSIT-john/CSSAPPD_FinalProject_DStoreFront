const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//Admin Login Constatns 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Product, Order, Admin } = require('./model');

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

// Admin routes (Protected Now)
app.post('/api/products', requireAdmin, async (req, res) => res.status(201).json(await Product.create(req.body)));

app.put('/api/products/:id',requireAdmin, async (req, res) =>
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })));

app.delete('/api/products/:id',requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get('/api/orders',requireAdmin, async (_req, res) =>
  res.json(await Order.find({ status: 'pending' }).populate('product')));

app.patch('/api/orders/:id/complete',requireAdmin, async (req, res) =>
  res.json(await Order.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true })));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(3000, () => console.log('API on :3000')))
  .catch(console.error);

  //Admin Login Stuff

  // ## Login
  app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    console.log('Login attempt:', username, 'found:', !!admin);

    const ok = admin && (await bcrypt.compare(password ?? '', admin.passwordHash));
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });
    res.json({ token });
  } catch (e) {
    console.error('Login error:', e.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ## MiddleWare used for protecting routes.
function requireAdmin(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}