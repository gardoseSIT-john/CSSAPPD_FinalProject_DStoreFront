// Backend/server.js
// Feature 1: connects to MongoDB, allows the Angular app (CORS) and exposes a health check.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';

if (!MONGO_URI) {
  console.error('MONGO_URI is missing. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const app = express();

// Only the Angular app's address may call this API from a browser.
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

// Temporary health check. The main page calls it to prove the API and CORS work.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Could not connect to MongoDB. Check MONGO_URI in Backend/.env.');
    console.error(err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start();
