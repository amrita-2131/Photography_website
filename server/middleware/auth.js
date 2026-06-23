const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    // Attach user without password
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token. Please log in.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
};

module.exports = { authenticate, requireAdmin };
