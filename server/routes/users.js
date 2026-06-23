const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const usersFile = path.join(__dirname, '../data/users.json');

const readUsers = () => JSON.parse(fs.readFileSync(usersFile, 'utf8'));
const writeUsers = (u) => fs.writeFileSync(usersFile, JSON.stringify(u, null, 2));

const safeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

// GET /api/users/profile
router.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// GET /api/users/all - Admin only
router.get('/all', authenticate, requireAdmin, (req, res) => {
  try {
    const users = readUsers().filter(u => u.role !== 'admin').map(safeUser);
    
    // Also attach booking counts for convenience
    const bookingsFile = path.join(__dirname, '../data/bookings.json');
    let bookings = [];
    if (fs.existsSync(bookingsFile)) {
      bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
    }
    
    const usersWithStats = users.map(u => ({
      ...u,
      totalBookings: bookings.filter(b => b.userId === u.id).length,
    }));
    
    res.json({ users: usersWithStats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// PATCH /api/users/profile
router.patch('/profile', authenticate, (req, res) => {
  try {
    const { name, phone } = req.body;
    const users = readUsers();
    const idx = users.findIndex(u => u.id === req.user.id);

    if (idx === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (name) users[idx].name = name.trim();
    if (phone !== undefined) users[idx].phone = phone.trim();
    users[idx].updatedAt = new Date().toISOString();

    writeUsers(users);
    res.json({ message: 'Profile updated.', user: safeUser(users[idx]) });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;
