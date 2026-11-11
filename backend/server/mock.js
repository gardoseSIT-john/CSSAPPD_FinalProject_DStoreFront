const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());


const products = [
  { _id: '1', name: 'Denim Jacket', size: ['S', 'M', 'L'], description: 'Classic denim jacket.', tags: ['jackets', 'casual'], images: ['https://picsum.photos/seed/jacket/400'], price: 1200 },
  { _id: '2', name: 'White Tee', size: ['M', 'L'], description: 'Plain cotton tee.', tags: ['casual', 'shirts'], images: ['https://picsum.photos/seed/tee/400'], price: 350 },
  { _id: '3', name: 'Rain Windbreaker', size: ['S', 'M'], description: 'Light and water resistant.', tags: ['jackets', 'outdoor'], images: ['https://picsum.photos/seed/wind/400'], price: 900 },
];

app.get('/api/products', (_req, res) => res.json(products));
app.get('/api/products/:id', (req, res) => {
  const p = products.find((x) => x._id === req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});

app.post('/api/orders', (req, res) => {
  console.log('New order:', req.body);
  res.status(201).json({ _id: 'o1', status: 'pending', createdAt: new Date().toISOString(), ...req.body });
});



app.listen(3000, () => console.log('Mock API on :3000'));