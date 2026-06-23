const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticate, requireAdmin } = require('../middleware/auth');

const multer = require('multer');

const router = express.Router();
const galleryFile = path.join(__dirname, '../data/gallery.json');

// Configure multer storage
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ storage: storage });

const readGallery = () => {
  if (!fs.existsSync(galleryFile)) return [];
  return JSON.parse(fs.readFileSync(galleryFile, 'utf8'));
};
const writeGallery = (g) => fs.writeFileSync(galleryFile, JSON.stringify(g, null, 2));

// GET /api/gallery - Public access to approved/all gallery images
router.get('/', (req, res) => {
  try {
    const images = readGallery();
    // In a real app, maybe only show approved or active, but here we show all.
    // Order by newest first
    const sorted = [...images].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ images: sorted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery.' });
  }
});

// POST /api/gallery - Admin only (add new image)
router.post('/', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  try {
    const { title, category } = req.body;
    let url = req.body.url;
    
    if (req.file) {
      url = `/uploads/${req.file.filename}`;
    }

    if (!url || !category) {
      return res.status(400).json({ error: 'Image file/URL and category are required.' });
    }

    const images = readGallery();
    const newImage = {
      id: uuidv4(),
      url: url.trim(),
      title: title ? title.trim() : '',
      category: category.trim(),
      createdAt: new Date().toISOString(),
    };

    images.push(newImage);
    writeGallery(images);

    res.status(201).json({ message: 'Image added successfully.', image: newImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add image.' });
  }
});

// DELETE /api/gallery/:id - Admin only
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const images = readGallery();
    const filtered = images.filter(img => img.id !== req.params.id);
    
    if (images.length === filtered.length) {
      return res.status(404).json({ error: 'Image not found.' });
    }

    writeGallery(filtered);
    res.json({ message: 'Image deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete image.' });
  }
});

module.exports = router;
