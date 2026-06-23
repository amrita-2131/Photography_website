const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const readJSON = (filename) => {
  const filepath = path.join(__dirname, '../data', filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
};

// GET /api/analytics/dashboard - Admin only
router.get('/dashboard', authenticate, requireAdmin, (req, res) => {
  try {
    const bookings = readJSON('bookings.json');
    const users = readJSON('users.json');
    const messages = readJSON('messages.json');
    const reviews = readJSON('reviews.json');

    // Aggregate Bookings
    const bookingStats = {
      total: bookings.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    let totalRevenue = 0;

    bookings.forEach(b => {
      if (bookingStats[b.status] !== undefined) {
        bookingStats[b.status]++;
      }
      if (b.paymentStatus && b.paymentStatus.toLowerCase() === 'paid' && b.totalAmount) {
        totalRevenue += Number(b.totalAmount);
      }
    });

    // Customers
    const totalCustomers = users.filter(u => u.role !== 'admin').length;

    const now = new Date();

    // Upcoming Events (Bookings with a date that is >= today)
    const upcomingEvents = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'pending')
      .filter(b => {
        if (!b.date) return false;
        const d = new Date(b.date);
        if (isNaN(d.getTime())) return false; // Invalid date format
        // Reset time to start of day for comparison
        const today = new Date();
        today.setHours(0,0,0,0);
        return d >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5); // Limit to next 5

    // Recent Bookings
    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Studio Recent Activity (Merge recent users, bookings, and payments/updates if applicable)
    let activities = [];
    
    // Add Booking Creations
    bookings.forEach(b => {
      activities.push({
        id: `book_create_${b.id}`,
        type: 'booking_created',
        icon: 'event',
        color: '#814f66',
        title: 'Booking Created',
        desc: `${b.userName} booked a ${b.sessionType} session.`,
        timestamp: b.createdAt
      });
      // Add booking updates if they are not equal to creation time
      if (b.updatedAt && b.updatedAt !== b.createdAt) {
        activities.push({
          id: `book_update_${b.id}_${b.updatedAt}`,
          type: 'booking_updated',
          icon: 'edit_calendar',
          color: b.status === 'cancelled' ? '#b91c1c' : '#15803d',
          title: `Booking ${b.status.charAt(0).toUpperCase() + b.status.slice(1)}`,
          desc: `Status for ${b.userName}'s session was updated.`,
          timestamp: b.updatedAt
        });
      }
    });

    // Add Client Registrations
    users.filter(u => u.role !== 'admin').forEach(u => {
      activities.push({
        id: `user_${u.id}`,
        type: 'client_added',
        icon: 'person_add',
        color: '#1d4ed8',
        title: 'New Client Registered',
        desc: `${u.name} created an account.`,
        timestamp: u.createdAt
      });
    });

    // Sort all activities descending and take top 10
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    activities = activities.slice(0, 10);

    const analytics = {
      bookingStats,
      totalRevenue,
      totalCustomers,
      unreadMessages: messages.filter(m => m.status === 'unread').length,
      pendingReviews: reviews.filter(r => !r.approved).length,
      recentBookings,
      upcomingEvents,
      activities
    };

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
});

module.exports = router;
