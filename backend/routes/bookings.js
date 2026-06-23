const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const bookingsFile = path.join(__dirname, '../data/bookings.json');

const readBookings = () => JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
const writeBookings = (b) => fs.writeFileSync(bookingsFile, JSON.stringify(b, null, 2));

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
const VALID_TYPES = ['Wedding', 'Maternity', 'Birthday', 'School Event', 'College Event', 'Life Celebration', 'Other'];

// POST /api/bookings — create booking (authenticated users)
router.post('/', authenticate, (req, res) => {
  try {
    const { sessionType, date, location, message, name, email, phone, pkg, eventDays, guests, needAlbum, needDrone, needVideo, subtotal, tax, totalAmount, paymentStatus, transactionId } = req.body;

    if (!sessionType || !name || !email) {
      return res.status(400).json({ error: 'Session type, name, and email are required.' });
    }

    if (!VALID_TYPES.includes(sessionType)) {
      return res.status(400).json({ error: 'Invalid session type.' });
    }

    const bookings = readBookings();
    const newBooking = {
      id: uuidv4(),
      bookingRef: `PM-${Date.now().toString().slice(-5)}`,
      userId: req.user.id,
      userName: name.trim(),
      userEmail: email.trim(),
      userPhone: phone ? phone.trim() : '',
      sessionType,
      selectedPackage: pkg || 'None',
      eventDays: eventDays || 1,
      guests: guests || 0,
      needAlbum: needAlbum || false,
      needDrone: needDrone || false,
      needVideo: needVideo || false,
      subtotal: subtotal || 0,
      tax: tax || 0,
      totalAmount: totalAmount || 0,
      paymentStatus: paymentStatus || 'Pending',
      transactionId: transactionId || '',
      date: date || '',
      location: location ? location.trim() : '',
      message: message ? message.trim() : '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    writeBookings(bookings);

    res.status(201).json({
      message: 'Booking submitted successfully!',
      booking: newBooking,
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Failed to submit booking. Please try again.' });
  }
});

// GET /api/bookings/my — current user's bookings
router.get('/my', authenticate, (req, res) => {
  try {
    const bookings = readBookings();
    const userBookings = bookings
      .filter(b => b.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ bookings: userBookings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// GET /api/bookings/all — admin: all bookings
router.get('/all', authenticate, requireAdmin, (req, res) => {
  try {
    const bookings = readBookings();
    const sorted = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ bookings: sorted, total: sorted.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// PATCH /api/bookings/:id/status — admin: update status
router.patch('/:id/status', authenticate, requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const bookings = readBookings();
    const idx = bookings.findIndex(b => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    bookings[idx].status = status;
    bookings[idx].updatedAt = new Date().toISOString();
    writeBookings(bookings);

    res.json({ message: 'Status updated.', booking: bookings[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

module.exports = router;
