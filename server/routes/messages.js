const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const messagesFile = path.join(__dirname, '../data/messages.json');

const readMessages = () => {
  if (!fs.existsSync(messagesFile)) return [];
  return JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
};
const writeMessages = (m) => fs.writeFileSync(messagesFile, JSON.stringify(m, null, 2));

// GET /api/messages - Admin only
router.get('/', authenticate, requireAdmin, (req, res) => {
  try {
    const messages = readMessages();
    const sorted = [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ messages: sorted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// POST /api/messages - Public (Contact form)
router.post('/', (req, res) => {
  try {
    const { name, email, subject, content } = req.body;
    if (!name || !email || !content) {
      return res.status(400).json({ error: 'Name, email, and content are required.' });
    }

    const messages = readMessages();
    const newMessage = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : 'No Subject',
      content: content.trim(),
      status: 'unread', // unread, read, archived
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    writeMessages(messages);

    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// PATCH /api/messages/:id/status - Admin only
router.patch('/:id/status', authenticate, requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const messages = readMessages();
    const idx = messages.findIndex(m => m.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    messages[idx].status = status;
    writeMessages(messages);

    res.json({ message: 'Message status updated.', messageObj: messages[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message.' });
  }
});

// DELETE /api/messages/:id - Admin only
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const messages = readMessages();
    const filtered = messages.filter(m => m.id !== req.params.id);
    
    if (messages.length === filtered.length) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    writeMessages(filtered);
    res.json({ message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message.' });
  }
});

module.exports = router;
