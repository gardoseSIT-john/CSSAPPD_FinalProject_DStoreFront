const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// F1: validate settings and exit with a clear message
const missing = ['MONGO_URI', 'JWT_SECRET'].filter((k) => !process.env[k]?.trim());
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(', ')}. Check backend/server/.env`);
  process.exit(1);
}
if (!/^mongodb(\+srv)?:\/\//.test(process.env.MONGO_URI)) {
  console.error('MONGO_URI must start with mongodb:// or mongodb+srv://');
  process.exit(1);
}

// Admin login
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Product, Order, Admin } = require('./model');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:4200' }));
app.use(express.json());

// F2: turn Mongoose errors into clean responses
function handleError(res, e) {
  if (e.name === 'ValidationError') {
    const details = Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v.message]));
    return res.status(400).json({ error: 'Validation failed', details });
  }
  if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
  console.error(e);
  res.status(500).json({ error: 'Server error' });
}

// Removed products are hidden, not deleted. $ne:false also matches older documents without the field.
const visible = { isActive: { $ne: false } };

// ---------- Customer routes ----------
app.get('/api/products', async (_req, res) => {
  try { res.json(await Product.find(visible)); } catch (e) { handleError(res, e); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const p = await Product.findOne({ _id: req.params.id, ...visible });
    p ? res.json(p) : res.status(404).json({ error: 'Not found' });
  } catch (e) { handleError(res, e); }
});

// Name, price and image are copied from the database, never trusted from the browser
app.post('/api/orders', async (req, res) => {
  try {
    const { items, customerName, contactNumber, address, paymentMethod, paymentReference } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Validation failed', details: { items: 'An order needs at least one item' } });
    }

    const lines = [];
    for (const it of items) {
      const p = await Product.findOne({ _id: it.product, ...visible, status: 'available' });
      if (!p) return res.status(400).json({ error: 'A product is no longer available' });
      lines.push({
        product: p._id,
        name: p.name,
        size: it.size,
        price: p.price,
        image: p.images[0],
        quantity: it.quantity ?? 1,
      });
    }

    const order = await Order.create({
      items: lines, customerName, contactNumber, address, paymentMethod, paymentReference,
    });
    res.status(201).json(order);
  } catch (e) { handleError(res, e); }
});

// ---------- Admin login ----------
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

// ---------- Middleware for protected routes ----------
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

// ---------- Admin routes ----------
app.post('/api/products', requireAdmin, async (req, res) => {
  try { res.status(201).json(await Product.create(req.body)); } catch (e) { handleError(res, e); }
});

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    p ? res.json(p) : res.status(404).json({ error: 'Not found' });
  } catch (e) { handleError(res, e); }
});

// Soft delete: hide the product, keep the document so old orders stay intact
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false, removedAt: new Date() });
    res.status(204).end();
  } catch (e) { handleError(res, e); }
});

app.get('/api/orders', requireAdmin, async (_req, res) => {
  try { res.json(await Order.find({ status: 'pending' }).sort({ createdAt: -1 })); } catch (e) { handleError(res, e); }
});

app.patch('/api/orders/:id/complete', requireAdmin, async (req, res) => {
  try {
    const o = await Order.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    o ? res.json(o) : res.status(404).json({ error: 'Not found' });
  } catch (e) { handleError(res, e); }
});

// Start only after the DB connects; stop with a clear message if it cannot
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API on :${PORT}`));
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });