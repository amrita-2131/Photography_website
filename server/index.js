require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const galleryRoutes = require('./routes/gallery');
const reviewsRoutes = require('./routes/reviews');
const messagesRoutes = require('./routes/messages');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const usersFile = path.join(dataDir, 'users.json');
const bookingsFile = path.join(dataDir, 'bookings.json');
const galleryFile = path.join(dataDir, 'gallery.json');
const reviewsFile = path.join(dataDir, 'reviews.json');
const messagesFile = path.join(dataDir, 'messages.json');

if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
if (!fs.existsSync(bookingsFile)) fs.writeFileSync(bookingsFile, JSON.stringify([], null, 2));
if (!fs.existsSync(galleryFile)) fs.writeFileSync(galleryFile, JSON.stringify([], null, 2));
if (!fs.existsSync(reviewsFile)) fs.writeFileSync(reviewsFile, JSON.stringify([], null, 2));
if (!fs.existsSync(messagesFile)) fs.writeFileSync(messagesFile, JSON.stringify([], null, 2));

// Seed admin account if not exists
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const seedAdmin = async () => {
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  const adminExists = users.find(u => u.email === 'admin21@gmail.com');
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('245301', 12);
    users.push({
      id: uuidv4(),
      name: 'Adeline Rose',
      email: 'admin21@gmail.com',
      phone: '+1 (555) 234-5678',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    console.log('✅ Admin account seeded: admin21@gmail.com / 245301');
  }
};

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pixel Memories API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start
seedAdmin().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Pixel Memories API running on http://localhost:${PORT}`);
  });
});
