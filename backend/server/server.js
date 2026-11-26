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

//F[4] Updates
// Only these fields can be set through add/update. Flags change through hide, unhide and remove.
const EDITABLE = ['name', 'size', 'description', 'tags', 'images', 'price', 'status'];
const pick = (body = {}) => Object.fromEntries(EDITABLE.filter((k) => k in body).map((k) => [k, body[k]]));

// What the public may see
const listed = { status: 'available', isActive: true, removedAt: null }; // shop list
const viewable = { isActive: true, removedAt: null };                    // product page (any status)

// ---------- Customer routes ----------
app.get('/api/products', async (_req, res) => {
  try { res.json(await Product.find(listed)); } catch (e) { handleError(res, e); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Not found' });
    const p = await Product.findOne({ _id: req.params.id, ...viewable });
    p ? res.json(p) : res.status(404).json({ error: 'Not found' });
  } catch (e) { handleError(res, e); }
});

// Name, price and image are copied from the database, never trusted from the browser
app.post('/api/orders', async (req, res) => {
  try {
    const { items, customerName, contactNumber, address, paymentMethod, paymentReference } = req.body ?? {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Validation failed', details: { items: 'An order needs at least one item' } });
    }

    const lines = [];
    for (const it of items) {
      if (!mongoose.isValidObjectId(it.product)) return res.status(400).json({ error: 'A product is no longer available' });
      const p = await Product.findOne({ _id: it.product, ...listed });
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
    const { username, password } = req.body ?? {};
    const admin = await Admin.findOne({ username });
    const ok = admin && (await bcrypt.compare(password ?? '', admin.passwordHash));
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
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
    if (req.admin.role !== 'admin') throw new Error('not admin');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}


// ---------- Admin routes ----------
// Every product, including hidden and removed, with their flags
app.get('/api/admin/products', requireAdmin, async (_req, res) => {
  try { res.json(await Product.find().sort({ _id: -1 })); } catch (e) { handleError(res, e); }
});

app.post('/api/products', requireAdmin, async (req, res) => {
  try { res.status(201).json(await Product.create(pick(req.body))); } catch (e) { handleError(res, e); }
});

// Load, assign, save: the whole document is validated, not only the changed fields
app.put('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const p = await Product.findOne({ _id: req.params.id, removedAt: null });
    if (!p) return res.status(404).json({ error: 'Not found' });
    p.set(pick(req.body));
    res.json(await p.save());
  } catch (e) { handleError(res, e); }
});

// Hide / unhide: toggles isActive without touching removedAt
function setActive(value) {
  return async (req, res) => {
    try {
      const p = await Product.findOneAndUpdate(
        { _id: req.params.id, removedAt: null },
        { isActive: value },
        { new: true },
      );
      p ? res.json(p) : res.status(404).json({ error: 'Not found' });
    } catch (e) { handleError(res, e); }
  };
}
app.patch('/api/products/:id/hide', requireAdmin, setActive(false));
app.patch('/api/products/:id/unhide', requireAdmin, setActive(true));

// Soft delete: the product is marked removed, but the document is kept so old orders stay intact
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const p = await Product.findOneAndUpdate(
      { _id: req.params.id, removedAt: null },
      { removedAt: new Date() },
      { new: true },
    );
    p ? res.json(p) : res.status(404).json({ error: 'Not found' });
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

// Malformed JSON bodies get a 400 instead of an HTML error page
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  res.status(500).json({ error: 'Server error' });
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