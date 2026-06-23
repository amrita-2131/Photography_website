const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const reviewsFile = path.join(__dirname, '../data/reviews.json');

const readReviews = () => {
  if (!fs.existsSync(reviewsFile)) return [];
  return JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
};
const writeReviews = (r) => fs.writeFileSync(reviewsFile, JSON.stringify(r, null, 2));

// GET /api/reviews - Public can see approved, Admin can see all
router.get('/', (req, res) => {
  try {
    const reviews = readReviews();
    
    // Check if admin is requesting
    const authHeader = req.headers.authorization;
    let isAdmin = false;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
        const user = users.find(u => u.id === decoded.id);
        if (user && user.role === 'admin') isAdmin = true;
      } catch (e) {
        // Invalid token, ignore
      }
    }

    let filtered = reviews;
    if (!isAdmin) {
      filtered = reviews.filter(r => r.approved);
    }
    
    const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ reviews: sorted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// POST /api/reviews - Authenticated users can submit a review
router.post('/', authenticate, (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required.' });
    }

    const reviews = readReviews();
    const newReview = {
      id: uuidv4(),
      userId: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
      approved: false, // Needs admin approval
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    writeReviews(reviews);

    res.status(201).json({ message: 'Review submitted and pending approval.', review: newReview });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

// PATCH /api/reviews/:id/status - Admin only (approve/reject)
router.patch('/:id/status', authenticate, requireAdmin, (req, res) => {
  try {
    const { approved } = req.body;
    if (typeof approved !== 'boolean') {
      return res.status(400).json({ error: 'approved must be a boolean.' });
    }

    const reviews = readReviews();
    const idx = reviews.findIndex(r => r.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    reviews[idx].approved = approved;
    writeReviews(reviews);

    res.json({ message: `Review ${approved ? 'approved' : 'rejected'}.`, review: reviews[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review status.' });
  }
});

// DELETE /api/reviews/:id - Admin only
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const reviews = readReviews();
    const filtered = reviews.filter(r => r.id !== req.params.id);
    
    if (reviews.length === filtered.length) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    writeReviews(filtered);
    res.json({ message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review.' });
  }
});

module.exports = router;
